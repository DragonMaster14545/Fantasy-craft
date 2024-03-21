let testQuests = [
    {progress:0,rewards:[{type:'currency',id:'coins',amount:5}],steps:[
        {task:{type:'collect_items',amount:5,progress:0,id:'minecraft:diamond',name:'diamonds'},icon:'minecraft:iron_ingot',iconCompleted:'minecraft:green_concrete',name:{text:'Step1',color:0x39ed07},description:[{text:'test',color:0xed0707}]},
        {task:{type:'kill_mobs',amount:5,progress:0,id:'minecraft:zombie',name:'zombies'},icon:'minecraft:diamond',iconCompleted:'minecraft:green_concrete',name:{text:'Step1',color:0x39ed07},description:[{text:'test',color:0xed0707}]}
    ],type:'story_quest',icon:'kubejs:quest_icon0',name:{text:'Story quest 1',color:0x437a1d},description:[{text:'test',color:0xed0707}]},

    {progress:0,steps:[
        {task:{type:'kill_mobs',amount:5,progress:0,id:'minecraft:zombie',name:'zombies'},icon:'minecraft:diamond',iconCompleted:'minecraft:green_concrete',name:{text:'Step1',color:0x39ed07},description:[{text:'test',color:0xed0707}]}
    ],type:'story_quest',icon:'kubejs:quest_icon1',name:{text:'Story quest 1',color:0x437a1d},description:[{text:'test',color:0xed0707}]},
    
    {progress:0,steps:[
        {task:{type:'reach_level',amount:5,progress:0,id:'lightMeleCombat'},icon:'minecraft:paper',iconCompleted:'minecraft:green_concrete',name:{text:'Step1',color:0x39ed07},description:[{text:'test',color:0xed0707}]}
    ],type:'story_quest',icon:'kubejs:quest_icon2',name:{text:'Story quest 1',color:0x437a1d},description:[{text:'test',color:0xed0707}]},

    {progress:0,rewards:[{type:'item',id:'minecraft:stone',amount:5,name:'stone'}],steps:[
        {task:{type:'kill_mobs',amount:5,progress:0,id:'minecraft:zombie',name:'zombies'},icon:'minecraft:diamond',iconCompleted:'minecraft:green_concrete',name:{text:'Step1',color:0x39ed07},description:[{text:'test',color:0xed0707}]}
    ],type:'side_quest',icon:'kubejs:quest_icon3',name:{text:'Side quest 1',color:0x437a1d},description:[{text:'test',color:0xed0707}]},

    {progress:0,rewards:[{type:'item',id:'minecraft:diamond',amount:5,name:'diamond'},{type:'item',id:'minecraft:stone',amount:100,name:'stone'}],steps:[
        {task:{type:'kill_mobs',amount:5,progress:0,id:'minecraft:zombie',name:'zombies'},icon:'minecraft:emerald',iconCompleted:'minecraft:green_concrete',name:{text:'Step1',color:0x39ed07},description:[{text:'test',color:0xed0707},{text:'test',color:0xed0707}]},
        {task:{type:'kill_mobs',amount:5,progress:0,id:'minecraft:husk',name:'husks'},icon:'minecraft:diamond',iconCompleted:'minecraft:green_concrete',name:{text:'Step2',color:0x39ed07},description:[]}
    ],type:'bonus_quest',icon:'kubejs:quest_icon4',name:{text:'Bonus quest 1',color:0x437a1d},description:[{text:'test',color:0xed0707},{text:'test',color:0xed0707}]},

    {progress:0,rewards:[{type:'story_quest_progress',value:2}],steps:[
        {task:{type:'collect_items',amount:5,progress:0,id:'minecraft:diamond',name:'diamonds'},icon:'minecraft:emerald',iconCompleted:'minecraft:green_concrete',name:{text:'Step1',color:0x39ed07},description:[{text:'test',color:0xed0707},{text:'test',color:0xed0707}]},
        {task:{type:'deliver_items',amount:5,progress:0,inInventory:0,itemId:'minecraft:diamond',itemName:'diamonds',id:'npc1',name:'Test npc1',dialogue:{
            npcName:{text:'Test npc',color:0x00FFFF},sentences:[
            {npc:[{text:'1. sentence',color:0xFFFFFF},{text:'line2',color:0xFFFFFF}],answers:[
                {lines:[{text:'Close',color:0xFFFFFF},{text:'line2',color:0xFFFFFF}],result:'close'}
            ]}
        ]}},icon:'minecraft:emerald',iconCompleted:'minecraft:green_concrete',name:{text:'Step2',color:0x39ed07},description:[]}
    ],type:'story_quest',icon:'kubejs:quest_icon5',name:{text:'Bonus quest 4',color:0x437a1d},description:[{text:'test',color:0xed0707},{text:'test',color:0xed0707}]},

    {progress:0,rewards:[{type:'side_quest_completed',value:'test_quest'}],steps:[
        {task:{type:'talk_to_npc',amount:1,progress:0,id:'npc1',name:'Test npc2',dialogue:{
            npcName:{text:'Test npc',color:0x00FFFF},sentences:[
            {npc:[{text:'1. sentence',color:0xFFFFFF},{text:'line2',color:0xFFFFFF}],answers:[
                {lines:[{text:'Close',color:0xFFFFFF},{text:'line2',color:0xFFFFFF}],result:'close'}
            ]}
        ]}},icon:'minecraft:emerald',iconCompleted:'minecraft:green_concrete',name:{text:'Step2',color:0x39ed07},description:[]},
        {task:{type:'collect_items',amount:5,progress:0,id:'minecraft:diamond',name:'diamonds'},icon:'minecraft:emerald',iconCompleted:'minecraft:green_concrete',name:{text:'Step1',color:0x39ed07},description:[{text:'test',color:0xed0707},{text:'test',color:0xed0707}]}
    ],type:'side_quest',icon:'kubejs:quest_icon6',name:{text:'Bonus quest 1',color:0x437a1d},description:[{text:'test',color:0xed0707},{text:'test',color:0xed0707}]},

    {progress:0,rewards:[{type:'teleportation_point',id:'spawn'}],steps:[
        {task:{type:'kill_mobs',amount:1,progress:0,id:'minecraft:skeleton',name:'skeletons'},icon:'minecraft:bone',iconCompleted:'minecraft:green_concrete',name:{text:'Step1',color:0x39ed07},description:[{text:'test',color:0xed0707}]}
    ],type:'bonus_quest',icon:'kubejs:quest_icon6',name:{text:'Random bonus quest',color:0x437a1d},description:[{text:'test',color:0xed0707}]},

]


