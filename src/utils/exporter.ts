import JSZip from 'jszip';
import { Project, ProjectFile } from '../types';

export async function exportProjectZip(project: Project): Promise<Blob> {
  const zip = new JSZip();

  const rojoProject = {
    name: project.name,
    tree: {
      $className: "DataModel",
      Workspace: {
        $className: "Workspace"
      },
      ReplicatedStorage: {
        $path: "src/ReplicatedStorage"
      },
      ServerScriptService: {
        $path: "src/ServerScriptService"
      },
      StarterPlayer: {
        $className: "StarterPlayer",
        StarterPlayerScripts: {
          $path: "src/StarterPlayer/StarterPlayerScripts"
        }
      },
      StarterGui: {
        $path: "src/StarterGui"
      }
    }
  };

  zip.file('default.project.json', JSON.stringify(rojoProject, null, 2));

  for (const [filePath, file] of Object.entries(project.files)) {
    zip.file(filePath, file.content);
  }

  const projectMetadata = {
    name: project.name,
    description: project.description,
    exportedAt: new Date().toISOString(),
    generator: 'Roblox AI Studio',
    universeId: project.robloxConfig.universeId || null,
    placeId: project.robloxConfig.placeId || null,
    filesCount: Object.keys(project.files).length
  };
  zip.file('project.config.json', JSON.stringify(projectMetadata, null, 2));

  return await zip.generateAsync({ type: 'blob' });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadSingleFile(file: ProjectFile): void {
  const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
  const filename = file.name.endsWith('.lua') || file.name.endsWith('.md') || file.name.endsWith('.json')
    ? file.name
    : `${file.name}.luau`;
  downloadBlob(blob, filename);
}
