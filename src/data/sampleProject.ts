import { Project, PreviewElement } from '../types';

export const samplePreviewElements: PreviewElement[] = [
  {
    id: 'elem-arena',
    name: 'Training Arena Floor',
    type: 'arena',
    position: [0, 0.5, 0],
    size: [60, 1, 60],
    color: '#3b82f6',
    shape: 'cylinder',
    label: 'Main Arena'
  },
  {
    id: 'elem-spawn',
    name: 'SpawnLocation',
    type: 'spawn',
    position: [0, 1.2, -22],
    size: [6, 0.4, 6],
    color: '#10b981',
    shape: 'box',
    label: 'Spawn'
  },
  {
    id: 'elem-dummy-1',
    name: 'Dummy 1 (Beginner)',
    type: 'dummy',
    position: [-14, 2.5, -6],
    size: [2.5, 4, 1.5],
    color: '#eab308',
    shape: 'box',
    label: 'Dummy +10 Power'
  },
  {
    id: 'elem-dummy-2',
    name: 'Dummy 2 (Beginner)',
    type: 'dummy',
    position: [-7, 2.5, 12],
    size: [2.5, 4, 1.5],
    color: '#eab308',
    shape: 'box',
    label: 'Dummy +10 Power'
  },
  {
    id: 'elem-dummy-3',
    name: 'Dummy 3 (Adept)',
    type: 'dummy',
    position: [8, 2.5, 14],
    size: [2.5, 4, 1.5],
    color: '#f97316',
    shape: 'box',
    label: 'Dummy +50 Power'
  },
  {
    id: 'elem-dummy-4',
    name: 'Dummy 4 (Adept)',
    type: 'dummy',
    position: [16, 2.5, -4],
    size: [2.5, 4, 1.5],
    color: '#f97316',
    shape: 'box',
    label: 'Dummy +50 Power'
  },
  {
    id: 'elem-dummy-5',
    name: 'Master Dummy (Elite)',
    type: 'dummy',
    position: [0, 3, 4],
    size: [3.5, 5, 2],
    color: '#ef4444',
    shape: 'box',
    label: 'Master Dummy +250 Power'
  },
  {
    id: 'elem-shop-npc',
    name: 'Upgrade Master NPC',
    type: 'npc',
    position: [-22, 2.5, -12],
    size: [2, 4, 1.5],
    color: '#8b5cf6',
    shape: 'box',
    label: 'Upgrade Shop NPC'
  },
  {
    id: 'elem-rebirth-shrine',
    name: 'Rebirth Altar',
    type: 'building',
    position: [22, 3, -12],
    size: [8, 6, 8],
    color: '#06b6d4',
    shape: 'box',
    label: 'Rebirth Altar'
  },
  {
    id: 'elem-wall-north',
    name: 'Arena Boundary North',
    type: 'part',
    position: [0, 2, 32],
    size: [64, 4, 2],
    color: '#1e293b',
    shape: 'box'
  },
  {
    id: 'elem-wall-south',
    name: 'Arena Boundary South',
    type: 'part',
    position: [0, 2, -32],
    size: [64, 4, 2],
    color: '#1e293b',
    shape: 'box'
  }
];