let npcInteractions = {
    npc1:[{requirement:'none',dialogue:{title:{text:'Topic one',color:0xFF00FF},npcName:{text:'Test npc',color:0x00FFFF},sentences:[
        {npc:[{text:'Hello ///username',color:0xFFFFFF},{text:'line2',color:0xFFFFFF}],answers:[
            {lines:[{text:'Close',color:0xFFFFFF},{text:'line2',color:0xFFFFFF}],result:'close'},
            {lines:[{text:'Set sentence',color:0xFFFFFF},{text:'line2',color:0xFFFFFF}],result:'setSentence',sentence:1},
            {lines:[{text:'Give quest',color:0xFFFFFF},{text:'close',color:0xFFFFFF}],result:'giveQuest',mode:'close',quest:{
                progress:0,steps:[
                    {task:{type:'kill_mobs',amount:5,progress:0,id:'minecraft:zombie',name:'zombies'},icon:'minecraft:diamond',iconCompleted:'minecraft:green_concrete',name:{text:'Step1',color:0x39ed07},description:[{text:'test',color:0xed0707}]}
                ],type:'story_quest',icon:'minecraft:diamond',name:{text:'Story quest 1',color:0x437a1d},description:[{text:'test',color:0xed0707}]}
            },
            {lines:[{text:'Give quest',color:0xFFFFFF},{text:'setSentence',color:0xFFFFFF}],result:'giveQuest',sentence:1,mode:'setSentence',quest:{
                progress:0,steps:[
                    {task:{type:'kill_mobs',amount:5,progress:0,id:'minecraft:zombie',name:'zombies'},icon:'minecraft:diamond',iconCompleted:'minecraft:green_concrete',name:{text:'Step1',color:0x39ed07},description:[{text:'test',color:0xed0707}]}
                ],type:'story_quest',icon:'minecraft:diamond',name:{text:'Story quest 1',color:0x437a1d},description:[{text:'test',color:0xed0707}]}
            }
        ]},
        {npc:[{text:'2. sentence',color:0xFFFFFF},{text:'line2',color:0xFFFFFF}],answers:[
            {lines:[{text:'Close',color:0xFFFFFF},{text:'line2',color:0xFFFFFF}],result:'close'}
        ]}
    ]}}]
}


let quests = {
    
}


let itemTypes = {
    armor:["helmet","chestplate","leggings","boots"],
    wands:["wand"],
    meleWeapons:["sword"],
    lightMeleWeapons:["sword"],
    heavyMeleWeapons:["axe"],
    rangedServants:["ranged_servant"],
    meleServants:["mele_servant"],
    buffServants:["buff_servant"],
    servants:["ranged_servant","mele_servant","buff_servant"]
}


let stats = {
    meleExtraDamage:{type:'sword',stat:'damage',mode:'+',icon:'minecraft:iron_sword',name:{text:'Extra mele damage',color:0x45fc03},description:[{text:'Extra damage for all mele weapons',color:0x45fc03}]},
    maxServants:{type:'any',stat:'maxServants',mode:'+',icon:'minecraft:diamond',name:{text:'Extra max servants',color:0x45fc03},description:[{text:'Extra max active servants',color:0x45fc03}]}
}


