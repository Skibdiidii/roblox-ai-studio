import { PatchNote } from '../types';

export const PATCH_NOTES: PatchNote[] = [
  {
    version: 'v2.4.1',
    date: '2026-09-10',
    title: 'Publish Guidance & Strict Project Chat Isolation',
    tag: 'Feature',
    highlights: [
      'Roblox Live Update Guidance: Added direct instructions in the Deploy panel explaining how Open Cloud place versions sync with Roblox Version History and how to verify or activate updates in the Creator Dashboard.',
      'Strict Project Chat Isolation: Ensured that every game project and chat session maintains its own independent message history. Switching between projects instantly switches to that project\'s dedicated chat and files without mixing or bleeding over.'
    ],
    details: [
      'Added live update note component in `RobloxPublishPanel.tsx`.',
      'Verified chat history state management in `App.tsx` keyed by active project ID.'
    ]
  },

  {
    version: 'v2.4.0',
    date: '2026-09-10',
    title: 'Infinite Loop Fix & Strict Backend-Only Code Routing',
    tag: 'Feature',
    highlights: [
      'Maximum Update Depth Fix: Completely resolved the React state update loop by decoupling active project switching from chat history synchronization using stable message refs.',
      'No Code in Chat Text: Updated chat system instructions so the AI explains concepts clearly in plain text without dumping raw code blocks into chat bubbles. All code updates are routed exclusively to backend project files.',
      'Robust File Application: Feature requests and script updates are automatically applied directly to your File Explorer.'
    ],
    details: [
      'Refactored useEffect hooks in App.tsx to prevent infinite re-render loops.',
      'Updated chat-stream system prompt in server.ts to prohibit raw code in chat text responses.'
    ]
  },

  {
    version: 'v2.3.9',
    date: '2026-09-10',
    title: 'Strict Backend-Only Code Routing',
    tag: 'Feature',
    highlights: [
      'Zero Code Blocks in Chat: Configured the AI chat engine to completely strip out markdown code blocks from chat text responses. All generated or modified Luau code is now routed exclusively to the backend project files in your File Explorer.',
      'Universal Project Action Trigger: Enhanced intent detection so that any prompt entered while a project is active automatically updates project files rather than returning loose chat code blocks.'
    ],
    details: [
      'Added code block sanitization in `server.ts` modify-game responses.',
      'Broadened `isModifyIntent` in `App.tsx` to capture all game modification directives.'
    ]
  },

  {
    version: 'v2.3.8',
    date: '2026-09-10',
    title: 'Robust File Modification & Error Auto-Fixing',
    tag: 'Feature',
    highlights: [
      'Direct File Writing Engine: Fixed the issue where the AI would sometimes output markdown code blocks in chat instead of writing actual files. The backend now automatically parses markdown code blocks from AI responses and applies them directly to your project files!',
      'Error & Bug Awareness: Added persistent system instructions (`AGENTS.md` & `GEMINI.md`) so the AI automatically recognizes bug reports and error feedback to instantly patch your project files.'
    ],
    details: [
      'Implemented robust markdown code block extraction in `server.ts` for modify-game requests.',
      'Created `AGENTS.md` and `GEMINI.md` to enforce direct file writing and error auto-fixing protocols.'
    ]
  },

  {
    version: 'v2.3.7',
    date: '2026-09-10',
    title: 'Publishing Guidance & Studio Export',
    tag: 'Publish',
    highlights: [
      'Publishing Clarity: Clarified the difference between Sandbox Simulation and Live Open Cloud Publishing.',
      'Roblox Studio Import: Emphasized that to update your live Roblox game date, you can use the direct .rbxlx XML export or configure a real Open Cloud API key with Place permissions.'
    ],
    details: [
      'Ensured all publishing pathways support standard XML structure.',
      'Verified GitHub remote synchronization with user token.'
    ]
  },

  {
    version: 'v2.3.6',
    date: '2026-09-10',
    title: 'Smart Feature Implementation',
    tag: 'Feature',
    highlights: [
      'True AI Feature Updates: Fixed a major limitation where the AI would only output Lua scripts into the chat stream when asked to modify or add features. Now, it actively updates and applies code directly to your project files!',
      'Context-Aware Workflow: The AI intelligently differentiates between conversational questions (e.g., "explain DataStores") and action intents (e.g., "add a jump pad").'
    ],
    details: [
      'Restored the `/api/ai/modify-game` backend pipeline in `App.tsx`.',
      'Added dynamic intent parsing (`isModifyIntent`) to accurately switch between stream rendering and JSON file modifications.'
    ]
  },

  {
    version: 'v2.3.5',
    date: '2026-09-10',
    title: 'Asset Support & Quality of Life',
    tag: 'Feature',
    highlights: [
      'New Chat Reset: Added a "New Chat" button to the AI Architect to instantly clear your conversational history for a fresh start.',
      'Clear Publish State: Added a "Clear Publish" button to the Deployment panel to wipe your target Universe and Place IDs if you need to switch targets or reset config.',
      '3D Asset Tracking: The File Explorer now tracks 3D visual assets like `.glb`, `.obj`, `.fbx`, and `.model`, along with audio and image files, fully equipping the AI with your exact asset tree hierarchy.'
    ],
    details: [
      'Updated `App.tsx` to allow clearing `chatHistory` context window.',
      'Implemented `handleClearPublish` to wipe the project\'s `robloxConfig` state object.',
      'Added multimodal extension mappings (asset, image, audio, model) into `FileExplorer.tsx`.'
    ]
  },

  {
    version: 'v2.3.4',
    date: '2026-09-10',
    title: 'Open Cloud Content Stream Resolution',
    tag: 'Hotfix',
    highlights: [
      'Resolved Content Type Conflict: Fixed a backend bug where Node was overriding the XML headers with binary octet-streams, causing Roblox to reject the Place files.',
      'XML Header Compliance: Removed legacy XML declaration tags that conflicted with Roblox Studio\'s internal Rojo schema parsers.'
    ],
    details: [
      'Removed `Buffer.from()` which was forcefully casting the XML payload to a binary stream during the fetch request.',
      'Aligned the root `<roblox>` tag to exactly match standard `.rbxlx` file headers.'
    ]
  },
  {
    version: 'v2.3.3',
    date: '2026-09-09',
    title: 'AI Code Memory & Clean Templates',
    tag: 'Feature',
    highlights: [
      'Intelligent Project Context: The AI Chat now reads your entire project\'s active file structure before generating a response, ensuring it perfectly remembers features and scripts previously added.',
      'True Blank Slate Templates: Cleared out all placeholder `.lua` files from starter templates. Your workspace will now be completely clean when starting a new game type.',
      'Robust XML Overhaul: Re-engineered the Open Cloud Publisher to inject scripts into a pre-compiled, fully valid Roblox Baseplate.'
    ],
    details: [
      'Passed `activeProject.files` and `activeProject.plan` into the backend system context prompt array.',
      'Wiped the `files: {}` object maps from `src/data/templates.ts` to prevent dummy scripts from generating.',
      'Resolved the stubborn "Invalid Content Stream" API rejection by conforming to Roblox Studio\'s strict XML schema requirements.'
    ]
  },
  {
    version: 'v2.3.2',
    date: '2026-09-09',
    title: 'Open Cloud Publisher "Invalid Content Stream" Fix',
    tag: 'Hotfix',
    highlights: [
      'Valid Roblox XML Generation: The publishing backend now correctly compiles your project scripts into a valid `.rbxlx` XML Place structure instead of sending a raw JSON payload.',
      'Instant Place Overrides: When publishing to an existing Place via Open Cloud, your AI-generated scripts and systems are injected securely into the Place architecture without being rejected.',
      'Data Type Enforcement: The Publisher route strictly specifies the `application/xml` header to ensure Roblox\'s Open Cloud gateway parses your files correctly.'
    ],
    details: [
      'Implemented a backend `.rbxlx` XML constructor engine that dynamically injects Lua files into ServerScriptService, Workspace, and StarterPlayer.',
      'Replaced the legacy `projectSummary` JSON dummy payload with genuine Place file generation.',
      'Modified the `fetch` API request Content-Type to `application/xml`.'
    ]
  },
  {
    version: 'v2.3.1',
    date: '2026-09-09',
    title: 'Roblox Open Cloud Publishing Architecture Fix',
    tag: 'Hotfix',
    highlights: [
      'Resolved Place Creation 404 Error: Fixed a critical issue where the application attempted to auto-create Places via the Open Cloud API, which is unsupported by Roblox.',
      'Enforced Target Experience IDs: The Publish UI has been updated to explicitly require your target Universe ID and Place ID from the Creator Dashboard, ensuring a flawless publishing pipeline.',
      'Graceful Degradation: The backend server now properly catches creation requests and provides a friendly explanation instead of throwing network errors.'
    ],
    details: [
      'Removed the Auto-Create Place toggle from the UI as Open Cloud lacks a native Place Creation endpoint.',
      'Modified the `handleRobloxPublish` route to check for exact Place and Universe IDs before submitting the version upload payload.',
      'Replaced the broken `create-place` API with an educational response that guides the user to use the Roblox Creator Dashboard to provision their assets.'
    ]
  },
  {
    version: 'v2.3.0',
    date: '2026-09-09',
    title: 'AI Conversational Memory & Persistent Chat History',
    tag: 'Feature',
    highlights: [
      'Multi-Turn AI Memory: The AI now remembers your previous messages in the current conversation, allowing for natural follow-up questions and refined scripting.',
      'Persistent Chat State: Chat histories are now automatically saved securely to your local project state. You will not lose your conversation when switching between games or refreshing.',
      'Project Chat Hand-off: When you use the AI to plan and create a new project, your original context and conversation are seamlessly carried over into the new project workspace.'
    ],
    details: [
      'Engineered an alternating roles message mapping layer to correctly format context history across both Mistral and Gemini stream endpoints.',
      'Synchronized the active chat session directly into the robust project data model, guaranteeing persistence across the entire environment lifecycle.',
      'Refactored the new-project generation logic to gracefully preserve the prompt chain that birthed the workspace.'
    ]
  },
  {
    version: 'v2.2.0',
    date: '2026-09-09',
    title: 'Publish Error Fixes & Chat Mode Optimization',
    tag: 'Hotfix',
    highlights: [
      'Resolved HTMLButtonEvent Publish Error: Fixed an issue where publishing would fail due to an invalid event payload.',
      'JSON Parsing Enhancements: Hardened JSON extraction pipeline to prevent parsing errors and "long error" crashes.',
      'Refined AI Chat Behavior: Talking to the AI in chat now defaults to freeform assistance without unintentionally modifying project files.',
      'Auto-Scrolling Patch Notes: Enhanced the What\'s New modal with auto-scrolling to easily browse past updates.'
    ],
    details: [
      'Fixed the Roblox Publish handler which was incorrectly receiving the click event object instead of the versionType parameter.',
      'Optimized the AI prompt detection to ensure normal conversational questions are treated as freeform chat instead of forced file modifications.',
      'Added comprehensive JSON extraction logic to handle cases where raw AI output contained trailing characters or markdown artifacts.'
    ]
  },
  {
    version: 'v2.1.0',
    date: '2026-09-09',
    title: 'Real-Time Thinking Stream & High-Speed Mistral Codestral Engine Fix',
    tag: 'Hotfix',
    highlights: [
      'Live Reasoning Stream: Live thinking process and progressive thought steps are immediately visible above generated output',
      'High-Speed Response Streaming: Fixed SSE client lifecycle handling to stream full Luau script tokens seamlessly',
      'Mistral Codestral Luau Synthesis: Specialized Codestral model generates typed Luau code with zero latency stalls',
      'Dual Mode Freeform & Plan Router: Intelligent auto-routing between freeform Luau queries and multi-file game planning',
      'Robust Fallback Pipeline: Continuous multi-tier fallback ensuring uninterrupted responses on any query'
    ],
    details: [
      'Resolved the server-sent events stream interruption issue to ensure continuous token streaming directly from the Mistral Codestral engine.',
      'Updated the thinking panel to expand by default during active reasoning, showing live step-by-step thought progress as it happens.',
      'Refined prompt mode detection to intelligently switch between freeform Luau code answers, codebase modifications, and complete architecture plans.',
      'Maintained full historical changelog with continuous auto-scrolling to explore all past releases.'
    ]
  },
  {
    version: 'v2.0.0',
    date: '2026-09-09',
    title: 'Mistral AI Engine Integration: Codestral Luau Generation & Pixtral Multimodal Vision',
    tag: 'Major',
    highlights: [
      'Mistral AI Primary Engine: Integrated Mistral AI featuring specialized Codestral for precision Luau script synthesis',
      'Pixtral Multimodal Vision: Advanced image analysis for Roblox UI designs, screenshots, and visual assets',
      'Dual-Engine Architecture: Switch smoothly between Mistral AI and Google Gemini with automatic failover',
      'Instant AI Verification: Real-time key testing and model selection in API Settings for all Mistral tiers',
      'Enhanced Luau Performance: Strict type annotations (--!strict) and modern task scheduler patterns'
    ],
    details: [
      'Integrated Mistral AI as the primary AI engine, utilizing codestral-latest for high-accuracy Roblox Luau script generation and game architecture planning.',
      'Added multimodal vision support via pixtral-12b-2409, allowing users to upload screenshots, UI mocks, and diagrams for automatic script and architecture translation.',
      'Implemented full SSE streaming directly from Mistral chat completions API with live token streaming and thinking stages.',
      'Enhanced API Settings modal with provider toggles (Mistral AI / Google Gemini), model selection dropdowns, and instant credential verification.',
      'Maintained complete historical update changelog with continuous auto-scrolling to explore all past releases.'
    ]
  },
  {
    version: 'v1.9.3',
    date: '2026-09-09',
    title: 'Adaptive Multi-Tier Model Cascade & Zero-Downtime Gemini Routing',
    tag: 'Hotfix',
    highlights: [
      'Multi-Tier Model Cascade: Automatic seamless failover across gemini-3.1-flash-lite, gemini-3.8-flash, and gemini-flash-latest',
      'Ultra-Resilient Routing: Prioritized gemini-3.1-flash-lite to bypass peak-hour capacity bottlenecks instantly',
      'Zero Disruption Fallback: Local structural blueprint generators guarantee unbroken workflows even during external cloud outages',
      'Continuous Architecture: Instantaneous streaming response for Luau scripts, game planning, and code actions'
    ],
    details: [
      'Configured multi-tier adaptive model routing prioritizing high-throughput gemini-3.1-flash-lite with automated cascade failover across all modern Gemini tiers.',
      'Refined streaming generator and synchronous caller to seamlessly handle upstream 503 capacity spikes with zero user disruption.',
      'Updated API settings and diagnostics to reflect modern high-availability tiers.',
      'Maintained complete historical update changelog with continuous auto-scrolling to explore all past releases.'
    ]
  },
  {
    version: 'v1.9.2',
    date: '2026-09-09',
    title: 'Instant High-Demand Fallback & Zero-Downtime Multi-Model Engine',
    tag: 'Hotfix',
    highlights: [
      'Instant Model Fallback: Immediate failover to high-availability gemini-flash-latest upon upstream high demand',
      'Cascade Tier Routing: Multi-tier cascade routing through gemini-flash-latest, gemini-3.1-flash-lite, and gemini-3.8-flash',
      'Zero-Latency Recovery: Removed redundant retry stalls on overloaded models to deliver instant generation',
      'Seamless Architecture: Uninterrupted script synthesis, architecture planning, and multimodal analysis'
    ],
    details: [
      'Configured instant failover across high-availability Gemini models so that upstream 503 high-demand spikes on any single tier are seamlessly bypassed.',
      'Updated default reasoning model to high-stability gemini-flash-latest with gemini-3.1-flash-lite fallback.',
      'Refined streaming generator to maintain state consistency and avoid dropped or duplicate chunks.',
      'Maintained full historical changelog with continuous auto-scrolling to review all previous patches.'
    ]
  },
  {
    version: 'v1.9.1',
    date: '2026-09-09',
    title: 'High-Demand Resiliency, Automatic Model Failover & AI Reliability Engine',
    tag: 'Hotfix',
    highlights: [
      'High-Demand Resiliency: Added exponential backoff and retry handling for high-traffic 503/429 spikes',
      'Automatic Model Failover: Cascade fallback between gemini-3.8-flash, gemini-3.1-flash-lite, and gemini-3.1-pro-preview',
      'Verified Model Standards: Updated default reasoning model to gemini-3.8-flash with official telemetry headers',
      'Continuous Architecture: Zero-downtime streaming generation for Luau scripts and architecture planning'
    ],
    details: [
      'Enhanced AI engine with intelligent retry and automatic failover to prevent interruptions during Gemini API high demand spikes.',
      'Configured multi-tier model cascade supporting gemini-3.8-flash, gemini-3.1-flash-lite, and gemini-3.1-pro-preview.',
      'Updated API settings modal to reflect modern Gemini reasoning tiers.',
      'Maintained complete historical update changelog with continuous auto-scrolling to explore all past releases.'
    ]
  },
  {
    version: 'v1.9.0',
    date: '2026-09-09',
    title: 'Freeform AI Chat with Image & File Attachments, Hamburger Navigation & High-Speed Streaming',
    tag: 'Major',
    highlights: [
      'Freeform AI Chat: Chat freely with AI on any Luau topic, game design questions, or full-scale Roblox architecture',
      'Multimodal Attachments: Drag & drop images, paste screenshots from clipboard, or attach .lua, .luau, and text files',
      'Ultra-Fast AI Response: High-concurrency streaming powered by Gemini 3.6 Flash with live thinking breakdowns',
      'Hamburger Drawer Navigation: Streamlined hamburger icon navigation for switching workspaces on mobile and desktop',
      'Focused Codebase Workspace: Cleaned up preview overhead for maximum code editing and prompt workspace speed'
    ],
    details: [
      'Added full attachment support in the AI Chat allowing drag & drop, file browser selection, and direct clipboard image pasting (Ctrl+V).',
      'Connected multimodal inputs to backend streaming route for instantaneous script diagnosis, error fixing, and vision-assisted game building.',
      'Replaced top tab clutter with a responsive hamburger drawer providing quick access to Dashboard, AI Chat, Luau IDE, Validator, and Open Cloud Deployer.',
      'Optimized SSE streaming buffer parsing to minimize latency and deliver instantaneous answer chunks with live markdown formatting and code highlighting.',
      'Retained complete historical update changelog with continuous auto-scrolling to explore all past releases.'
    ]
  },
  {
    version: 'v1.8.0',
    date: '2026-09-09',
    title: 'AI Message Engine Fix & Responsive Chat Experience',
    tag: 'Major',
    highlights: [
      'AI Message Engine Fix: Fixed result event dispatching, multi-line SSE chunk handling, and streaming completion',
      'Polished Message Typography: Rich bold rendering, Luau code highlights, bullet formatting, and live glowing streaming cursor',
      'Mobile & Tablet Responsive Layouts: Touch-optimized controls and responsive navigation across all screen sizes'
    ],
    details: [
      'Resolved the AI message rendering bug where modification and plan results could fail to trigger status updates during streaming.',
      'Rebuilt the Server-Sent Events parser to gracefully handle fragmented multi-line payloads and ensure thought summaries stream reliably.',
      'Preserved all previous patch notes with continuous auto-scrolling and manual scroll inspection.'
    ]
  },
  {
    version: 'v1.7.0',
    date: '2026-09-09',
    title: 'Real-Time Thinking Panel & Simplified Roblox Cloud Deployment',
    tag: 'Major',
    highlights: [
      'Real-Time Thinking: Live collapsible reasoning summaries updating dynamically above responses',
      'Minimized by Default: Clean, focused workspace with an animated indicator showing active reasoning',
      'Expand on Demand: Tap to view thought summaries and watch the reasoning stream in real time',
      'Concurrent Answer Streaming: Luau code and architectural plans stream seamlessly alongside live thoughts',
      'Zero-Config Roblox Cloud: Only API key required — places and experiences are automatically allocated'
    ],
    details: [
      'Added a compact, collapsible Thinking panel above AI responses that stays minimized by default and persists collapsed when finished.',
      'Integrated real-time streaming endpoint utilizing Server-Sent Events to stream reasoning steps and answer chunks concurrently.',
      'Added subtle pulsing indicator to the minimized thinking state so developers know the AI is reasoning in real time.',
      'Preserved all historical patch notes with automatic smooth scrolling and manual scroll inspection.',
      'Streamlined Roblox Open Cloud deployment to eliminate mandatory Universe ID inputs; API key is all that is needed.'
    ]
  },
  {
    version: 'v1.6.0',
    date: '2026-09-09',
    title: 'Automated Roblox Place Creation & One-Click Publishing Pipeline',
    tag: 'Major',
    highlights: [
      'Automated Place Creation: No need to manually create or copy Place IDs from Roblox Studio',
      'One-Click Place Allocation: Automatically provisions new Places directly in your Universe via Open Cloud',
      'Create Place Now Action: Instant place provisioning with real-time Place ID assignment',
      'Simulated Publishing Pipeline: Test end-to-end publishing workflows seamlessly with example keys',
      'Enhanced Diagnostic Payload: Real-time response inspection and Open Cloud error diagnostics'
    ],
    details: [
      'Implemented automated place provisioning via Roblox Open Cloud Universes Places API (v1).',
      'Eliminated the requirement of manually searching for and inputting Place IDs; simply provide your Universe ID.',
      'Added an Auto-Create Place toggle (enabled by default) that handles place allocation during the publish step.',
      'Added immediate "Create Now" button in the target configuration for instant place creation preview.',
      'Added Simulate Demo mode allowing developers testing with example credentials to experience the full deployment lifecycle without authentication failures.',
      'Improved server error handling with friendly guidance on required Open Cloud permissions.'
    ]
  },
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
    title: 'Roblox Open Cloud Real Publishing & Luau Studio Engine',
    tag: 'Major',
    highlights: [
      'Official Roblox Open Cloud v1 Publishing API Integration with Server-Side Key Protection',
      'Real-time Luau Validation Engine with Security and Runtime Detection',
      'Full-featured Luau Browser Code Editor with File Tree, Syntax Highlighting, and AI Actions'
    ],
    details: [
      'Implemented real HTTPS calls to Roblox Open Cloud APIs for Place Publishing and Universe status checks.',
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
