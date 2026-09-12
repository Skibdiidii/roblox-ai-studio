import { Project, ValidationResult } from '../types';

export function validateRobloxProject(project: Project): ValidationResult[] {
  const issues: ValidationResult[] = [];
  const files = project.files;
  const fileKeys = Object.keys(files);

  const hasServerScriptService = fileKeys.some(k => k.startsWith('ServerScriptService'));
  const hasReplicatedStorage = fileKeys.some(k => k.startsWith('ReplicatedStorage'));
  const hasStarterGui = fileKeys.some(k => k.startsWith('StarterGui'));
  const hasStarterPlayer = fileKeys.some(k => k.startsWith('StarterPlayer'));

  if (!hasServerScriptService) {
    issues.push({
      id: 'rule-missing-serverscriptservice',
      file: 'Project Structure',
      line: 1,
      problem: 'Missing required folder ServerScriptService for server-authoritative logic.',
      suggestedFix: 'Add at least one server script in ServerScriptService/ (e.g. Main.server.lua).',
      severity: 'error'
    });
  }

  if (!hasReplicatedStorage) {
    issues.push({
      id: 'rule-missing-replicatedstorage',
      file: 'Project Structure',
      line: 1,
      problem: 'Missing ReplicatedStorage folder for shared Modules and RemoteEvents.',
      suggestedFix: 'Create ReplicatedStorage/Remotes/ and ReplicatedStorage/Modules/ to share assets with clients.',
      severity: 'warning'
    });
  }

  if (!hasStarterGui && !hasStarterPlayer) {
    issues.push({
      id: 'rule-missing-client',
      file: 'Project Structure',
      line: 1,
      problem: 'No client-side scripts found in StarterGui or StarterPlayer.',
      suggestedFix: 'Add a LocalScript in StarterGui/ or StarterPlayerScripts/ to handle user input.',
      severity: 'warning'
    });
  }

  for (const [filePath, file] of Object.entries(files)) {
    if (file.language !== 'luau' && file.language !== 'lua') continue;
    const lines = file.content.split('\n');
    const isClientScript = filePath.includes('.client.') || filePath.startsWith('StarterGui') || filePath.startsWith('StarterPlayer');
    const isServerScript = filePath.includes('.server.') || filePath.startsWith('ServerScriptService') || filePath.startsWith('ServerStorage');

    let blockDepth = 0;
    let insideWhileLoop = false;
    let whileLoopLine = 0;
    let hasWaitInWhile = false;

    for (let i = 0; i < lines.length; i++) {
      const lineNum = i + 1;
      const lineText = lines[i];
      const trimmed = lineText.trim();

      if (!trimmed) continue;

      if (isClientScript) {
        if (trimmed.includes('DataStoreService')) {
          issues.push({
            id: `sec-datastore-client-${filePath}-${lineNum}`,
            file: filePath,
            line: lineNum,
            problem: 'Client-Side Security Violation: DataStoreService cannot be accessed from a LocalScript.',
            suggestedFix: 'Move DataStore logic to a server script in ServerScriptService and invoke via RemoteFunction.',
            severity: 'error',
            codeSnippet: lineText
          });
        }

        if (trimmed.includes('ServerScriptService') || trimmed.includes('ServerStorage')) {
          issues.push({
            id: `sec-serverservice-client-${filePath}-${lineNum}`,
            file: filePath,
            line: lineNum,
            problem: 'Broken Reference: LocalScripts cannot read ServerScriptService or ServerStorage.',
            suggestedFix: 'Place shared modules or assets in ReplicatedStorage instead.',
            severity: 'error',
            codeSnippet: lineText
          });
        }

        if (trimmed.includes(':FireClient(') || trimmed.includes(':FireAllClients(')) {
          issues.push({
            id: `api-fireclient-on-client-${filePath}-${lineNum}`,
            file: filePath,
            line: lineNum,
            problem: 'Incorrect RemoteEvent usage: FireClient can only be called from the server.',
            suggestedFix: 'Use RemoteEvent:FireServer(...) from client scripts.',
            severity: 'error',
            codeSnippet: lineText
          });
        }
      }

      if (isServerScript) {
        if (trimmed.includes('Players.LocalPlayer')) {
          issues.push({
            id: `api-localplayer-on-server-${filePath}-${lineNum}`,
            file: filePath,
            line: lineNum,
            problem: 'Runtime Error: Players.LocalPlayer is always nil in server scripts.',
            suggestedFix: 'Access the player parameter passed through PlayerAdded or RemoteEvent.OnServerEvent.',
            severity: 'error',
            codeSnippet: lineText
          });
        }

        if (trimmed.includes(':FireServer(')) {
          issues.push({
            id: `api-fireserver-on-server-${filePath}-${lineNum}`,
            file: filePath,
            line: lineNum,
            problem: 'Incorrect RemoteEvent usage: FireServer can only be called from client scripts.',
            suggestedFix: 'Use RemoteEvent:FireClient(player, ...) or RemoteEvent:FireAllClients(...) on the server.',
            severity: 'error',
            codeSnippet: lineText
          });
        }
      }

      if (trimmed.includes('game.Players') || trimmed.includes('game.ReplicatedStorage') || trimmed.includes('game.ServerScriptService')) {
        issues.push({
          id: `best-practice-getservice-${filePath}-${lineNum}`,
          file: filePath,
          line: lineNum,
          problem: 'Roblox Best Practice: Direct game dot indexing can fail during game loading.',
          suggestedFix: 'Use game:GetService("...") for deterministic service resolution.',
          severity: 'warning',
          codeSnippet: lineText
        });
      }

      if (/\bwait\s*\(/.test(trimmed) && !trimmed.includes('task.wait') && !trimmed.includes('WaitForChild')) {
        issues.push({
          id: `deprecated-wait-${filePath}-${lineNum}`,
          file: filePath,
          line: lineNum,
          problem: 'Deprecated API: Global wait() runs on a legacy 30Hz throttle.',
          suggestedFix: 'Replace with task.wait() for 60Hz/frame-rate aligned execution.',
          severity: 'warning',
          codeSnippet: lineText
        });
      }

      if (/\bspawn\s*\(/.test(trimmed) && !trimmed.includes('task.spawn')) {
        issues.push({
          id: `deprecated-spawn-${filePath}-${lineNum}`,
          file: filePath,
          line: lineNum,
          problem: 'Deprecated API: Global spawn() has unpredictable delay scheduling.',
          suggestedFix: 'Replace with task.spawn() for modern micro-task coroutines.',
          severity: 'warning',
          codeSnippet: lineText
        });
      }

      if (trimmed.includes(':connect(')) {
        issues.push({
          id: `deprecated-connect-${filePath}-${lineNum}`,
          file: filePath,
          line: lineNum,
          problem: 'Deprecated API: lowercase :connect() is deprecated.',
          suggestedFix: 'Use capitalized :Connect() method on RBXScriptSignals.',
          severity: 'warning',
          codeSnippet: lineText
        });
      }

      if (/while\s+true\s+do/.test(trimmed)) {
        insideWhileLoop = true;
        whileLoopLine = lineNum;
        hasWaitInWhile = false;
      }

      if (insideWhileLoop) {
        if (trimmed.includes('task.wait') || trimmed.includes('wait(') || trimmed.includes('break')) {
          hasWaitInWhile = true;
        }
        if (trimmed === 'end') {
          if (!hasWaitInWhile) {
            issues.push({
              id: `crit-infinite-loop-${filePath}-${whileLoopLine}`,
              file: filePath,
              line: whileLoopLine,
              problem: 'Critical Infinite Loop: "while true do" loop without task.wait() will freeze the engine.',
              suggestedFix: 'Add task.wait(interval) or break condition inside the loop body.',
              severity: 'error',
              codeSnippet: lines[whileLoopLine - 1]
            });
          }
          insideWhileLoop = false;
        }
      }

      const openWords = trimmed.match(/\b(function|then|do|repeat)\b/g);
      const closeWords = trimmed.match(/\b(end|until)\b/g);
      if (openWords) blockDepth += openWords.length;
      if (closeWords) blockDepth -= closeWords.length;
    }

    if (blockDepth !== 0) {
      issues.push({
        id: `syntax-unclosed-block-${filePath}`,
        file: filePath,
        line: lines.length,
        problem: blockDepth > 0
          ? `Syntax Error: Missing ${blockDepth} closing 'end' statement(s).`
          : `Syntax Error: Found ${Math.abs(blockDepth)} unexpected extra 'end' statement(s).`,
        suggestedFix: 'Ensure all functions, if-statements, and loops are properly closed with end.',
        severity: 'error'
      });
    }
  }

  return issues;
}