//Enemy types but not magic types: Bug, fairy, ground, flying
//Magic types but not enemy types: Summoning
let levels = {
    universal:{mainQuestReqired:0,costMultiplier:1.2,name:{text:'Universal',color:0x45fc03},icon:'minecraft:white_concrete',description:[{text:'A general level. Everything that gives you xp for other levels, also gives them for this',color:0x45fc03}],milestones:[
        {level:2,type:'stat',id:'meleExtraDamage',amount:1,icon:'minecraft:white_concrete',iconCompleted:'minecraft:white_concrete'},
        {level:3,type:'text',name:{text:'Unlock',color:0x45fc03},description:[{text:'You unlock whatever',color:0x45fc03}],icon:'minecraft:red_concrete',iconCompleted:'minecraft:green_concrete'},
        {level:4,type:'currency',id:'skill_points',amount:1,icon:'minecraft:red_concrete',iconCompleted:'minecraft:green_concrete'}
    ]},
    heavyMeleCombat:{mainQuestReqired:0,costMultiplier:1.2,name:{text:'Heavy mele combat',color:0x45fc03},icon:'minecraft:diamond_axe',description:[{text:'Fighting with heavy weapons',color:0x45fc03}]},
    lightMeleCombat:{mainQuestReqired:0,costMultiplier:1.2,name:{text:'Light mele combat',color:0x45fc03},icon:'minecraft:diamond_sword',description:[{text:'Fighting with light weapons',color:0x45fc03}]},
    defense:{mainQuestReqired:0,costMultiplier:1.2,name:{text:'Defense',color:0x45fc03},icon:'minecraft:shield',description:[{text:'Blocking damage',color:0x45fc03}]},
    rangedCombat:{mainQuestReqired:1,costMultiplier:1.2,name:{text:'Ranged combat',color:0x45fc03},icon:'minecraft:bow',description:[{text:'Fighting with ranged weapons',color:0x45fc03}]},
    neutralMagic:{mainQuestReqired:2,costMultiplier:1.2,name:{text:'Neutral magic',color:0x45fc03},icon:'minecraft:gray_concrete',description:[{text:'Using neutral magic',color:0x45fc03}]},
    earthMagic:{mainQuestReqired:2,costMultiplier:1.2,name:{text:'Earth magic',color:0x45fc03},icon:'minecraft:dirt',description:[{text:'Using earth magic',color:0x45fc03}]},
    airMagic:{mainQuestReqired:2,costMultiplier:1.2,name:{text:'Air magic',color:0x45fc03},icon:'minecraft:white_concrete',description:[{text:'Using air magic',color:0x45fc03}]},
    fireMagic:{mainQuestReqired:2,costMultiplier:1.2,name:{text:'Fire magic',color:0x45fc03},icon:'minecraft:fire_charge',description:[{text:'Using fire magic',color:0x45fc03}]},
    waterMagic:{mainQuestReqired:2,costMultiplier:1.2,name:{text:'Water magic',color:0x45fc03},icon:'minecraft:water_bucket',description:[{text:'Using water magic',color:0x45fc03}]},
    lightningMagic:{mainQuestReqired:2,costMultiplier:1.2,name:{text:'Lightening magic',color:0x45fc03},icon:'minecraft:lightning_rod',description:[{text:'Using lightening magic',color:0x45fc03}]},
    iceMagic:{mainQuestReqired:2,costMultiplier:1.2,name:{text:'Ice magic',color:0x45fc03},icon:'minecraft:ice',description:[{text:'Using ice magic',color:0x45fc03}]},
    natureMagic:{mainQuestReqired:2,costMultiplier:1.2,name:{text:'Nature magic',color:0x45fc03},icon:'minecraft:oak_sapling',description:[{text:'Using nature magic',color:0x45fc03}]},
    darkMagic:{mainQuestReqired:2,costMultiplier:1.2,name:{text:'Dark magic',color:0x45fc03},icon:'minecraft:black_terracotta',description:[{text:'Using dark magic',color:0x45fc03}]},
    lightMagic:{mainQuestReqired:2,costMultiplier:1.2,name:{text:'Light magic',color:0x45fc03},icon:'minecraft:white_terracotta',description:[{text:'Using light magic',color:0x45fc03}]},
    summoningMagic:{mainQuestReqired:2,costMultiplier:1.2,name:{text:'Summoning magic',color:0x45fc03},icon:'minecraft:zombie_spawn_egg',description:[{text:'Using summoning magic',color:0x45fc03}]},
    celestialMagic:{mainQuestReqired:2,costMultiplier:1.2,name:{text:'Celestial magic',color:0x45fc03},icon:'minecraft:yellow_terracotta',description:[{text:'Using celestial magic',color:0x45fc03}]},
    voidMagic:{mainQuestReqired:2,costMultiplier:1.2,name:{text:'Void magic',color:0x45fc03},icon:'minecraft:black_concrete',description:[{text:'Using void magic',color:0x45fc03}]},
    necromancyMagic:{mainQuestReqired:2,costMultiplier:1.2,name:{text:'Necromancy magic',color:0x45fc03},icon:'minecraft:skeleton_skull',description:[{text:'Using necromancy magic',color:0x45fc03}]},
    dragonMagic:{mainQuestReqired:2,costMultiplier:1.2,name:{text:'Dragon magic',color:0x45fc03},icon:'minecraft:dragon_head',description:[{text:'Using dragon magic',color:0x45fc03}]},
    ghostMagic:{mainQuestReqired:2,costMultiplier:1.2,name:{text:'Ghost magic',color:0x45fc03},icon:'minecraft:gray_terracotta',description:[{text:'Using ghost magic',color:0x45fc03}]},
    poisonMagic:{mainQuestReqired:2,costMultiplier:1.2,name:{text:'Poison magic',color:0x45fc03},icon:'minecraft:poisonous_potato',description:[{text:'Using poison magic',color:0x45fc03}]},
    psycicMagic:{mainQuestReqired:2,costMultiplier:1.2,name:{text:'Psycic magic',color:0x45fc03},icon:'minecraft:purple_concrete',description:[{text:'Using psycic magic',color:0x45fc03}]},
    steelMagic:{mainQuestReqired:2,costMultiplier:1.2,name:{text:'Steel magic',color:0x45fc03},icon:'minecraft:iron_ingot',description:[{text:'Using steel magic',color:0x45fc03}]},
    illusionMagic:{mainQuestReqired:2,costMultiplier:1.2,name:{text:'Illusion magic',color:0x45fc03},icon:'minecraft:orange_concrete',description:[{text:'Using illusion magic',color:0x45fc03}]},
    enchantmentMagic:{mainQuestReqired:2,costMultiplier:1.2,name:{text:'Enchantment magic',color:0x45fc03},icon:'minecraft:enchanted_book',description:[{text:'Using enchantment magic',color:0x45fc03}]},
    transmutationMagic:{mainQuestReqired:2,costMultiplier:1.2,name:{text:'Transmutation magic',color:0x45fc03},icon:'minecraft:yellow_concrete',description:[{text:'Using transmutation magic',color:0x45fc03}]},
    gravityMagic:{mainQuestReqired:2,costMultiplier:1.2,name:{text:'Gravity magic',color:0x45fc03},icon:'minecraft:pink_concrete',description:[{text:'Using gravity magic',color:0x45fc03}]},
    timeMagic:{mainQuestReqired:2,costMultiplier:1.2,name:{text:'Time magic',color:0x45fc03},icon:'minecraft:sand',description:[{text:'Using time magic',color:0x45fc03}]},
    defenseMagic:{mainQuestReqired:2,costMultiplier:1.2,name:{text:'Defense magic',color:0x45fc03},icon:'minecraft:shield',description:[{text:'Using defense magic',color:0x45fc03}]},
    alchemy:{mainQuestReqired:3,costMultiplier:1.2,name:{text:'Alchemy',color:0x45fc03},icon:'minecraft:potion',description:[{text:'Brewing and consuming potions',color:0x45fc03}]},
    pets:{mainQuestReqired:4,costMultiplier:1.2,name:{text:'Pets',color:0x45fc03},icon:'minecraft:bone',description:[{text:'Everything that has to do with pets',color:0x45fc03}]},
    building:{mainQuestReqired:5,costMultiplier:1.2,name:{text:'Building',color:0x45fc03},icon:'minecraft:stone_bricks',description:[{text:'Building your base',color:0x45fc03}]},
    trading:{mainQuestReqired:6,costMultiplier:1.2,name:{text:'Trading',color:0x45fc03},icon:'minecraft:emerald',description:[{text:'Trading with npcs and buying stuff from them',color:0x45fc03}]},
    exploration:{mainQuestReqired:7,costMultiplier:1.2,name:{text:'Exploration',color:0x45fc03},icon:'minecraft:compass',description:[{text:'Exploring the world',color:0x45fc03}]},
    crafting:{mainQuestReqired:15,costMultiplier:1.2,name:{text:'Crafting',color:0x45fc03},icon:'minecraft:crafting_table',description:[{text:'Crafting different items',color:0x45fc03}]},
    smithing:{mainQuestReqired:14,costMultiplier:1.2,name:{text:'Smithing',color:0x45fc03},icon:'minecraft:smithing_table',description:[{text:'Modifying items to make them stronger',color:0x45fc03}]},
    smelting:{mainQuestReqired:13,costMultiplier:1.2,name:{text:'Smelting',color:0x45fc03},icon:'minecraft:furnace',description:[{text:'Smelting an processing ores',color:0x45fc03}]},
    fletching:{mainQuestReqired:12,costMultiplier:1.2,name:{text:'Fletching',color:0x45fc03},icon:'minecraft:fletching_table',description:[{text:'Crafting powerful ammunition for your ranged weapons',color:0x45fc03}]},
    enchanting:{mainQuestReqired:11,costMultiplier:1.2,name:{text:'Enchanting',color:0x45fc03},icon:'minecraft:enchanting_table',description:[{text:'Enchanting your items',color:0x45fc03}]},
    gathering:{mainQuestReqired:10,costMultiplier:1.2,name:{text:'Gathering',color:0x45fc03},icon:'minecraft:sweet_berries',description:[{text:'Gathering rare items',color:0x45fc03}]},
    mining:{mainQuestReqired:9,costMultiplier:1.2,name:{text:'Mining',color:0x45fc03},icon:'minecraft:diamond_pickaxe',description:[{text:'Mining in the caves',color:0x45fc03}]},
    farming:{mainQuestReqired:8,costMultiplier:1.2,name:{text:'Farming',color:0x45fc03},icon:'minecraft:diamond_hoe',description:[{text:'Farming crops',color:0x45fc03}]}
}


