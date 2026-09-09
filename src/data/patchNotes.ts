import { PatchNote } from '../types';

export const PATCH_NOTES: PatchNote[] = [
  {
    version: 'v1.5.0',
    date: '2026-09-09',
    title: 'Gemini 3.6 Flash Engine & Custom API Key Settings',
    tag: 'Major',
    highlights: [
      'Upgraded AI Engine to Gemini 3.6 Flash with fallback to Gemini 3.8 Flash',
      'Added Custom API Key Settings Modal for Gemini & Roblox Open Cloud credentials',
      'Clean Workspace Mode: Removed all preloaded placeholder projects for an instant clean slate',
      'Client-side API key override support allowing users to bring their own AI & publishing keys'
    ],
    details: [
      'Resolved invalid model deprecation error by migrating to the latest Gemini 3.6 Flash / 3.8 Flash models.',
      'Added dedicated API Key Settings dialog accessible from the top navigation bar.',
      'Users can now supply personal Gemini API Keys and Roblox Open Cloud Keys directly in settings.',
      'Removed hard-coded placeholder projects so users start with a clean workspace or choose from starter templates.',
      'Improved server-side proxy handling for dynamic user-supplied API credentials with local fallback.'
    ]
  },
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
      'Filter and search scripts by folder and filename',
      'Multi-tab code viewer with fast switching'
    ],
    details: [
      'Added color-coded script badges: Server (.server.lua), Client (.client.lua), and Module (.lua).',
      'Search input for immediate file filtering across deep hierarchies.',
      'Integrated quick tab closing and active path synchronization.'
    ]
  },
  {
    version: 'v1.0.0',
    date: '2026-07-15',
    title: 'Initial Release: Roblox AI Studio Foundation',
    tag: 'Major',
    highlights: [
      'Natural language game concept prompt generation',
      'Full Luau script generation adhering to strict typing',
      'Client-server architecture design and remote management'
    ],
    details: [
      'Established core pipeline: Prompt -> Plan -> Review -> Code.',
      'Created Luau typechecking rules and Rojo default.project.json generation.',
      'Built downloadable ZIP packaging for studio imports.'
    ]
  }
];