export const sampleProject: Project = {
  id: 'proj-anime-simulator',
  name: 'Anime Training Simulator',
  description: 'Players train by attacking wooden & iron dummies, earn Power stats, buy multipliers from shop, rebirth for permanent boosts, and climb the global leaderboards.',
  stage: 6,
  lastModified: Date.now(),
  robloxConfig: {
    universeId: '',
    placeId: '',
    apiKeyConfigured: false,
    status: 'NEEDS_CONFIGURATION',
    lastPublishMessage: 'Roblox connection required. Provide Universe ID and Place ID to test or publish.',
    lastPublishedAt: null
  },
  plan: {
    title: 'Anime Training Simulator',
    genre: 'Simulator',
    concept: 'A fast-paced anime action simulator where players punch training dummies across martial art arenas, accumulate Chi & Power, unlock auras, perform Rebirths, and purchase equipment upgrades.',
    gameplayLoop: [
      'Click or tap to punch training dummies placed around the dojo arena.',
      'Gain Power points with each hit based on player multiplier.',
      'Spend Power at the Dojo Master NPC to purchase Gloves and Auras.',
      'Reach the required Power threshold to Rebirth at the ancient altar.',
      'Rebirth resets current Power but awards Rebirth Tokens and permanent 2x multiplier.',
      'Compete on global leaderboards for Highest Power and Most Rebirths.'
    ],
    gameSystems: [
      {
        name: 'Leaderstats & Profile System',
        description: 'Initializes and replicates player Power, Rebirths, and Coins with persistent save.',
        files: ['ServerScriptService/Services/ProfileService.server.lua', 'ServerScriptService/Main.server.lua']
      },
      {
        name: 'Training & Combat Engine',
        description: 'Handles server-validated dummy hits, cooldowns, and multiplier calculations.',
        files: ['ServerScriptService/Systems/TrainingSystem.server.lua', 'ReplicatedStorage/Modules/MultiplierCalculator.lua']
      },
      {
        name: 'Rebirth Altar System',
        description: 'Processes rebirth requirements, awards permanent boosts, and fires client celebration.',
        files: ['ServerScriptService/Systems/RebirthSystem.server.lua']
      },
      {
        name: 'Shop & Equipment System',
        description: 'Item catalog for gloves and training gear with purchase verification.',
        files: ['ServerScriptService/Systems/ShopSystem.server.lua', 'ReplicatedStorage/Configuration/GameConfig.lua']
      },
      {
        name: 'Responsive Client HUD',
        description: 'Mobile-friendly GUI displaying stats, attack buttons, rebirth prompt, and shop modal.',
        files: ['StarterGui/MainUI/HUD.client.lua', 'StarterPlayer/StarterPlayerScripts/InputController.client.lua']
      }
    ],
    requiredScripts: [
      { path: 'ServerScriptService/Main.server.lua', purpose: 'Game bootstrap, server initialization, player joining logic', scriptType: 'server' },
      { path: 'ServerScriptService/Systems/TrainingSystem.server.lua', purpose: 'Dummy interaction, power award validation, anti-cheat rate limiting', scriptType: 'server' },
      { path: 'ServerScriptService/Systems/RebirthSystem.server.lua', purpose: 'Rebirth validation, stat resetting, and permanent multiplier allocation', scriptType: 'server' },
      { path: 'ServerScriptService/Systems/ShopSystem.server.lua', purpose: 'Shop purchase processing, item validation, and coin deduction', scriptType: 'server' },
      { path: 'ServerScriptService/Services/ProfileService.server.lua', purpose: 'PlayerData persistence using Roblox DataStoreService with session locking', scriptType: 'server' },
      { path: 'ReplicatedStorage/Modules/MultiplierCalculator.lua', purpose: 'Shared calculation helper for glove bonuses, rebirth buffs, and VIP perks', scriptType: 'module' },
      { path: 'ReplicatedStorage/Configuration/GameConfig.lua', purpose: 'Centralized balance settings, costs, rebirth formulas, and item tables', scriptType: 'module' },
      { path: 'StarterPlayer/StarterPlayerScripts/InputController.client.lua', purpose: 'Touch and mouse attack listeners, keybinds, and visual hit feedback', scriptType: 'client' },
      { path: 'StarterGui/MainUI/HUD.client.lua', purpose: 'Mobile-responsive UI updating power counters, rebirth buttons, and shop modals', scriptType: 'client' }
    ],
    requiredUI: [
      { name: 'TopStatsBar', description: 'Displays Power, Rebirths, and Coins with animated counters' },
      { name: 'MobileAttackButton', description: 'Large touch button for mobile players to punch targets' },
      { name: 'ShopModal', description: 'Card-based grid of gloves and multipliers with Buy buttons' },
      { name: 'RebirthPrompt', description: 'Modal showing cost, reward multiplier, and confirmation button' },
      { name: 'LeaderboardBillboard', description: 'Shows top 10 players in the server by Power' }
    ],
    remotes: [
      { name: 'AttackDummy', type: 'RemoteEvent', purpose: 'Client requests dummy hit with dummy ID' },
      { name: 'RequestRebirth', type: 'RemoteFunction', purpose: 'Client requests rebirth; returns success boolean and error message' },
      { name: 'PurchaseItem', type: 'RemoteFunction', purpose: 'Client buys shop gear; returns success boolean and updated inventory' },
      { name: 'StatsUpdated', type: 'RemoteEvent', purpose: 'Server pushes updated player statistics to client' }
    ],
    dataStores: [
      { name: 'AnimePlayerData_v1', keys: ['Power', 'Rebirths', 'Coins', 'EquippedGlove', 'UnlockedAreas'] }
    ],
    mapRequirements: {
      name: 'Grand Martial Dojo',
      description: 'Circular stone arena surrounded by bamboo barriers, 5 training dummies with progressive health/rewards, a central master dummy, a rebirth pagoda, and a spawn pad.',
      elements: samplePreviewElements
    },
    npcRequirements: [
      { name: 'Upgrade Sensei', role: 'Opens the equipment and glove shop', count: 1 },
      { name: 'Rebirth Guardian', role: 'Explains rebirth multipliers and tracks requirements', count: 1 }
    ],
    configurationValues: [
      { key: 'BASE_POWER_PER_HIT', value: 10, description: 'Default power awarded per dummy hit' },
      { key: 'REBIRTH_BASE_COST', value: 10000, description: 'Power required for the first rebirth' },
      { key: 'REBIRTH_COST_MULTIPLIER', value: 2.5, description: 'Exponential cost scalar per subsequent rebirth' },
      { key: 'ATTACK_COOLDOWN', value: 0.25, description: 'Minimum time in seconds between punches' }
    ]
  },
  previewElements: samplePreviewElements,
  validationIssues: [],
  chatHistory: [
    {
      id: 'msg-1',
      sender: 'user',
      content: 'Create an anime simulator where players train by attacking dummies, earn power, buy upgrades, rebirth, unlock areas, and compete on leaderboards.',
      timestamp: Date.now() - 120000
    },
    {
      id: 'msg-2',
      sender: 'ai',
      content: 'I have designed a comprehensive game architecture for "Anime Training Simulator". The design separates server-authoritative logic from client interactions, implements standard Roblox services (DataStoreService, Players, ReplicatedStorage), provides a 3D dojo arena layout, and includes mobile-first UI controls.',
      timestamp: Date.now() - 110000
    }
  ],
  files: {
    'ServerScriptService/Main.server.lua': {
      path: 'ServerScriptService/Main.server.lua',
      name: 'Main.server.lua',
      language: 'luau',
      type: 'server',
      content: `local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerScriptService = game:GetService("ServerScriptService")

local RemotesFolder = Instance.new("Folder")
RemotesFolder.Name = "Remotes"
RemotesFolder.Parent = ReplicatedStorage

local function createRemoteEvent(name: string): RemoteEvent
    local existing = RemotesFolder:FindFirstChild(name)
    if existing and existing:IsA("RemoteEvent") then
        return existing
    end
    local remote = Instance.new("RemoteEvent")
    remote.Name = name
    remote.Parent = RemotesFolder
    return remote
end

local function createRemoteFunction(name: string): RemoteFunction
    local existing = RemotesFolder:FindFirstChild(name)
    if existing and existing:IsA("RemoteFunction") then
        return existing
    end
    local remote = Instance.new("RemoteFunction")
    remote.Name = name
    remote.Parent = RemotesFolder
    return remote
end

createRemoteEvent("AttackDummy")
createRemoteEvent("StatsUpdated")
createRemoteFunction("RequestRebirth")
createRemoteFunction("PurchaseItem")

local function setupLeaderstats(player: Player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local power = Instance.new("IntValue")
    power.Name = "Power"
    power.Value = 0
    power.Parent = leaderstats

    local rebirths = Instance.new("IntValue")
    rebirths.Name = "Rebirths"
    rebirths.Value = 0
    rebirths.Parent = leaderstats

    local coins = Instance.new("IntValue")
    coins.Name = "Coins"
    coins.Value = 100
    coins.Parent = leaderstats
end

Players.PlayerAdded:Connect(function(player)
    setupLeaderstats(player)
end)
`
    },
    'ServerScriptService/Systems/TrainingSystem.server.lua': {
      path: 'ServerScriptService/Systems/TrainingSystem.server.lua',
      name: 'TrainingSystem.server.lua',
      language: 'luau',
      type: 'server',
      content: `local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Remotes = ReplicatedStorage:WaitForChild("Remotes")
local AttackRemote = Remotes:WaitForChild("AttackDummy")
local StatsRemote = Remotes:WaitForChild("StatsUpdated")

local Config = require(ReplicatedStorage:WaitForChild("Configuration"):WaitForChild("GameConfig"))
local MultiplierCalculator = require(ReplicatedStorage:WaitForChild("Modules"):WaitForChild("MultiplierCalculator"))

local lastAttackMap: { [Player]: number } = {}

local dummyRewards: { [string]: number } = {
    ["Dummy 1 (Beginner)"] = 10,
    ["Dummy 2 (Beginner)"] = 10,
    ["Dummy 3 (Adept)"] = 50,
    ["Dummy 4 (Adept)"] = 50,
    ["Master Dummy (Elite)"] = 250,
}

AttackRemote.OnServerEvent:Connect(function(player: Player, dummyName: string)
    local now = os.clock()
    local lastTime = lastAttackMap[player] or 0
    if now - lastTime < Config.ATTACK_COOLDOWN then
        return
    end
    lastAttackMap[player] = now

    local leaderstats = player:FindFirstChild("leaderstats")
    if not leaderstats then return end

    local powerVal = leaderstats:FindFirstChild("Power")
    local rebirthsVal = leaderstats:FindFirstChild("Rebirths")
    if not powerVal or not rebirthsVal then return end

    local baseAward = dummyRewards[dummyName] or Config.BASE_POWER_PER_HIT
    local multiplier = MultiplierCalculator.calculateMultiplier(rebirthsVal.Value, 1)
    local finalGain = math.floor(baseAward * multiplier)

    powerVal.Value = powerVal.Value + finalGain

    StatsRemote:FireClient(player, {
        Power = powerVal.Value,
        Gained = finalGain,
        DummyHit = dummyName
    })
end)

Players.PlayerRemoving:Connect(function(player)
    lastAttackMap[player] = nil
end)
`
    },
    'ServerScriptService/Systems/RebirthSystem.server.lua': {
      path: 'ServerScriptService/Systems/RebirthSystem.server.lua',
      name: 'RebirthSystem.server.lua',
      language: 'luau',
      type: 'server',
      content: `local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Remotes = ReplicatedStorage:WaitForChild("Remotes")
local RebirthFunction = Remotes:WaitForChild("RequestRebirth")
local Config = require(ReplicatedStorage:WaitForChild("Configuration"):WaitForChild("GameConfig"))

local function calculateRebirthCost(currentRebirths: number): number
    return math.floor(Config.REBIRTH_BASE_COST * (Config.REBIRTH_COST_MULTIPLIER ^ currentRebirths))
end

RebirthFunction.OnServerInvoke = function(player: Player)
    local leaderstats = player:FindFirstChild("leaderstats")
    if not leaderstats then
        return false, "Leaderstats not initialized"
    end

    local powerVal = leaderstats:FindFirstChild("Power")
    local rebirthsVal = leaderstats:FindFirstChild("Rebirths")
    local coinsVal = leaderstats:FindFirstChild("Coins")

    if not powerVal or not rebirthsVal or not coinsVal then
        return false, "Missing statistics"
    end

    local requiredPower = calculateRebirthCost(rebirthsVal.Value)

    if powerVal.Value < requiredPower then
        return false, string.format("Insufficient Power. Needed: %d, Current: %d", requiredPower, powerVal.Value)
    end

    powerVal.Value = 0
    rebirthsVal.Value = rebirthsVal.Value + 1
    coinsVal.Value = coinsVal.Value + (rebirthsVal.Value * 500)

    return true, string.format("Rebirth successful! You are now Rebirth %d.", rebirthsVal.Value)
end
`
    },
    'ServerScriptService/Systems/ShopSystem.server.lua': {
      path: 'ServerScriptService/Systems/ShopSystem.server.lua',
      name: 'ShopSystem.server.lua',
      language: 'luau',
      type: 'server',
      content: `local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Remotes = ReplicatedStorage:WaitForChild("Remotes")
local PurchaseFunction = Remotes:WaitForChild("PurchaseItem")
local Config = require(ReplicatedStorage:WaitForChild("Configuration"):WaitForChild("GameConfig"))

PurchaseFunction.OnServerInvoke = function(player: Player, itemId: string)
    local item = Config.SHOP_ITEMS[itemId]
    if not item then
        return false, "Item does not exist"
    end

    local leaderstats = player:FindFirstChild("leaderstats")
    if not leaderstats then return false, "No player data" end

    local coinsVal = leaderstats:FindFirstChild("Coins")
    if not coinsVal then return false, "No coins value" end

    if coinsVal.Value < item.Cost then
        return false, "Not enough coins"
    end

    coinsVal.Value = coinsVal.Value - item.Cost
    return true, string.format("Purchased %s successfully!", item.Name)
end
`
    },
    'ServerScriptService/Services/ProfileService.server.lua': {
      path: 'ServerScriptService/Services/ProfileService.server.lua',
      name: 'ProfileService.server.lua',
      language: 'luau',
      type: 'server',
      content: `local Players = game:GetService("Players")
local DataStoreService = game:GetService("DataStoreService")

local PlayerDataStore = DataStoreService:GetDataStore("AnimePlayerData_v1")

local function loadData(player: Player)
    local key = "Player_" .. tostring(player.UserId)
    local success, data = pcall(function()
        return PlayerDataStore:GetAsync(key)
    end)

    if success and data then
        local leaderstats = player:WaitForChild("leaderstats", 5)
        if leaderstats then
            local power = leaderstats:FindFirstChild("Power")
            local rebirths = leaderstats:FindFirstChild("Rebirths")
            local coins = leaderstats:FindFirstChild("Coins")

            if power and data.Power then power.Value = data.Power end
            if rebirths and data.Rebirths then rebirths.Value = data.Rebirths end
            if coins and data.Coins then coins.Value = data.Coins end
        end
    end
end

local function saveData(player: Player)
    local leaderstats = player:FindFirstChild("leaderstats")
    if not leaderstats then return end

    local power = leaderstats:FindFirstChild("Power")
    local rebirths = leaderstats:FindFirstChild("Rebirths")
    local coins = leaderstats:FindFirstChild("Coins")

    local dataToSave = {
        Power = power and power.Value or 0,
        Rebirths = rebirths and rebirths.Value or 0,
        Coins = coins and coins.Value or 0,
    }

    local key = "Player_" .. tostring(player.UserId)
    pcall(function()
        PlayerDataStore:SetAsync(key, dataToSave)
    end)
end

Players.PlayerAdded:Connect(loadData)
Players.PlayerRemoving:Connect(saveData)

game:BindToClose(function()
    for _, player in ipairs(Players:GetPlayers()) do
        saveData(player)
    end
end)
`
    },
    'ReplicatedStorage/Modules/MultiplierCalculator.lua': {
      path: 'ReplicatedStorage/Modules/MultiplierCalculator.lua',
      name: 'MultiplierCalculator.lua',
      language: 'luau',
      type: 'module',
      content: `local MultiplierCalculator = {}

function MultiplierCalculator.calculateMultiplier(rebirths: number, gloveBonus: number?): number
    local r = rebirths or 0
    local g = gloveBonus or 1
    local rebirthMultiplier = 1 + (r * 1.5)
    return rebirthMultiplier * g
end

function MultiplierCalculator.getRankName(power: number): string
    if power >= 1000000 then
        return "Supreme Deity"
    elseif power >= 250000 then
        return "Vanguard Emperor"
    elseif power >= 50000 then
        return "Shadow Master"
    elseif power >= 10000 then
        return "Martial Adept"
    elseif power >= 1000 then
        return "Warrior"
    else
        return "Apprentice"
    end
end

return MultiplierCalculator
`
    },
    'ReplicatedStorage/Configuration/GameConfig.lua': {
      path: 'ReplicatedStorage/Configuration/GameConfig.lua',
      name: 'GameConfig.lua',
      language: 'luau',
      type: 'module',
      content: `local GameConfig = {
    GAME_TITLE = "Anime Training Simulator",
    BASE_POWER_PER_HIT = 10,
    REBIRTH_BASE_COST = 10000,
    REBIRTH_COST_MULTIPLIER = 2.5,
    ATTACK_COOLDOWN = 0.25,
    SHOP_ITEMS = {
        ["iron_gloves"] = {
            Name = "Iron Fist Wraps",
            Cost = 500,
            Multiplier = 1.5,
            Description = "Durable handwraps providing +50% power generation."
        },
        ["flame_gloves"] = {
            Name = "Flame Gauntlets",
            Cost = 2500,
            Multiplier = 2.5,
            Description = "Infused with dragon flame for 2.5x hit efficiency."
        },
        ["void_aura"] = {
            Name = "Cosmic Void Aura",
            Cost = 10000,
            Multiplier = 5.0,
            Description = "Envelops the warrior in celestial power."
        }
    }
}

return GameConfig
`
    },
    'StarterPlayer/StarterPlayerScripts/InputController.client.lua': {
      path: 'StarterPlayer/StarterPlayerScripts/InputController.client.lua',
      name: 'InputController.client.lua',
      language: 'luau',
      type: 'client',
      content: `local UserInputService = game:GetService("UserInputService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Players = game:GetService("Players")

local player = Players.LocalPlayer
local Remotes = ReplicatedStorage:WaitForChild("Remotes")
local AttackRemote = Remotes:WaitForChild("AttackDummy")

local selectedTarget = "Dummy 1 (Beginner)"

local function triggerAttack()
    AttackRemote:FireServer(selectedTarget)
end

UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if gameProcessed then return end
    if input.UserInputType == Enum.UserInputType.MouseButton1 or input.KeyCode == Enum.KeyCode.F then
        triggerAttack()
    end
end)
`
    },
    'StarterGui/MainUI/HUD.client.lua': {
      path: 'StarterGui/MainUI/HUD.client.lua',
      name: 'HUD.client.lua',
      language: 'luau',
      type: 'client',
      content: `local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local player = Players.LocalPlayer
local Remotes = ReplicatedStorage:WaitForChild("Remotes")
local StatsRemote = Remotes:WaitForChild("StatsUpdated")
local RebirthFunction = Remotes:WaitForChild("RequestRebirth")

local playerGui = player:WaitForChild("PlayerGui")
local screenGui = Instance.new("ScreenGui")
screenGui.Name = "AnimeSimulatorHUD"
screenGui.ResetOnSpawn = false
screenGui.Parent = playerGui

local topBar = Instance.new("Frame")
topBar.Name = "TopBar"
topBar.Size = UDim2.new(0.6, 0, 0.08, 0)
topBar.Position = UDim2.new(0.2, 0, 0.02, 0)
topBar.BackgroundColor3 = Color3.fromRGB(15, 23, 42)
topBar.BorderSizePixel = 0
topBar.Parent = screenGui

local powerLabel = Instance.new("TextLabel")
powerLabel.Name = "PowerLabel"
powerLabel.Size = UDim2.new(0.33, 0, 1, 0)
powerLabel.Position = UDim2.new(0, 0, 0, 0)
powerLabel.BackgroundTransparency = 1
powerLabel.TextColor3 = Color3.fromRGB(56, 189, 248)
powerLabel.TextScaled = true
powerLabel.Font = Enum.Font.FredokaOne
powerLabel.Text = "Power: 0"
powerLabel.Parent = topBar

local rebirthLabel = Instance.new("TextLabel")
rebirthLabel.Name = "RebirthLabel"
rebirthLabel.Size = UDim2.new(0.33, 0, 1, 0)
rebirthLabel.Position = UDim2.new(0.33, 0, 0, 0)
rebirthLabel.BackgroundTransparency = 1
rebirthLabel.TextColor3 = Color3.fromRGB(52, 211, 153)
rebirthLabel.TextScaled = true
rebirthLabel.Font = Enum.Font.FredokaOne
rebirthLabel.Text = "Rebirths: 0"
rebirthLabel.Parent = topBar

local coinsLabel = Instance.new("TextLabel")
coinsLabel.Name = "CoinsLabel"
coinsLabel.Size = UDim2.new(0.34, 0, 1, 0)
coinsLabel.Position = UDim2.new(0.66, 0, 0, 0)
coinsLabel.BackgroundTransparency = 1
coinsLabel.TextColor3 = Color3.fromRGB(250, 204, 21)
coinsLabel.TextScaled = true
coinsLabel.Font = Enum.Font.FredokaOne
coinsLabel.Text = "Coins: 100"
coinsLabel.Parent = topBar

local mobileAttackBtn = Instance.new("TextButton")
mobileAttackBtn.Name = "MobileAttackButton"
mobileAttackBtn.Size = UDim2.new(0, 110, 0, 110)
mobileAttackBtn.Position = UDim2.new(0.82, 0, 0.68, 0)
mobileAttackBtn.BackgroundColor3 = Color3.fromRGB(239, 68, 68)
mobileAttackBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
mobileAttackBtn.TextScaled = true
mobileAttackBtn.Font = Enum.Font.FredokaOne
mobileAttackBtn.Text = "PUNCH!"
mobileAttackBtn.Parent = screenGui

local corner = Instance.new("UICorner")
corner.CornerRadius = UDim.new(0.5, 0)
corner.Parent = mobileAttackBtn

mobileAttackBtn.MouseButton1Click:Connect(function()
    Remotes.AttackDummy:FireServer("Dummy 1 (Beginner)")
end)

StatsRemote.OnClientEvent:Connect(function(data)
    if data and data.Power then
        powerLabel.Text = "Power: " .. tostring(data.Power)
    end
end)
`
    },
    'README.md': {
      path: 'README.md',
      name: 'README.md',
      language: 'markdown',
      type: 'doc',
      content: `# Anime Training Simulator

Generated by **Roblox AI Studio**.

## Project Structure
\`\`\`
GameProject/
├── Workspace/
│   ├── Map/
│   ├── NPCs/
│   ├── SpawnLocations/
│   └── Dummies/
├── ReplicatedStorage/
│   ├── Remotes/
│   ├── Modules/
│   └── Configuration/
├── ServerScriptService/
│   ├── Systems/
│   ├── Services/
│   └── Main.server.lua
├── StarterPlayer/
│   └── StarterPlayerScripts/
└── StarterGui/
    └── MainUI/
\`\`\`

## How to Import into Roblox Studio
1. Open Roblox Studio and launch a new **Baseplate** template.
2. Under **Explorer**:
   - Create folders in \`ServerScriptService\` and paste the \`.server.lua\` scripts inside.
   - Create folders in \`ReplicatedStorage\` and paste the module scripts and remotes.
   - Place \`StarterPlayerScripts\` into \`StarterPlayer > StarterPlayerScripts\`.
   - Place \`StarterGui\` into \`StarterGui\`.
3. In **Game Settings > Security**:
   - Enable **Allow HTTP Requests** (if external APIs used).
   - Enable **Enable Studio Access to API Services** for DataStores to function in Studio test mode.
4. Press **Play (F5)** to test in Roblox Studio!
`
    }
  }
};