let rarities = {
    common: { icon: '\uE059' },
    uncommon: { icon: '\uE060' },
    rare: { icon: '\uE061' },
    super_rare: { icon: '\uE062' },
    epic: { icon: '\uE063' },
    supreme: { icon: '\uE064' },
    legendary: { icon: '\uE065' },
    exotic: { icon: '\uE066' },
    mythic: { icon: '\uE067' },
    godly: { icon: '\uE068' },
    eternal: { icon: '\uE069' },
    divine: { icon: '\uE070' },
    celestial: { icon: '\uE071' },
    cosmic: { icon: '\uE072' },
    eldritch: { icon: '\uE073' },
    infinity: { icon: '\uE074' }
}


let types = {
    transmutation: {icon: '\uE030',transmutation: 0.25,gravity: 2,time: 0.5,illusion: 0.125,steel: 4,psycic: 0.5,poison: 1,ghost: 0.5,dragon: 4,necromancy: 1.5,void: 0.5,celestial: 2,summoning: 1,light: 1,dark: 0.25,nature: 2,ice: 0.125,lightning: 0.25,water: 0.5,fire: 1,air: 3,earth: 1,neutral: 2,defense: 0.5,bug: 0.25,fairy: 1,ground: 2,flying: 2,enchantment: 1},
    gravity: {icon: '\uE031',transmutation: 0.5,gravity: 0.25,time: 0.125,illusion: 2,steel: 0.5,psycic: 1,poison: 1,ghost: 1,dragon: 2,necromancy: 1.5,void: 1,celestial: 1,summoning: 1,light: 0.25,dark: 2,nature: 2,ice: 1.5,lightning: 1,water: 1,fire: 1.5,air: 2,earth: 0.5,neutral: 1,defense: 2,bug: 1.5,fairy: 4,ground: 1.5,flying: 1.5,enchantment: 1.5},
    time: {icon: '\uE032',transmutation: 1,gravity: 0.5,time: 0.25,illusion: 1,steel: 0.5,psycic: 2,poison: 1.5,ghost: 0.25,dragon: 3,necromancy: 0.5,void: 0.125,celestial: 0.5,summoning: 3,light: 0.5,dark: 3,nature: 0.5,ice: 1.5,lightning: 1.5,water: 1.5,fire: 0.5,air: 0.5,earth: 1,neutral: 0.25,defense: 1.5,bug: 0.125,fairy: 0.5,ground: 0.25,flying: 2,enchantment: 2},
    illusion: {icon: '\uE033',transmutation: 1.5,gravity: 4,time: 1.5,illusion: 0.25,steel: 3,psycic: 1,poison: 0.125,ghost: 1.5,dragon: 1,necromancy: 2,void: 0.5,celestial: 1,summoning: 1,light: 0.125,dark: 0.25,nature: 1,ice: 0.25,lightning: 3,water: 0.25,fire: 0.25,air: 1,earth: 1,neutral: 1.5,defense: 1,bug: 2,fairy: 4,ground: 3,flying: 1.5,enchantment: 1.5},
    steel: {icon: '\uE034',transmutation: 1,gravity: 2,time: 3,illusion: 0.25,steel: 0.25,psycic: 4,poison: 1.5,ghost: 1.5,dragon: 4,necromancy: 1.5,void: 2,celestial: 1,summoning: 1.5,light: 0.125,dark: 1.5,nature: 0.125,ice: 1.5,lightning: 1,water: 0.5,fire: 0.5,air: 1,earth: 0.25,neutral: 1,defense: 0.5,bug: 0.25,fairy: 1,ground: 0.5,flying: 0.5,enchantment: 3},
    psycic: {icon: '\uE035',transmutation: 0.5,gravity: 4,time: 0.5,illusion: 0.5,steel: 0.25,psycic: 0.25,poison: 1,ghost: 1.5,dragon: 1,necromancy: 4,void: 1,celestial: 2,summoning: 2,light: 0.25,dark: 1,nature: 1,ice: 0.5,lightning: 3,water: 0.125,fire: 2,air: 3,earth: 4,neutral: 1.5,defense: 1.5,bug: 0.5,fairy: 1,ground: 1.5,flying: 2,enchantment: 1},
    poison: {icon: '\uE036',transmutation: 1,gravity: 0.5,time: 1,illusion: 0.125,steel: 3,psycic: 1.5,poison: 0.25,ghost: 4,dragon: 1,necromancy: 3,void: 0.5,celestial: 0.5,summoning: 1,light: 4,dark: 1,nature: 1,ice: 1,lightning: 1.5,water: 0.5,fire: 3,air: 1,earth: 0.25,neutral: 0.5,defense: 0.5,bug: 0.125,fairy: 1.5,ground: 3,flying: 1,enchantment: 2},
    ghost: {icon: '\uE037',transmutation: 1,gravity: 0.5,time: 4,illusion: 1,steel: 0.125,psycic: 2,poison: 1.5,ghost: 0.25,dragon: 1,necromancy: 0.5,void: 1.5,celestial: 0.5,summoning: 0.5,light: 0.5,dark: 0.125,nature: 1,ice: 0.125,lightning: 1,water: 1.5,fire: 1,air: 0.5,earth: 1.5,neutral: 3,defense: 1,bug: 0.25,fairy: 0.25,ground: 1.5,flying: 0.5,enchantment: 1.5},
    dragon: {icon: '\uE038',transmutation: 0.5,gravity: 2,time: 1,illusion: 0.25,steel: 0.5,psycic: 1.5,poison: 1,ghost: 1.5,dragon: 0.25,necromancy: 0.5,void: 2,celestial: 0.25,summoning: 0.5,light: 3,dark: 1,nature: 1,ice: 1,lightning: 4,water: 1,fire: 1,air: 1,earth: 0.5,neutral: 3,defense: 1,bug: 2,fairy: 0.5,ground: 3,flying: 2,enchantment: 1.5},
    necromancy: {icon: '\uE039',transmutation: 0.25,gravity: 0.5,time: 1,illusion: 0.25,steel: 1,psycic: 0.25,poison: 1,ghost: 1.5,dragon: 1.5,necromancy: 0.25,void: 1,celestial: 4,summoning: 3,light: 1,dark: 1,nature: 1,ice: 0.25,lightning: 3,water: 1.5,fire: 3,air: 1,earth: 1,neutral: 3,defense: 1,bug: 0.5,fairy: 1.5,ground: 2,flying: 0.125,enchantment: 1},
    void: {icon: '\uE040',transmutation: 3,gravity: 3,time: 1.5,illusion: 4,steel: 3,psycic: 2,poison: 2,ghost: 0.25,dragon: 0.5,necromancy: 0.5,void: 0.25,celestial: 1.5,summoning: 2,light: 1,dark: 3,nature: 1,ice: 0.25,lightning: 0.125,water: 0.5,fire: 0.5,air: 1,earth: 1,neutral: 4,defense: 1,bug: 0.25,fairy: 1.5,ground: 1,flying: 1,enchantment: 1.5},
    celestial: {icon: '\uE041',transmutation: 4,gravity: 0.125,time: 1.5,illusion: 2,steel: 1.5,psycic: 3,poison: 1,ghost: 3,dragon: 1,necromancy: 1,void: 1,celestial: 0.25,summoning: 1.5,light: 0.125,dark: 0.25,nature: 0.25,ice: 0.5,lightning: 1.5,water: 1,fire: 3,air: 3,earth: 4,neutral: 2,defense: 1,bug: 0.5,fairy: 0.125,ground: 1,flying: 0.5,enchantment: 0.25},
    summoning: {icon: '\uE042',transmutation: 1,gravity: 0.25,time: 0.25,illusion: 0.5,steel: 0.25,psycic: 1,poison: 2,ghost: 1,dragon: 2,necromancy: 4,void: 1.5,celestial: 0.5,summoning: 0.25,light: 1,dark: 1,nature: 1,ice: 3,lightning: 1,water: 2,fire: 1,air: 2,earth: 3,neutral: 3,defense: 1.5,bug: 1.5,fairy: 2,ground: 1,flying: 1,enchantment: 4},
    light: {icon: '\uE043',transmutation: 3,gravity: 4,time: 1.5,illusion: 1.5,steel: 0.5,psycic: 1,poison: 3,ghost: 2,dragon: 3,necromancy: 1,void: 1.5,celestial: 2,summoning: 1,light: 0.25,dark: 2,nature: 0.125,ice: 1,lightning: 0.125,water: 1.5,fire: 1,air: 4,earth: 2,neutral: 1,defense: 2,bug: 0.5,fairy: 1,ground: 0.25,flying: 0.5,enchantment: 1},
    dark: {icon: '\uE044',transmutation: 1,gravity: 3,time: 1.5,illusion: 1,steel: 2,psycic: 0.5,poison: 1.5,ghost: 1,dragon: 1,necromancy: 0.125,void: 2,celestial: 1,summoning: 0.5,light: 4,dark: 0.25,nature: 4,ice: 4,lightning: 0.5,water: 2,fire: 4,air: 1,earth: 1,neutral: 1.5,defense: 0.5,bug: 1,fairy: 0.5,ground: 1,flying: 1.5,enchantment: 3},
    nature: {icon: '\uE045',transmutation: 1,gravity: 2,time: 1,illusion: 2,steel: 1,psycic: 1.5,poison: 1,ghost: 1,dragon: 3,necromancy: 4,void: 1,celestial: 2,summoning: 0.125,light: 1,dark: 1.5,nature: 0.25,ice: 1,lightning: 3,water: 3,fire: 0.5,air: 1,earth: 1,neutral: 2,defense: 2,bug: 2,fairy: 0.125,ground: 1.5,flying: 2,enchantment: 1},
    ice: {icon: '\uE046',transmutation: 2,gravity: 1,time: 0.25,illusion: 1,steel: 4,psycic: 2,poison: 1.5,ghost: 2,dragon: 1.5,necromancy: 1,void: 2,celestial: 0.5,summoning: 1,light: 1,dark: 1,nature: 0.25,ice: 0.25,lightning: 2,water: 2,fire: 1,air: 1,earth: 3,neutral: 0.5,defense: 0.5,bug: 2,fairy: 1.5,ground: 1,flying: 1.5,enchantment: 0.5},
    lightning: {icon: '\uE047',transmutation: 1,gravity: 1.5,time: 1,illusion: 0.25,steel: 1,psycic: 1.5,poison: 1,ghost: 0.5,dragon: 0.5,necromancy: 4,void: 0.5,celestial: 1.5,summoning: 0.5,light: 0.25,dark: 3,nature: 1,ice: 1,lightning: 0.25,water: 0.25,fire: 1.5,air: 0.5,earth: 0.25,neutral: 0.5,defense: 0.5,bug: 1,fairy: 0.25,ground: 2,flying: 1,enchantment: 1},
    water: {icon: '\uE048',transmutation: 4,gravity: 3,time: 3,illusion: 1.5,steel: 1,psycic: 0.25,poison: 1.5,ghost: 1,dragon: 0.5,necromancy: 2,void: 1.5,celestial: 2,summoning: 2,light: 3,dark: 1.5,nature: 1,ice: 1.5,lightning: 0.5,water: 0.25,fire: 0.5,air: 0.5,earth: 3,neutral: 2,defense: 0.25,bug: 0.25,fairy: 0.25,ground: 1,flying: 2,enchantment: 1},
    fire: {icon: '\uE049',transmutation: 2,gravity: 1.5,time: 0.25,illusion: 1,steel: 3,psycic: 1,poison: 4,ghost: 1,dragon: 3,necromancy: 0.25,void: 1,celestial: 0.5,summoning: 1.5,light: 1.5,dark: 3,nature: 0.5,ice: 1,lightning: 1,water: 0.5,fire: 0.25,air: 0.25,earth: 1,neutral: 1,defense: 3,bug: 1,fairy: 0.5,ground: 1,flying: 3,enchantment: 2},
    air: {icon: '\uE050',transmutation: 1,gravity: 0.125,time: 0.5,illusion: 0.5,steel: 1,psycic: 1,poison: 0.5,ghost: 2,dragon: 0.25,necromancy: 1.5,void: 1,celestial: 1.5,summoning: 2,light: 0.5,dark: 1,nature: 1,ice: 1,lightning: 1.5,water: 2,fire: 1,air: 0.25,earth: 0.25,neutral: 1.5,defense: 0.5,bug: 0.5,fairy: 1,ground: 1,flying: 0.5,enchantment: 3},
    earth: {icon: '\uE051',transmutation: 1,gravity: 1,time: 4,illusion: 4,steel: 1,psycic: 1,poison: 1,ghost: 0.5,dragon: 2,necromancy: 1,void: 1,celestial: 3,summoning: 1,light: 1,dark: 1.5,nature: 1.5,ice: 1.5,lightning: 2,water: 4,fire: 2,air: 1.5,earth: 0.25,neutral: 1,defense: 0.25,bug: 1,fairy: 1,ground: 0.25,flying: 1,enchantment: 3},
    neutral: {icon: '\uE052',transmutation: 0.5,gravity: 0.5,time: 0.125,illusion: 0.25,steel: 0.25,psycic: 0.125,poison: 0.5,ghost: 0.5,dragon: 0.5,necromancy: 0.5,void: 1,celestial: 0.5,summoning: 3,light: 0.5,dark: 1,nature: 0.25,ice: 1,lightning: 4,water: 0.125,fire: 4,air: 2,earth: 1,neutral: 0.25,defense: 0.5,bug: 2,fairy: 1.5,ground: 2,flying: 2,enchantment: 1.5},
    defense: {icon: '\uE053',transmutation: 0.5,gravity: 1,time: 2,illusion: 3,steel: 0.5,psycic: 2,poison: 3,ghost: 3,dragon: 0.5,necromancy: 3,void: 1,celestial: 1,summoning: 1.5,light: 3,dark: 1,nature: 1,ice: 3,lightning: 0.5,water: 3,fire: 4,air: 2,earth: 1.5,neutral: 0.125,defense: 0.25,bug: 1,fairy: 1,ground: 0.25,flying: 0.5,enchantment: 1},
    bug: {icon: '\uE054',transmutation: 1,gravity: 1.5,time: 1,illusion: 1,steel: 0.5,psycic: 0.5,poison: 0.5,ghost: 0.25,dragon: 1,necromancy: 0.5,void: 1,celestial: 0.5,summoning: 0.5,light: 1,dark: 1.5,nature: 0.5,ice: 1.5,lightning: 0.5,water: 0.5,fire: 0.5,air: 1.5,earth: 0.25,neutral: 0.5,defense: 1,bug: 0.25,fairy: 1,ground: 3,flying: 1.5,enchantment: 1},
    fairy: {icon: '\uE055',transmutation: 4,gravity: 0.25,time: 0.5,illusion: 1,steel: 1,psycic: 0.25,poison: 1,ghost: 1,dragon: 0.25,necromancy: 1.5,void: 0.25,celestial: 0.125,summoning: 2,light: 2,dark: 4,nature: 1.5,ice: 2,lightning: 2,water: 0.5,fire: 1,air: 2,earth: 0.5,neutral: 1,defense: 1.5,bug: 1.5,fairy: 0.25,ground: 1.5,flying: 1.5,enchantment: 0.125},
    ground: {icon: '\uE056',transmutation: 1,gravity: 1.5,time: 1,illusion: 3,steel: 3,psycic: 0.5,poison: 0.25,ghost: 4,dragon: 2,necromancy: 3,void: 3,celestial: 2,summoning: 1.5,light: 0.5,dark: 1,nature: 1,ice: 1.5,lightning: 0.5,water: 0.5,fire: 1,air: 0.25,earth: 1,neutral: 0.25,defense: 0.125,bug: 1.5,fairy: 1,ground: 0.25,flying: 0.25,enchantment: 3},
    flying: {icon: '\uE057',transmutation: 0.125,gravity: 0.25,time: 0.5,illusion: 0.25,steel: 0.5,psycic: 1,poison: 0.25,ghost: 1,dragon: 2,necromancy: 2,void: 1.5,celestial: 1.5,summoning: 1,light: 2,dark: 1.5,nature: 0.25,ice: 4,lightning: 1,water: 0.25,fire: 1,air: 1,earth: 3,neutral: 0.125,defense: 0.5,bug: 1,fairy: 3,ground: 2,flying: 0.25,enchantment: 0.25},
    enchantment: {icon: '\uE058',transmutation: 1,gravity: 1,time: 2,illusion: 1,steel: 1.5,psycic: 1.5,poison: 3,ghost: 1.5,dragon: 1,necromancy: 0.125,void: 3,celestial: 1,summoning: 4,light: 0.125,dark: 2,nature: 1,ice: 1,lightning: 0.5,water: 1.5,fire: 3,air: 1,earth: 0.5,neutral: 1,defense: 0.5,bug: 1,fairy: 2,ground: 0.5,flying: 0.25,enchantment: 0.25}
}


