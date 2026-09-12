const fs = require('fs');

let templatesCode = fs.readFileSync('src/data/templates.ts', 'utf8');

const murderTemplate = `  {
    id: 'murder-vs-sheriff',
    name: 'Murder vs Sheriff',
    genre: 'PvP Combat / Action',
    badge: 'Featured',
    description: 'Competitive 1v1, 2v2, and 4v4 team elimination game. Choose your role: Murderer with Knife or Sheriff with Gun.',
    previewColor: '#e11d48',
    previewElements: [
      { id: '1', name: 'Arena Floor', type: 'arena', position: [0, 0, 0], size: [80, 1, 80], color: '#1e293b', shape: 'box' },
      { id: '2', name: 'Murderer Spawn 1', type: 'spawn', position: [-30, 1, -30], size: [6, 0.4, 6], color: '#e11d48', shape: 'box', label: 'Murderer Base A' },
      { id: '3', name: 'Murderer Spawn 2', type: 'spawn', position: [-30, 1, 30], size: [6, 0.4, 6], color: '#e11d48', shape: 'box', label: 'Murderer Base B' },
      { id: '4', name: 'Sheriff Spawn 1', type: 'spawn', position: [30, 1, -30], size: [6, 0.4, 6], color: '#3b82f6', shape: 'box', label: 'Sheriff Base A' },
      { id: '5', name: 'Sheriff Spawn 2', type: 'spawn', position: [30, 1, 30], size: [6, 0.4, 6], color: '#3b82f6', shape: 'box', label: 'Sheriff Base B' },
      { id: '6', name: 'Central Pillar', type: 'building', position: [0, 5, 0], size: [8, 10, 8], color: '#334155', shape: 'cylinder', label: 'Cover Monument' },
      { id: '7', name: 'Wall Obstacle 1', type: 'obstacle', position: [-15, 3, -10], size: [4, 6, 12], color: '#475569', shape: 'box' },
      { id: '8', name: 'Wall Obstacle 2', type: 'obstacle', position: [15, 3, 10], size: [4, 6, 12], color: '#475569', shape: 'box' }
    ],
    plan: {
      title: 'Murder vs Sheriff',
      genre: 'PvP Multiplayer',
      concept: 'Competitive team elimination arena with Knife vs Gun combat and matchmaking for 1v1, 2v2, and 4v4.',
      gameplayLoop: [
        'Select mode (1v1, 2v2, 4v4) from lobby',
        'Enter matchmaking queue and find players',
        'Assigned role: Murderer (Knife) or Sheriff (Gun)',
        '3-second countdown followed by round start',
        'Eliminate opposing team to win',
        'Spectate teammates upon elimination'
      ],
      gameSystems: [
        { name: 'MatchmakingService', description: 'Queues for 1v1, 2v2, 4v4 with validation', files: ['ServerScriptService/Services/MatchmakingService.server.lua'] },
        { name: 'RoundService', description: 'Team assignment, round states, win conditions', files: ['ServerScriptService/Services/RoundService.server.lua'] },
        { name: 'CombatService', description: 'Server-authoritative raycast gun shooting and knife hit validation', files: ['ServerScriptService/Services/CombatService.server.lua'] }
      ],
      requiredScripts: [
        { path: 'ServerScriptService/ServerMain.server.lua', purpose: 'Server initialization', scriptType: 'server' },
        { path: 'ReplicatedStorage/Shared/WeaponConfig.lua', purpose: 'Weapon stats configuration', scriptType: 'shared' },
        { path: 'StarterPlayer/StarterPlayerScripts/Controllers/CombatController.client.lua', purpose: 'Client combat input & animations', scriptType: 'client' }
      ],
      requiredUI: [
        { name: 'MainMenu', description: 'Mode selection and play buttons' },
        { name: 'CombatHUD', description: 'Health, Weapon slots, and Ammo count' },
        { name: 'SpectatorUI', description: 'Next/Previous spectator navigation' },
        { name: 'ResultsUI', description: 'Round winner and session statistics' }
      ],
      remotes: [
        { name: 'QueueAction', type: 'RemoteEvent', purpose: 'Join/leave matchmaking queue' },
        { name: 'FireWeapon', type: 'RemoteEvent', purpose: 'Server-validated gun shot' },
        { name: 'SwingKnife', type: 'RemoteEvent', purpose: 'Server-validated knife attack' }
      ],
      dataStores: [{ name: 'PlayerStats', keys: ['Wins', 'Losses', 'Eliminations', 'Deaths'] }],
      mapRequirements: { name: 'Neon Metro Arena', description: 'Urban combat arena with vertical covers', elements: [] },
      npcRequirements: [],
      configurationValues: [
        { key: 'UNIVERSE_ID', value: 10583605757, description: 'Roblox Universe ID' },
        { key: 'PLACE_ID', value: 72554133670565, description: 'Roblox Place ID' }
      ]
    },
    files: {
      'ServerScriptService/ServerMain.server.lua': {
        path: 'ServerScriptService/ServerMain.server.lua',
        name: 'ServerMain.server.lua',
        content: \`-- [ServerMain.server.lua]
-- Murder vs Sheriff MVP Server Bootstrap
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerScriptService = game:GetService("ServerScriptService")

print("[Murder vs Sheriff] Server initialized for Universe 10583605757, Place 72554133670565")

local Remotes = ReplicatedStorage:FindFirstChild("Remotes")
if not Remotes then
    Remotes = Instance.new("Folder")
    Remotes.Name = "Remotes"
    Remotes.Parent = ReplicatedStorage
    
    local queueEv = Instance.new("RemoteEvent")
    queueEv.Name = "QueueAction"
    queueEv.Parent = Remotes
    
    local fireEv = Instance.new("RemoteEvent")
    fireEv.Name = "FireWeapon"
    fireEv.Parent = Remotes
    
    local knifeEv = Instance.new("RemoteEvent")
    knifeEv.Name = "SwingKnife"
    knifeEv.Parent = Remotes
end
\`
      },
      'ReplicatedStorage/Shared/WeaponConfig.lua': {
        path: 'ReplicatedStorage/Shared/WeaponConfig.lua',
        name: 'WeaponConfig.lua',
        content: \`-- [WeaponConfig.lua]
local WeaponConfig = {}

WeaponConfig.Modes = {
    ["1v1"] = { players = 2, murderers = 1, sheriffs = 1 },
    ["2v2"] = { players = 4, murderers = 2, sheriffs = 2 },
    ["4v4"] = { players = 8, murderers = 4, sheriffs = 4 }
}

WeaponConfig.Weapons = {
    Gun = {
        Damage = 100,
        Range = 300,
        Cooldown = 0.6,
        Ammo = 7,
        ReloadTime = 1.5,
        Description = "Sheriff primary ranged weapon."
    },
    Knife = {
        Damage = 100,
        Range = 6,
        Cooldown = 0.5,
        Description = "Murderer primary close-range weapon."
    }
}

return WeaponConfig
\`
      },
      'StarterPlayer/StarterPlayerScripts/Controllers/CombatController.client.lua': {
        path: 'StarterPlayer/StarterPlayerScripts/Controllers/CombatController.client.lua',
        name: 'CombatController.client.lua',
        content: \`-- [CombatController.client.lua]
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local UserInputService = game:GetService("UserInputService")

local localPlayer = Players.LocalPlayer
local remotes = ReplicatedStorage:WaitForChild("Remotes")
local fireEv = remotes:WaitForChild("FireWeapon")
local knifeEv = remotes:WaitForChild("SwingKnife")

print("[CombatController] Initialized for client: " .. localPlayer.Name)

UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if gameProcessed then return end
    if input.UserInputType == Enum.UserInputType.MouseButton1 then
        -- Send weapon action request to server
        fireEv:FireServer(workspace.CurrentCamera.CFrame)
    elseif input.KeyCode == Enum.KeyCode.F then
        knifeEv:FireServer()
    end
end)
\`
      }
    }
  },
`;

if (!templatesCode.includes('murder-vs-sheriff')) {
  templatesCode = templatesCode.replace(/export const GAME_TEMPLATES: GameTemplate\[\] = \[/g, "export const GAME_TEMPLATES: GameTemplate[] = [\n" + murderTemplate);
  fs.writeFileSync('src/data/templates.ts', templatesCode);
  console.log("Successfully added Murder vs Sheriff template to templates.ts");
}
`;

fs.writeFileSync('patch_murder_vs_sheriff.cjs', scriptContent);
console.log("Created patch_murder_vs_sheriff.cjs");
