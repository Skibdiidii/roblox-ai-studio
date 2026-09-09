import { PatchNote } from '../types';

export const PATCH_NOTES: PatchNote[] = [
  {
    version: 'v1.4.0',
    date: '2026-09-09',
    title: 'Roblox Open Cloud Real Publishing & 3D Interactive World',
    tag: 'Major',
    highlights: [
      'Official Roblox Open Cloud v1 Publishing API Integration with Server-Side Key Protection',
      'Interactive 3D Web Preview with Arena, Dummies, NPC models, and Orbit Controls',
      'Real-time Luau Validation Engine with Security and Runtime Detection',
      'Full-featured Luau Browser Code Editor with File Tree, Syntax Highlighting, and AI Actions'
    ],
    details: [
      'Implemented real HTTPS calls to Roblox Open Cloud APIs for Place Publishing and Universe status checks.',
      'Added visual 3D simulation with customizable camera, lighting, and dummy animations.',
      'Enhanced AI Game Generator to support iterative modifications (e.g. quests, bosses, rebirth).',
      'Export to ZIP format with complete folder structure and Roblox Studio import guide.'
    ]
  },
  {
    version: 'v1.3.2',
    date: '2026-09-05',
    title: 'Code Assistant & Intelligent Luau Fixer',
    tag: 'Feature',
    highlights: [
      '7 One-Click AI Code Actions: Explain, Fix, Optimize, Secure, Regenerate, Add Feature, Find Errors',
      'Client/Server Boundary Enforcement: Detects illegal DataStore or ServerStorage access from clients',
      'RemoteEvent & RemoteFunction parameter validation'
    ],
    details: [
      'Integrated Luau static analysis with rule-based AST checks.',
      'Added instant inline fixes for missing game:GetService declarations.',
      'Created automated code generator for leaderstats and DataStore2 persistence.'
    ]
  },
  {
    version: 'v1.2.0',
    date: '2026-08-20',
    title: 'Multi-Genre Templates & Project Management',
    tag: 'Feature',
    highlights: [
      '9 Pre-configured Game Templates: Anime Simulator, Battleground, Obby, Tycoon, Tower Defense, Survival, RPG, Clicker, Wave Defense',
      'Project duplicate, export, and stage pipeline tracker',
      'Mobile-responsive layout with drawer navigation and full-screen editor'
    ],
    details: [
      'Complete folder structure matching Roblox standard: Workspace, ReplicatedStorage, ServerScriptService, StarterPlayer, StarterGui.',
      'Added mobile touch-friendly controls for 3D camera orbit, pan, and zoom.',
      'Persistent local project storage with auto-sync.'
    ]
  },
  {
    version: 'v1.1.0',
    date: '2026-08-01',
    title: 'Studio Workspace Tree & File Browser',
    tag: 'Improvement',
    highlights: [
      'Hierarchical tree explorer matching Roblox Studio Explorer',
      'Tabbed code editor with multi-file management and quick search',
      'Single-file and full project zip downloader'
    ],
    details: [
      'Color-coded icons for ServerScripts (.server.lua), LocalScripts (.client.lua), and ModuleScripts (.lua).',
      'Added quick copy to clipboard and Luau syntax tokenization.'
    ]
  },
  {
    version: 'v1.0.0',
    date: '2026-07-15',
    title: 'Initial Launch of Roblox AI Studio',
    tag: 'Major',
    highlights: [
      'AI-driven Game Plan generation from natural language prompts',
      'Interactive Chat Interface for designing games step-by-step',
      'Sample Anime Training Simulator starter project'
    ],
    details: [
      'Initial release of browser-based Roblox AI Studio development environment.',
      'Prompt-to-game pipeline with concept, gameplay loop, and systems breakdown.'
    ]
  }
];