let currencies = {
    coins:{name:{text:'\uE025 Coins',color:0xede90c},type:'currency',requirementType:'storyProgress',requirementAmount:0},
    diamonds:{name:{text:'\uE026 Diamonds',color:0x130ced},type:'currency',requirementType:'storyProgress',requirementAmount:5},
    skill_points:{name:{text:'\uE025 Skill points',color:0x03fcfc},type:'skillPoint',requirementType:'storyProgress',requirementAmount:0},
    evolution_points:{name:{text:'\uE025 Evolution points',color:0x4efc03},type:'skillPoint',requirementType:'storyProgress',requirementAmount:0},
}


let shopOffers = {
    main_timeline1:{
        items:[
            {currency:'coins',price:5,id:'minecraft:stone',amount:3,name:{text:'Stone',color:0x550000},tooltip:[{text:'Test',color:0x550000},{text:'Test',color:0x550000}],type:'basic'},
            {currency:'coins',price:2,id:'minecraft:stone',amount:1,name:{text:'Stone',color:0x550000},tooltip:[{text:'Test',color:0x550000},{text:'Test',color:0x550000}],type:'restocking',stock:2,timer:1,unit:'m'},
            {currency:'coins',price:1,id:'minecraft:stone',amount:32,name:{text:'Stone',color:0x550000},tooltip:[{text:'Test',color:0x550000},{text:'Test',color:0x550000}],type:'limited_stock',stock:5}
        ],
        upgrades:[]
    }
}


