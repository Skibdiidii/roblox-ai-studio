# Roblox AI Studio - Agent Instructions & Project Rules

## Core Behavioral Mandates

1. **Direct File Writing for Feature Requests & Bug Fixes**:
   - Whenever the user requests a feature, an update, or reports an error/bug in the chat, you **MUST NOT** just output raw code blocks in the chat response.
   - You must automatically route the prompt through the file modification pipeline (`/api/ai/modify-game`), extract or generate the code, and **write/update the actual project files** directly in the File Explorer.

2. **Error Awareness & Auto-Fixing**:
   - If the user says "there's an error", "this is broken", or pastes an error message/log, the AI automatically recognizes it as a diagnostic bug report.
   - The AI must immediately inspect the project files, locate the offending code, apply the fix directly to the relevant script files, and present the updated file set to the user.

3. **Strict Luau Standards**:
   - All generated Luau scripts must use strict typechecking (`--!strict`), frame-aligned task scheduling (`task.spawn`, `task.wait`), and proper capitalization for RBXScriptSignal (`:Connect()`).
   - Remove all unnecessary comments from production code.
