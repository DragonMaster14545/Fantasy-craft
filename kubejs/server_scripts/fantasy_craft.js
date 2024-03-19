PlayerEvents.loggedIn(e => {
    let player = e.player
    setUpServer(e)
    setUpPlayer(e,player)
})
ServerEvents.tick(e => {
    serverTimerTick(e)
    projectileTick(e)
    e.server.players.forEach(player => {
        playerTick(e,player)
    })
})
function playerTick(e,player) {
    let playerData = e.server.persistentData.playerData[player.stringUuid]
    if(playerData.servants.length >= 1) {
        servantTick(e,player)
    }
    if(playerData.cutscene) {
        if(playerData.cutscene.steps) {
            cutsceneTick(e,player)
        }
    }
    // TODO Move to gui
    if(player.persistentData.maxMana) {
        player.sendSystemMessage(Text.blue(`Mana: ${player.persistentData.mana} / ${player.persistentData.maxMana}`),true)
    }
    if(player.persistentData.manaRegenCooldown >= player.persistentData.manaCooldown) {
        player.persistentData.manaRegenCooldown = 0
        player.persistentData.mana += player.persistentData.manaRegenRegen
        if(player.persistentData.mana > player.persistentData.maxMana) {
            player.persistentData.mana = player.persistentData.maxMana
        }
    } else {
        player.persistentData.manaRegenCooldown++
    }
    if(player.persistentData.hpRegenCooldown >= player.persistentData.hpCooldown) {
        player.persistentData.hpRegenCooldown = 0
        // TODO implement health regen
        //player.persistentData.hp += player.persistentData.hpRegenRegen
    } else {
        player.persistentData.hpRegenCooldown++
    }
}
function serverTimerTick(e) {
    let serverPersistantData = e.server.persistentData
    serverPersistantData.timer1s += 1
    if(serverPersistantData.timer1s >= 20) {
        serverPersistantData.timer1s = 0
        drawCircles(e)
        drawSpheres(e)
        stepServerTime(e)
    }
    serverPersistantData.timer10s += 1
    if(serverPersistantData.timer10s >= 20*10) {
        serverPersistantData.timer10s = 0
    }
    serverPersistantData.timer30s += 1
    if(serverPersistantData.timer30s >= 20*30) {
        serverPersistantData.timer30s = 0
    }
    serverPersistantData.timer1m += 1
    if(serverPersistantData.timer1m >= 20*60) {
        serverPersistantData.timer1m = 0
    }
    serverPersistantData.timer10m += 1
    if(serverPersistantData.timer10m >= 20*60*10) {
        serverPersistantData.timer10m = 0
    }
    serverPersistantData.timer30m += 1
    if(serverPersistantData.timer30m >= 20*60*30) {
        serverPersistantData.timer30m = 0
    }
    serverPersistantData.timer1h += 1
    if(serverPersistantData.timer1h >= 20*60*60) {
        serverPersistantData.timer1h = 0
    }
    serverPersistantData.timer2h += 1
    if(serverPersistantData.timer2h >= 20*60*60*2) {
        serverPersistantData.timer2h = 0
    }
    serverPersistantData.timer5h += 1
    if(serverPersistantData.timer5h >= 20*60*60*5) {
        serverPersistantData.timer5h = 0
    }
    serverPersistantData.timer1d += 1
    if(serverPersistantData.timer1d >= 20*60*60*24) {
        serverPersistantData.timer1d = 0
    }
}
function setUpPlayer(e,player) {
    let serverPersistantData = e.server.persistentData
    if(!serverPersistantData.playerData[player.stringUuid]) {
        serverPersistantData.playerData[player.stringUuid] = {}
    }
    let playerPersistantData = player.persistentData
    let playerSaveData = serverPersistantData.playerData[player.stringUuid]
    if(!playerPersistantData.initiated) {
    serverPersistantData.players += 1
    playerPersistantData.base = {x:serverPersistantData.players*10000,y:serverPersistantData.players*10000}
    playerPersistantData.mana = 10
    playerPersistantData.manaRegenCooldown = 0
    playerPersistantData.hpRegenCooldown = 0
    playerSaveData.quests = []
    playerSaveData.mainQuestProgress = 0
    playerSaveData.sideQuestProgress = []
    playerSaveData.itemRegister = []
    playerSaveData.shopData = {}
    playerSaveData.itemDetails = {
        nextId: 0
    }
    playerSaveData.currencies = {}
    for(let key in currencies) {
        playerSaveData.currencies[key] = 0
    }
    playerSaveData.levels = {}
    for(let key in levels) {
        playerSaveData.levels[key] = {level:1,xp:0,maxXp:10}
        if(levels[key].milestones) {
            let milestones = []
            for(let i = 0;i<levels[key].milestones.length;i++) {
                milestones[i] = {claimed:false}
            }
            playerSaveData.levels[key].milestones = milestones
        }
    }
    playerSaveData.stats = {}
    playerSaveData.classes = {}
    for(let key in classes) {
        playerSaveData.classes[key] = {owned:false}
        if(classes[key].skills) {
            let skills = {}
            for(let key2 in classes[key].skills) {
                skills[key2] = {owned:false}
            }
            playerSaveData.classes[key].skills = skills
        }
    }
    playerSaveData.achivements = {}
    for(let key in achivements) {
        playerSaveData.achivements[key] = {progress:0,completed:false}
        if(achivements[key].achivements) {
            let playerAchivements = []
            for(let i = 0;i<achivements[key].achivements.length;i++) {
                playerAchivements[i] = {completed:false,progress:0}
            }
            playerSaveData.achivements[key].achivements = playerAchivements
        }
    }
    playerSaveData.teleportationPoints = {
        unlocked:false
    }
    for(let key in teleportationPoints) {
        playerSaveData.teleportationPoints[key] = {unlocked:false}
    }
    playerSaveData.servants = []
    playerPersistantData.initiated = true
    player.teleportTo(e.server.getLevel('fantasy_craft:void_dimension'), 0, 0, 0, [], player.yaw, player.pitch)
    e.server.runCommandSilent('/execute in fantasy_craft:void_dimension run photon fx kubejs:player_spawn block 0 0 0')
    e.server.runCommandSilent(`/openguiscreen greeting_dialogue ${player.username}`)
    }
    recalculatePlayerStats(e, player)
}
function setUpServer(e) {
    let serverPersistantData = e.server.persistentData
    if(!serverPersistantData.playerData) {
        serverPersistantData.playerData = {}
    }
    if(!serverPersistantData.projectiles) {
        serverPersistantData.projectiles = []
    }
    if(!serverPersistantData.players) {
        serverPersistantData.players = 0
    }
    if(!serverPersistantData.timeS) {
        serverPersistantData.timeS = 0
    }
    if(!serverPersistantData.timeM) {
        serverPersistantData.timeM = 0
    }
    if(!serverPersistantData.timeH) {
        serverPersistantData.timeH = 0
    }
    if(!serverPersistantData.timeD) {
        serverPersistantData.timeD = 0
    }
    if(!serverPersistantData.timeY) {
        serverPersistantData.timeY = 0
    }
    if(!serverPersistantData.timer1s) {
        serverPersistantData.timer1s = 0
    }
    if(!serverPersistantData.timer10s) {
        serverPersistantData.timer10s = 0
    }
    if(!serverPersistantData.timer30s) {
        serverPersistantData.timer30s = 0
    }
    if(!serverPersistantData.timer1m) {
        serverPersistantData.timer1m = 0
    }
    if(!serverPersistantData.timer10m) {
        serverPersistantData.timer10m = 0
    }
    if(!serverPersistantData.timer30m) {
        serverPersistantData.timer30m = 0
    }
    if(!serverPersistantData.timer1h) {
        serverPersistantData.timer1h = 0
    }
    if(!serverPersistantData.timer2h) {
        serverPersistantData.timer2h = 0
    }
    if(!serverPersistantData.timer5h) {
        serverPersistantData.timer5h = 0
    }
    if(!serverPersistantData.timer1d) {
        serverPersistantData.timer1d = 0
    }
}