let testChatData = {npcName:{text:'Random npc',color:0x00FFFF},sentences:[
    {npc:[{text:'line1',color:0xFFFFFF},{text:'line2',color:0xFFFFFF}],answers:[
        {lines:[{text:'Close',color:0xFFFFFF},{text:'line2',color:0xFFFFFF}],result:'close'},
        {lines:[{text:'Set sentence',color:0xFFFFFF},{text:'line2',color:0xFFFFFF}],result:'setSentence',sentence:1},
        {lines:[{text:'Give quest',color:0xFFFFFF},{text:'close',color:0xFFFFFF}],result:'giveQuest',mode:'close',quest:{
            progress:0,steps:[
                {task:{type:'kill_mobs',amount:5,progress:0,id:'minecraft:zombie',name:'zombies'},icon:'minecraft:diamond',iconCompleted:'minecraft:green_concrete',name:{text:'Step1',color:0x39ed07},description:[{text:'test',color:0xed0707}]}
            ],type:'story_quest',icon:'minecraft:diamond',name:{text:'Story quest 1',color:0x437a1d},description:[{text:'test',color:0xed0707}]}
        },
        {lines:[{text:'Give quest',color:0xFFFFFF},{text:'setSentence',color:0xFFFFFF}],result:'giveQuest',sentence:1,mode:'setSentence',quest:{
            progress:0,steps:[
                {task:{type:'kill_mobs',amount:5,progress:0,id:'minecraft:zombie',name:'zombies'},icon:'minecraft:diamond',iconCompleted:'minecraft:green_concrete',name:{text:'Step1',color:0x39ed07},description:[{text:'test',color:0xed0707}]}
            ],type:'story_quest',icon:'minecraft:diamond',name:{text:'Story quest 1',color:0x437a1d},description:[{text:'test',color:0xed0707}]}
        }
    ]},
    {npc:[{text:'2. sentence',color:0xFFFFFF},{text:'line2',color:0xFFFFFF}],answers:[
        {lines:[{text:'Close',color:0xFFFFFF},{text:'line2',color:0xFFFFFF}],result:'close'}
    ]}
]}


