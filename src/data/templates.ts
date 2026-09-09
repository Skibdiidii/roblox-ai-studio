import { GamePlan, PreviewElement, ProjectFile } from '../types';

export interface GameTemplate {
  id: string;
  name: string;
  genre: string;
  badge: string;
  description: string;
  previewColor: string;
  plan: GamePlan;
  previewElements: PreviewElement[];
  files: Record<string, ProjectFile>;
}

export const GAME_TEMPLATES: GameTemplate[] = [
  {
    id: 'anime-simulator',
    name: 'Anime Simulator',
    genre: 'Simulator',
    badge: 'Popular',
    description: 'Attack dummies, accumulate power, buy gloves and auras, rebirth, and climb global leaderboards.',
    previewColor: '#3b82f6',
    previewElements: [
      { id: '1', name: 'Arena Base', type: 'arena', position: [0, 0.5, 0], size: [50, 1, 50], color: '#3b82f6', shape: 'cylinder' },
      { id: '2', name: 'Spawn Pad', type: 'spawn', position: [0, 1.2, -18], size: [5, 0.4, 5], color: '#10b981', shape: 'box', label: 'Spawn' },
      { id: '3', name: 'Dummy 1', type: 'dummy', position: [-10, 2.5, -4], size: [2, 4, 1.5], color: '#eab308', shape: 'box', label: '+10 Power' },
      { id: '4', name: 'Dummy 2', type: 'dummy', position: [10, 2.5, -4], size: [2, 4, 1.5], color: '#eab308', shape: 'box', label: '+10 Power' },
      { id: '5', name: 'Boss Dummy', type: 'dummy', position: [0, 3, 8], size: [3, 5, 2], color: '#ef4444', shape: 'box', label: 'Boss +100 Power' },
      { id: '6', name: 'Upgrade NPC', type: 'npc', position: [-16, 2.5, -12], size: [2, 4, 1.5], color: '#8b5cf6', shape: 'box', label: 'Shop Sensei' }
    ],
    plan: {
      title: 'Anime Simulator',
      genre: 'Simulator',
      concept: 'Power training simulator with combat animations and rebirth loops.',
      gameplayLoop: ['Punch dummies to gain power', 'Rebirth at thresholds', 'Buy upgraded gloves from sensei', 'Unlock higher level zones'],
      gameSystems: [
        { name: 'Training Engine', description: 'Server-side rate limited dummy damage', files: ['ServerScriptService/Systems/TrainingSystem.server.lua'] },
        { name: 'Rebirth System', description: 'Multiplier progression and stat reset', files: ['ServerScriptService/Systems/RebirthSystem.server.lua'] }
      ],
      requiredScripts: [
        { path: 'ServerScriptService/Main.server.lua', purpose: 'Bootstrap', scriptType: 'server' },
        { path: 'ServerScriptService/Systems/TrainingSystem.server.lua', purpose: 'Hit logic', scriptType: 'server' }
      ],
      requiredUI: [{ name: 'HUD', description: 'Power and Rebirth indicators' }],
      remotes: [{ name: 'AttackDummy', type: 'RemoteEvent', purpose: 'Trigger punch' }],
      dataStores: [{ name: 'AnimeStats', keys: ['Power', 'Rebirths'] }],
      mapRequirements: { name: 'Dojo Arena', description: 'Dojo with training dummies', elements: [] },
      npcRequirements: [{ name: 'Sensei', role: 'Shop vendor', count: 1 }],
      configurationValues: [{ key: 'BASE_POWER', value: 10, description: 'Power per hit' }]
    },
    files: {
      'ServerScriptService/Main.server.lua': {
        path: 'ServerScriptService/Main.server.lua',
        name: 'Main.server.lua',
        language: 'luau',
        type: 'server',
        content: `local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local remotes = Instance.new("Folder")
remotes.Name = "Remotes"
remotes.Parent = ReplicatedStorage

local attack = Instance.new("RemoteEvent")
attack.Name = "AttackDummy"
attack.Parent = remotes

Players.PlayerAdded:Connect(function(player)
    local stats = Instance.new("Folder")
    stats.Name = "leaderstats"
    stats.Parent = player

    local power = Instance.new("IntValue")
    power.Name = "Power"
    power.Value = 0
    power.Parent = stats
end)
`
      }
    }
  },
  {
    id: 'battleground',
    name: 'Battleground',
    genre: 'Action/PvP',
    badge: 'Trending',
    description: 'Anime PvP arena with combat combos, dash mechanics, block, counters, and ultimate abilities.',
    previewColor: '#ef4444',
    previewElements: [
      { id: '1', name: 'Destructible Arena', type: 'arena', position: [0, 0.5, 0], size: [70, 1, 70], color: '#475569', shape: 'box' },
      { id: '2', name: 'Spawn Red', type: 'spawn', position: [-25, 1.2, 0], size: [6, 0.4, 6], color: '#ef4444', shape: 'box', label: 'Team Red' },
      { id: '3', name: 'Spawn Blue', type: 'spawn', position: [25, 1.2, 0], size: [6, 0.4, 6], color: '#3b82f6', shape: 'box', label: 'Team Blue' },
      { id: '4', name: 'Ruined Pillar 1', type: 'building', position: [-12, 5, -12], size: [4, 10, 4], color: '#94a3b8', shape: 'cylinder' },
      { id: '5', name: 'Ruined Pillar 2', type: 'building', position: [12, 5, 12], size: [4, 10, 4], color: '#94a3b8', shape: 'cylinder' },
      { id: '6', name: 'Center Power Altar', type: 'building', position: [0, 2, 0], size: [8, 3, 8], color: '#eab308', shape: 'box', label: 'Ultimate Shrine' }
    ],
    plan: {
      title: 'Anime Battleground',
      genre: 'Action PvP',
      concept: 'Fast-paced martial arts combat arena where players execute 4-hit M1 combos, dashes, blocks, and ultimate awakenings.',
      gameplayLoop: ['Spawn in combat arena', 'Engage opponents with M1 attacks and special abilities (Q, E, R)', 'Fill Awakening meter to activate Ultimate', 'Earn Kill Bounties to unlock character movesets'],
      gameSystems: [
        { name: 'Combo Engine', description: 'Server-side hitbox detection with stun states', files: ['ServerScriptService/Systems/CombatSystem.server.lua'] },
        { name: 'Awakening System', description: 'Transformations and boosted special attacks', files: ['ServerScriptService/Systems/AwakeningSystem.server.lua'] }
      ],
      requiredScripts: [
        { path: 'ServerScriptService/Main.server.lua', purpose: 'Character damage listener and leaderstats', scriptType: 'server' },
        { path: 'ServerScriptService/Systems/CombatSystem.server.lua', purpose: 'Stun timers and combo validation', scriptType: 'server' }
      ],
      requiredUI: [{ name: 'CombatHUD', description: 'Health, Stamina, and Ultimate gauge' }],
      remotes: [{ name: 'PerformAttack', type: 'RemoteEvent', purpose: 'Trigger punch or skill' }],
      dataStores: [{ name: 'BattleStats', keys: ['Kills', 'Deaths', 'SelectedCharacter'] }],
      mapRequirements: { name: 'Shattered Colosseum', description: 'Stone arena with destructible pillars', elements: [] },
      npcRequirements: [{ name: 'Training Bot', role: 'Sparring partner', count: 2 }],
      configurationValues: [{ key: 'COMBO_WINDOW', value: 0.8, description: 'Seconds before M1 combo resets' }]
    },
    files: {
      'ServerScriptService/Main.server.lua': {
        path: 'ServerScriptService/Main.server.lua',
        name: 'Main.server.lua',
        language: 'luau',
        type: 'server',
        content: `local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local remotes = Instance.new("Folder")
remotes.Name = "Remotes"
remotes.Parent = ReplicatedStorage

local attackEvent = Instance.new("RemoteEvent")
attackEvent.Name = "PerformAttack"
attackEvent.Parent = remotes

Players.PlayerAdded:Connect(function(player)
    local stats = Instance.new("Folder")
    stats.Name = "leaderstats"
    stats.Parent = player

    local kills = Instance.new("IntValue")
    kills.Name = "Kills"
    kills.Value = 0
    kills.Parent = stats

    local streak = Instance.new("IntValue")
    streak.Name = "Streak"
    streak.Value = 0
    streak.Parent = stats
end)
`
      }
    }
  },
  {
    id: 'obby',
    name: 'Obby',
    genre: 'Platformer',
    badge: 'Classic',
    description: 'Obstacle course with checkpoint system, moving platforms, kill bricks, stage skips, and timer speedruns.',
    previewColor: '#10b981',
    previewElements: [
      { id: '1', name: 'Start Platform', type: 'spawn', position: [0, 1, 0], size: [12, 1, 12], color: '#10b981', shape: 'box', label: 'Stage 1' },
      { id: '2', name: 'Lava Jump 1', type: 'obstacle', position: [0, 2, 12], size: [4, 1, 4], color: '#ef4444', shape: 'box', label: 'Hazard' },
      { id: '3', name: 'Island 2', type: 'part', position: [0, 3, 22], size: [8, 1, 8], color: '#38bdf8', shape: 'box', label: 'Checkpoint 2' },
      { id: '4', name: 'Spinning Beam', type: 'obstacle', position: [0, 4.5, 34], size: [16, 1, 2], color: '#f59e0b', shape: 'box', label: 'Rotator' },
      { id: '5', name: 'Island 3', type: 'part', position: [0, 5, 46], size: [8, 1, 8], color: '#38bdf8', shape: 'box', label: 'Checkpoint 3' },
      { id: '6', name: 'Finish Trophy Pad', type: 'building', position: [0, 7, 60], size: [14, 1, 14], color: '#eab308', shape: 'cylinder', label: 'VICTORY' }
    ],
    plan: {
      title: 'Neon Sky Obby',
      genre: 'Platformer / Obby',
      concept: '100-stage rainbow platformer featuring checkpoints, speedrun timers, anti-cheat fall teleporters, and cosmetic trails.',
      gameplayLoop: ['Navigate parkour platforms', 'Touch checkpoints to save progress', 'Dodge lasers and rotating bars', 'Reach the victory podium'],
      gameSystems: [
        { name: 'Checkpoint System', description: 'Saves current stage and teleports upon character reset', files: ['ServerScriptService/Systems/CheckpointSystem.server.lua'] },
        { name: 'Speedrun Timer', description: 'Tracks completion millisecond records', files: ['ServerScriptService/Systems/TimerSystem.server.lua'] }
      ],
      requiredScripts: [
        { path: 'ServerScriptService/Main.server.lua', purpose: 'Player stage initialisation', scriptType: 'server' },
        { path: 'ServerScriptService/Systems/CheckpointSystem.server.lua', purpose: 'Touch detectors and stage updates', scriptType: 'server' }
      ],
      requiredUI: [{ name: 'ObbyHUD', description: 'Current Stage, Best Time, Skip Button' }],
      remotes: [{ name: 'StageReached', type: 'RemoteEvent', purpose: 'Notify client of new checkpoint' }],
      dataStores: [{ name: 'ObbyProgress', keys: ['Stage', 'FastestTime'] }],
      mapRequirements: { name: 'Floating Clouds', description: 'Neon parkour steps stretching across the sky', elements: [] },
      npcRequirements: [{ name: 'Guide Bot', role: 'Provides tutorial hints', count: 1 }],
      configurationValues: [{ key: 'TOTAL_STAGES', value: 50, description: 'Total level count' }]
    },
    files: {
      'ServerScriptService/Main.server.lua': {
        path: 'ServerScriptService/Main.server.lua',
        name: 'Main.server.lua',
        language: 'luau',
        type: 'server',
        content: `local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
    local stats = Instance.new("Folder")
    stats.Name = "leaderstats"
    stats.Parent = player

    local stage = Instance.new("IntValue")
    stage.Name = "Stage"
    stage.Value = 1
    stage.Parent = stats
end)
`
      }
    }
  },
  {
    id: 'tycoon',
    name: 'Tycoon',
    genre: 'Tycoon',
    badge: 'Simulation',
    description: 'Claim your plot, purchase droppers, conveyers, collectors, wall upgrades, and unlock automated revenue.',
    previewColor: '#f59e0b',
    previewElements: [
      { id: '1', name: 'Plot Baseplate', type: 'arena', position: [0, 0.5, 0], size: [50, 1, 50], color: '#334155', shape: 'box', label: 'Tycoon Plot' },
      { id: '2', name: 'Claim Pad', type: 'spawn', position: [0, 1.2, -18], size: [6, 0.4, 6], color: '#10b981', shape: 'box', label: 'Claim Plot' },
      { id: '3', name: 'Dropper Tier 1', type: 'building', position: [-12, 6, 8], size: [4, 6, 4], color: '#f59e0b', shape: 'box', label: 'Dropper 1' },
      { id: '4', name: 'Conveyor Belt', type: 'part', position: [-12, 1, 0], size: [4, 0.5, 24], color: '#0f172a', shape: 'box', label: 'Conveyor' },
      { id: '5', name: 'Ore Collector', type: 'building', position: [-12, 2, -12], size: [6, 2, 4], color: '#22c55e', shape: 'box', label: 'Cash Collector' },
      { id: '6', name: 'Buy Button (Walls)', type: 'part', position: [6, 1.2, -8], size: [4, 0.4, 4], color: '#ef4444', shape: 'cylinder', label: '$250 Walls' }
    ],
    plan: {
      title: 'Mega Factory Tycoon',
      genre: 'Tycoon',
      concept: 'Classic button-based tycoon where ores drop onto moving conveyor belts into collectors to amass millions in cash.',
      gameplayLoop: ['Claim empty plot', 'Step on buttons to buy droppers and conveyors', 'Collect generated cash from the vault', 'Purchase lasers, weapons, and defense walls'],
      gameSystems: [
        { name: 'Dropper Engine', description: 'Spawns physical ore parts with monetary values', files: ['ServerScriptService/Systems/DropperSystem.server.lua'] },
        { name: 'Button Manager', description: 'Detects stepped touches, checks balance, and clones instances', files: ['ServerScriptService/Systems/ButtonSystem.server.lua'] }
      ],
      requiredScripts: [
        { path: 'ServerScriptService/Main.server.lua', purpose: 'Plot assignment and cash leaderstats', scriptType: 'server' }
      ],
      requiredUI: [{ name: 'CashHUD', description: 'Displays current money and plot status' }],
      remotes: [{ name: 'PurchaseButton', type: 'RemoteEvent', purpose: 'Buy element' }],
      dataStores: [{ name: 'TycoonSaves', keys: ['Cash', 'OwnedButtons'] }],
      mapRequirements: { name: 'Industrial Plots', description: '4 fenced factory plots with road connections', elements: [] },
      npcRequirements: [],
      configurationValues: [{ key: 'BASE_ORE_VALUE', value: 5, description: 'Cash per copper ore' }]
    },
    files: {
      'ServerScriptService/Main.server.lua': {
        path: 'ServerScriptService/Main.server.lua',
        name: 'Main.server.lua',
        language: 'luau',
        type: 'server',
        content: `local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
    local stats = Instance.new("Folder")
    stats.Name = "leaderstats"
    stats.Parent = player

    local cash = Instance.new("IntValue")
    cash.Name = "Cash"
    cash.Value = 0
    cash.Parent = stats
end)
`
      }
    }
  },
  {
    id: 'tower-defense',
    name: 'Tower Defense',
    genre: 'Strategy',
    badge: 'Strategy',
    description: 'Place animated defense towers along path waypoints, upgrade range and damage, and stop enemy waves.',
    previewColor: '#8b5cf6',
    previewElements: [
      { id: '1', name: 'Map Terrain', type: 'arena', position: [0, 0.5, 0], size: [60, 1, 60], color: '#15803d', shape: 'box', label: 'Battlefield' },
      { id: '2', name: 'Winding Path', type: 'part', position: [0, 0.8, 0], size: [10, 0.4, 50], color: '#ca8a04', shape: 'box', label: 'Mob Path' },
      { id: '3', name: 'Base Core', type: 'building', position: [0, 4, 25], size: [10, 8, 10], color: '#3b82f6', shape: 'box', label: 'Nexus Core 100 HP' },
      { id: '4', name: 'Tower Spot 1', type: 'building', position: [-12, 3, 0], size: [4, 5, 4], color: '#8b5cf6', shape: 'cylinder', label: 'Archer Tower' },
      { id: '5', name: 'Tower Spot 2', type: 'building', position: [12, 3, 0], size: [4, 5, 4], color: '#8b5cf6', shape: 'cylinder', label: 'Mage Tower' },
      { id: '6', name: 'Enemy Wave Spawn', type: 'spawn', position: [0, 1.2, -25], size: [8, 0.4, 6], color: '#ef4444', shape: 'box', label: 'Enemy Portal' }
    ],
    plan: {
      title: 'Kingdom Tower Defense',
      genre: 'Tower Defense',
      concept: 'Players cooperate to defend their nexus against 30 enemy waves by strategically placing and upgrading elemental towers.',
      gameplayLoop: ['Vote for map difficulty', 'Place starter archer and cannon towers with money', 'Towers auto-target closest enemy path points', 'Earn bounty per mob eliminated to upgrade'],
      gameSystems: [
        { name: 'Wave Spawner', description: 'Spawns NPC humanoids along path Waypoints', files: ['ServerScriptService/Systems/WaveSpawner.server.lua'] },
        { name: 'Tower AI Engine', description: 'Raycast targeting, range checks, and projectile firing', files: ['ServerScriptService/Systems/TowerAI.server.lua'] }
      ],
      requiredScripts: [
        { path: 'ServerScriptService/Main.server.lua', purpose: 'Nexus HP and game loop', scriptType: 'server' }
      ],
      requiredUI: [{ name: 'TowerShopBar', description: 'Placement buttons and tower stats' }],
      remotes: [{ name: 'PlaceTower', type: 'RemoteFunction', purpose: 'Validate placement' }],
      dataStores: [{ name: 'TDPlayerData', keys: ['Coins', 'UnlockedTowers'] }],
      mapRequirements: { name: 'Forest Pass', description: 'Cobblestone path through enchanted woods', elements: [] },
      npcRequirements: [{ name: 'Commander NPC', role: 'Initiates match voting', count: 1 }],
      configurationValues: [{ key: 'STARTING_CASH', value: 650, description: 'Initial building funds' }]
    },
    files: {
      'ServerScriptService/Main.server.lua': {
        path: 'ServerScriptService/Main.server.lua',
        name: 'Main.server.lua',
        language: 'luau',
        type: 'server',
        content: `local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
    local stats = Instance.new("Folder")
    stats.Name = "leaderstats"
    stats.Parent = player

    local gold = Instance.new("IntValue")
    gold.Name = "Gold"
    gold.Value = 650
    gold.Parent = stats
end)
`
      }
    }
  },
  {
    id: 'survival',
    name: 'Survival',
    genre: 'Survival',
    badge: 'Hardcore',
    description: 'Chop trees, mine stone, craft shelter, manage hunger and thirst, and survive hostile nights.',
    previewColor: '#059669',
    previewElements: [
      { id: '1', name: 'Island Island', type: 'arena', position: [0, 0.5, 0], size: [70, 1, 70], color: '#166534', shape: 'box', label: 'Wild Island' },
      { id: '2', name: 'Oak Tree 1', type: 'part', position: [-16, 6, -10], size: [3, 11, 3], color: '#78350f', shape: 'cylinder', label: 'Chop for Wood' },
      { id: '3', name: 'Oak Tree 2', type: 'part', position: [-20, 6, 14], size: [3, 11, 3], color: '#78350f', shape: 'cylinder', label: 'Chop for Wood' },
      { id: '4', name: 'Iron Rock', type: 'part', position: [18, 3, 12], size: [6, 5, 6], color: '#64748b', shape: 'box', label: 'Mine for Iron' },
      { id: '5', name: 'Campfire', type: 'building', position: [0, 1.5, 0], size: [4, 2, 4], color: '#ea580c', shape: 'box', label: 'Campfire / Heat' },
      { id: '6', name: 'Crafting Table', type: 'building', position: [6, 2, 4], size: [3, 3, 3], color: '#b45309', shape: 'box', label: 'Crafting Station' }
    ],
    plan: {
      title: 'Wilderness Survival',
      genre: 'Survival / Crafting',
      concept: 'Castaways harvest resources to build fortifications, craft tools, and withstand nightly elemental storms.',
      gameplayLoop: ['Harvest logs and flint', 'Craft campfire and basic shelter', 'Cook berries and fish to stay fed', 'Defend against wolves at nightfall'],
      gameSystems: [
        { name: 'Resource Gathering', description: 'Health-based breakable tree and rock nodes', files: ['ServerScriptService/Systems/HarvestSystem.server.lua'] },
        { name: 'Crafting Engine', description: 'Recipe validation and inventory addition', files: ['ServerScriptService/Systems/CraftingSystem.server.lua'] }
      ],
      requiredScripts: [
        { path: 'ServerScriptService/Main.server.lua', purpose: 'Day/night cycle and player status bars', scriptType: 'server' }
      ],
      requiredUI: [{ name: 'SurvivalHUD', description: 'Health, Hunger, Thirst, Warmth' }],
      remotes: [{ name: 'CraftItem', type: 'RemoteFunction', purpose: 'Attempt craft' }],
      dataStores: [{ name: 'SurvivalInv', keys: ['Inventory', 'DayStreak'] }],
      mapRequirements: { name: 'Survival Island', description: 'Dense forest surrounding a central clearing', elements: [] },
      npcRequirements: [],
      configurationValues: [{ key: 'DAY_LENGTH_SECONDS', value: 300, description: 'Seconds per day/night cycle' }]
    },
    files: {
      'ServerScriptService/Main.server.lua': {
        path: 'ServerScriptService/Main.server.lua',
        name: 'Main.server.lua',
        language: 'luau',
        type: 'server',
        content: `local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
    local stats = Instance.new("Folder")
    stats.Name = "leaderstats"
    stats.Parent = player

    local days = Instance.new("IntValue")
    days.Name = "Days"
    days.Value = 1
    days.Parent = stats
end)
`
      }
    }
  },
  {
    id: 'rpg',
    name: 'RPG',
    genre: 'RPG',
    badge: 'Adventure',
    description: 'Open world quests, level progression, inventory equipment, spell casting, dungeon raids, and boss encounters.',
    previewColor: '#a855f7',
    previewElements: [
      { id: '1', name: 'Town Square', type: 'arena', position: [0, 0.5, 0], size: [60, 1, 60], color: '#64748b', shape: 'box', label: 'Oakhaven Town' },
      { id: '2', name: 'Quest Master', type: 'npc', position: [-8, 2.5, -8], size: [2, 4, 1.5], color: '#f59e0b', shape: 'box', label: 'Quest Giver' },
      { id: '3', name: 'Blacksmith Shop', type: 'building', position: [-20, 5, -16], size: [12, 8, 12], color: '#475569', shape: 'box', label: 'Forge' },
      { id: '4', name: 'Dungeon Portal', type: 'building', position: [22, 6, 20], size: [8, 10, 4], color: '#9333ea', shape: 'box', label: 'Dungeon Gate Lvl 10+' },
      { id: '5', name: 'Forest Mob Area', type: 'arena', position: [0, 0.5, 45], size: [40, 1, 30], color: '#166534', shape: 'box', label: 'Goblin Glade' },
      { id: '6', name: 'Forest Goblin', type: 'npc', position: [6, 2, 40], size: [2, 3, 1.5], color: '#22c55e', shape: 'box', label: 'Goblin Lvl 3' }
    ],
    plan: {
      title: 'Legends of Oakhaven',
      genre: 'RPG / Open World',
      concept: 'Embark on an epic journey, accepting quests from villagers, slaying beasts, learning ancient magic spells, and looting legendary weapons.',
      gameplayLoop: ['Accept village quests', 'Battle forest monsters using swords and spells', 'Level up attributes (Strength, Agility, Arcane)', 'Clear party dungeons for mythic gear'],
      gameSystems: [
        { name: 'Quest System', description: 'Tracks active objectives, kill counters, and dialog', files: ['ServerScriptService/Systems/QuestSystem.server.lua'] },
        { name: 'Combat & Magic', description: 'Spell cooldowns, mana costs, and elemental affinities', files: ['ServerScriptService/Systems/MagicSystem.server.lua'] }
      ],
      requiredScripts: [
        { path: 'ServerScriptService/Main.server.lua', purpose: 'Player levels, EXP, and attribute points', scriptType: 'server' }
      ],
      requiredUI: [{ name: 'RPG_HUD', description: 'Health, Mana, EXP bar, Skill slots' }],
      remotes: [{ name: 'CastSpell', type: 'RemoteEvent', purpose: 'Activate magic skill' }],
      dataStores: [{ name: 'RPGProfiles', keys: ['Level', 'XP', 'Gear'] }],
      mapRequirements: { name: 'Oakhaven Kingdom', description: 'Cobblestone medieval village connected to monster woods', elements: [] },
      npcRequirements: [{ name: 'Mayor', role: 'Main storyline quest line', count: 1 }],
      configurationValues: [{ key: 'BASE_EXP_REQUIREMENT', value: 100, description: 'EXP needed for level 2' }]
    },
    files: {
      'ServerScriptService/Main.server.lua': {
        path: 'ServerScriptService/Main.server.lua',
        name: 'Main.server.lua',
        language: 'luau',
        type: 'server',
        content: `local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
    local stats = Instance.new("Folder")
    stats.Name = "leaderstats"
    stats.Parent = player

    local level = Instance.new("IntValue")
    level.Name = "Level"
    level.Value = 1
    level.Parent = stats

    local gold = Instance.new("IntValue")
    gold.Name = "Gold"
    gold.Value = 50
    gold.Parent = stats
end)
`
      }
    }
  },
  {
    id: 'clicker',
    name: 'Clicker',
    genre: 'Casual',
    badge: 'Casual',
    description: 'Rapid click mechanics, pet hatching system, egg gacha, rebirth zones, and exponential click boosts.',
    previewColor: '#ec4899',
    previewElements: [
      { id: '1', name: 'Clicker Floor', type: 'arena', position: [0, 0.5, 0], size: [45, 1, 45], color: '#ec4899', shape: 'cylinder', label: 'Click Hub' },
      { id: '2', name: 'Spawn Pad', type: 'spawn', position: [0, 1.2, -14], size: [5, 0.4, 5], color: '#10b981', shape: 'box', label: 'Spawn' },
      { id: '3', name: 'Common Egg ($100)', type: 'building', position: [-12, 3, 0], size: [4, 5, 4], color: '#facc15', shape: 'sphere', label: 'Common Egg' },
      { id: '4', name: 'Rare Egg ($2.5K)', type: 'building', position: [12, 3, 0], size: [4, 5, 4], color: '#3b82f6', shape: 'sphere', label: 'Rare Egg' },
      { id: '5', name: 'Rebirth Portal', type: 'building', position: [0, 4, 16], size: [6, 7, 2], color: '#a855f7', shape: 'box', label: 'World 2 Portal' }
    ],
    plan: {
      title: 'Super Clicker Simulator',
      genre: 'Clicker / Idle',
      concept: 'Tap furiously to amass Clicks, hatch adorable pets with multiplier stats, craft golden pets, and unlock fantasy worlds.',
      gameplayLoop: ['Click screen to gain Clicks', 'Hatch eggs for pets (Kitty, Doge, Dragon)', 'Equip top 3 pets for huge multiplier bonuses', 'Rebirth to unlock new island worlds'],
      gameSystems: [
        { name: 'Pet Hatching', description: 'RNG percentage based pet gacha with luck passes', files: ['ServerScriptService/Systems/EggSystem.server.lua'] },
        { name: 'Click Engine', description: 'Fast rate-limited click event with combo streaks', files: ['ServerScriptService/Systems/ClickSystem.server.lua'] }
      ],
      requiredScripts: [
        { path: 'ServerScriptService/Main.server.lua', purpose: 'Click values and pet inventory replication', scriptType: 'server' }
      ],
      requiredUI: [{ name: 'ClickerHUD', description: 'Huge Tap button, Pet inventory, Auto-click toggle' }],
      remotes: [{ name: 'PlayerClick', type: 'RemoteEvent', purpose: 'Submit tap' }],
      dataStores: [{ name: 'ClickerData', keys: ['Clicks', 'Gems', 'Pets'] }],
      mapRequirements: { name: 'Candy World', description: 'Pastel floating island with animated eggs', elements: [] },
      npcRequirements: [],
      configurationValues: [{ key: 'BASE_CLICK_GAIN', value: 1, description: 'Clicks per raw tap' }]
    },
    files: {
      'ServerScriptService/Main.server.lua': {
        path: 'ServerScriptService/Main.server.lua',
        name: 'Main.server.lua',
        language: 'luau',
        type: 'server',
        content: `local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
    local stats = Instance.new("Folder")
    stats.Name = "leaderstats"
    stats.Parent = player

    local clicks = Instance.new("IntValue")
    clicks.Name = "Clicks"
    clicks.Value = 0
    clicks.Parent = stats

    local gems = Instance.new("IntValue")
    gems.Name = "Gems"
    gems.Value = 0
    gems.Parent = stats
end)
`
      }
    }
  },
  {
    id: 'wave-defense',
    name: 'Wave Defense',
    genre: 'Action',
    badge: 'Co-op',
    description: 'Cooperative player survival against hordes of incoming zombies, barrier boarding, and mystery box weapons.',
    previewColor: '#0284c7',
    previewElements: [
      { id: '1', name: 'Fortress Yard', type: 'arena', position: [0, 0.5, 0], size: [60, 1, 60], color: '#334155', shape: 'box', label: 'Safe Zone' },
      { id: '2', name: 'Barricade Window 1', type: 'building', position: [-20, 2.5, 0], size: [2, 4, 8], color: '#78350f', shape: 'box', label: 'Window Barricade' },
      { id: '3', name: 'Barricade Window 2', type: 'building', position: [20, 2.5, 0], size: [2, 4, 8], color: '#78350f', shape: 'box', label: 'Window Barricade' },
      { id: '4', name: 'Mystery Box Gun', type: 'building', position: [0, 2, -18], size: [5, 3, 3], color: '#eab308', shape: 'box', label: 'Mystery Box ($950)' },
      { id: '5', name: 'Perk Machine', type: 'building', position: [-14, 3, -18], size: [3, 5, 3], color: '#ef4444', shape: 'box', label: 'Juggernog' },
      { id: '6', name: 'Zombie Spawn Outpost', type: 'spawn', position: [0, 1.2, 28], size: [10, 0.4, 6], color: '#15803d', shape: 'box', label: 'Zombie Breach' }
    ],
    plan: {
      title: 'Outpost Zombie Wave Defense',
      genre: 'Co-op Shooter',
      concept: 'Squad up to hold an abandoned military bunker against increasingly ferocious waves of infected zombies.',
      gameplayLoop: ['Shoot incoming zombies for points', 'Repair boarded wooden barriers', 'Roll the Mystery Box for ray guns and rifles', 'Survive special Hound rounds on wave 5, 10, 15'],
      gameSystems: [
        { name: 'Zombie Horde Spawner', description: 'Dynamic difficulty scaling and pathfinding AI', files: ['ServerScriptService/Systems/HordeSystem.server.lua'] },
        { name: 'Weapon & Box System', description: 'Raycasting firearms and random crate rolls', files: ['ServerScriptService/Systems/WeaponSystem.server.lua'] }
      ],
      requiredScripts: [
        { path: 'ServerScriptService/Main.server.lua', purpose: 'Wave counter and point leaderstats', scriptType: 'server' }
      ],
      requiredUI: [{ name: 'AmmoAndPointsHUD', description: 'Current wave, ammo clip, reserve, and points' }],
      remotes: [{ name: 'FireWeapon', type: 'RemoteEvent', purpose: 'Bullet raycast validation' }],
      dataStores: [{ name: 'HordeRecords', keys: ['HighestWave', 'TotalKills'] }],
      mapRequirements: { name: 'Derelict Bunker', description: 'Tight corridors and reinforced window openings', elements: [] },
      npcRequirements: [{ name: 'Infected Runner', role: 'Aggressive melee enemy', count: 10 }],
      configurationValues: [{ key: 'ZOMBIE_DAMAGE', value: 25, description: 'Hit damage to player' }]
    },
    files: {
      'ServerScriptService/Main.server.lua': {
        path: 'ServerScriptService/Main.server.lua',
        name: 'Main.server.lua',
        language: 'luau',
        type: 'server',
        content: `local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
    local stats = Instance.new("Folder")
    stats.Name = "leaderstats"
    stats.Parent = player

    local points = Instance.new("IntValue")
    points.Name = "Points"
    points.Value = 500
    points.Parent = stats

    local wave = Instance.new("IntValue")
    wave.Name = "Wave"
    wave.Value = 1
    wave.Parent = stats
end)
`
      }
    }
  }
];