let cutscenes = {
    test1:{progress:0,x:0,y:0,z:0,dimension:'fantasy_craft:void_dimension',steps:[
        {timer:0,type:'spawnNpc',relX:2,relY:0,relZ:0,id:'kubejs:npc1',npc:'npc1',name:{text:'Random npc',color:0xFFFF00}},
        {timer:20,type:'moveNpc',relX:2,relY:0,relZ:0,moveRelX:2,moveRelY:0,moveRelZ:2,speed:1},
        {timer:20,progress:0,type:'openConversation',conversation:Object.assign({},testChatData)},
        {timer:20,type:'moveNpc',relX:2,relY:0,relZ:2,moveRelX:2,moveRelY:0,moveRelZ:0,speed:1},
        {timer:20,type:'killNpc',relX:2,relY:0,relZ:0},
        {timer:0,type:'endCutscene'}
    ]}
}


let classes = {
    main_timeline1:{
        //Warrior
        warrior:{x:1,y:0,requirements:[],cost:1,icon:'minecraft:red_concrete',iconOwned:'minecraft:netherite_sword',name:{text:'Warrior',color:0xFF0000},description:[{text:'A class focused on mele weapons',color:0x45fc03}],skills:{
            damage:{x:1,y:0,requirements:[],cost:1,type:'stat',id:'meleExtraDamage',amount:1,icon:'minecraft:white_concrete',iconOwned:'minecraft:white_concrete'},
            unlock:{x:1,y:1,requirements:['damage'],cost:3,type:'text',name:{text:'Unlock',color:0x45fc03},description:[{text:'You unlock whatever',color:0x45fc03}],icon:'minecraft:red_concrete',iconOwned:'minecraft:green_concrete'}
        }},
        berserker:{x:0,y:1,requirements:['warrior'],cost:3,icon:'minecraft:red_concrete',iconOwned:'minecraft:netherite_axe',name:{text:'Berserker',color:0xFF0000},description:[{text:'An evolution of the warrior, that focuses on raw force',color:0x45fc03}]},
        knight:{x:1,y:1,requirements:['warrior'],cost:3,icon:'minecraft:red_concrete',iconOwned:'minecraft:netherite_sword',name:{text:'Knight',color:0xFF0000},description:[{text:'An evolution of the warrior, that also uses armor',color:0x45fc03}]},
        gladiator:{x:2,y:1,requirements:['warrior'],cost:3,icon:'minecraft:red_concrete',iconOwned:'minecraft:shield',name:{text:'Gladiator',color:0xFF0000},description:[{text:'An evolution of the warrior, that focuses on quick movement and attacks',color:0x45fc03}]},
        //Archer
        archer:{x:4,y:0,requirements:[],cost:1,icon:'minecraft:green_concrete',iconOwned:'minecraft:bow',name:{text:'Archer',color:0x3e8022},description:[{text:'A class focused on ranged weapons',color:0x45fc03}]},
        woodWalker:{x:3,y:1,requirements:['archer'],cost:3,icon:'minecraft:green_concrete',iconOwned:'minecraft:oak_sapling',name:{text:'Wood walker',color:0x3e8022},description:[{text:'An evolution of the archer, that lives with the forrest',color:0x45fc03}]},
        sniper:{x:4,y:1,requirements:['archer'],cost:3,icon:'minecraft:green_concrete',iconOwned:'minecraft:arrow',name:{text:'Sniper',color:0x3e8022},description:[{text:'An evolution of the archer, that focuses on hitting the target',color:0x45fc03}]},
        hunter:{x:5,y:1,requirements:['archer'],cost:3,icon:'minecraft:green_concrete',iconOwned:'minecraft:bow',name:{text:'Hunter',color:0x3e8022},description:[{text:'An evolution of the archer, that focuses on the use of poisons',color:0x45fc03}]},
        //Mage
        mage:{x:7,y:0,requirements:[],cost:1,icon:'minecraft:purple_concrete',iconOwned:'minecraft:amethyst_shard',name:{text:'Mage',color:0x9512c4},description:[{text:'A class focused on using magic',color:0x45fc03}]},
        elementalist:{x:6,y:1,requirements:['mage'],cost:3,icon:'minecraft:purple_concrete',iconOwned:'minecraft:fire_charge',name:{text:'Elementalist',color:0x9512c4},description:[{text:'An evolution of the mage, that focuses on elemental magic',color:0x45fc03}]},
        wizard:{x:7,y:1,requirements:['mage'],cost:3,icon:'minecraft:purple_concrete',iconOwned:'minecraft:diamond',name:{text:'Wizard',color:0x9512c4},description:[{text:'An evolution of the mage, that focuses on deppening its knowlege of magic',color:0x45fc03}]},
        summoner:{x:8,y:1,requirements:['mage'],cost:3,icon:'minecraft:purple_concrete',iconOwned:'minecraft:skeleton_skull',name:{text:'Summoner',color:0x9512c4},description:[{text:'An evolution of the mage, that focuses on summoning allys',color:0x45fc03}]}
        }
    }


let achivements = {
    main_timeline1:{
        slayer:{
            icon:'minecraft:wooden_sword',iconCompleted:'minecraft:iron_sword',name:{text:'Slayer',color:0x9512c4},description:[{text:'Killing enemies',color:0x45fc03}],achivements:[
                {task:{type:'kill_mobs',amount:5,id:'minecraft:husk',name:'husks'},icon:'minecraft:diamond',iconCompleted:'minecraft:green_concrete',name:{text:'Husks',color:0x39ed07},description:[{text:'test',color:0xed0707}]},
                {task:{type:'kill_mobs',amount:5,id:'minecraft:zombie',name:'zombies'},icon:'minecraft:diamond',iconCompleted:'minecraft:green_concrete',name:{text:'Zombies',color:0x39ed07},description:[{text:'test',color:0xed0707}]}
            ]
        },
        leveler:{
            icon:'minecraft:iron_ingot',iconCompleted:'minecraft:diamond',name:{text:'Leveler',color:0x9512c4},description:[{text:'Leveling up',color:0x45fc03}],achivements:[
                {task:{type:'reach_level',amount:5,id:'lightMeleCombat'},icon:'minecraft:paper',iconCompleted:'minecraft:green_concrete',name:{text:'Light mele combat',color:0x39ed07},description:[{text:'test',color:0xed0707}]}
            ]
        }
    }
}


let circles = {
    spawn: { x: 0, y: 0.05, z: 0, radius: 13, points: 100, dimension: 'fantasy_craft:void_dimension', particle:'minecraft:happy_villager', displayed: false }
}


let spheres = {
    //spawn: { x: 0, y: 0.05, z: 0, radius: 13, points: 100, verticalPoints:100, dimension: 'fantasy_craft:void_dimension', particle:'minecraft:happy_villager' displayed: true },
    //spark: { x: 0, y: 5, z: 0, radius: 0.5, points: 10, verticalPoints:20, dimension: 'fantasy_craft:void_dimension', particle:'minecraft:happy_villager', displayed: true }
}


let teleportationPoints = {
    main_timeline1:{
        spawn:{x:0,y:0,z:0,dim:'fantasy_craft:void_dimension',icon:'minecraft:emerald_block',name:{text:'Spawn',color:0x39ed07}},
        house:{x:-5,y:0,z:50,dim:'fantasy_craft:void_dimension',icon:'minecraft:oak_planks',name:{text:'House',color:0x39ed07}}
    }
}


let effects = {
    poison:{id:'minecraft:poison',name:{text:'Poison',color:0x39ed07}},
    weakness:{id:'minecraft:weakness',name:{text:'Weakness',color:0x737373}}
}


let rifts = {
    main_timeline1:{name:{text:'Main',color:0x39ed07}}
}


let enemySpawns = [
    //{type:'circle',x:0,y:0,z:0,radius:10,dimension:'fantasy_craft:void_dimension1',spawnRadius:20,maxEnemies:10,cooldown:0,maxCooldown:40,entities:[{id:'minecraft:zombie',maxHp:200,armor:0,name:Text.green('test'),damage:1,types:['air']}]},
    //{type:'rectangle',x1:10,y1:0,z1:10,x2:-10,y2:0,z2:-10,dimension:'fantasy_craft:void_dimension1',spawnRadius:20,maxEnemies:10,cooldown:0,maxCooldown:40,entities:[{id:'minecraft:zombie',maxHp:200,armor:0,name:Text.green('test'),damage:1,types:['air']}]}
]


