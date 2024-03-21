PlayerEvents.loggedIn(e => {
    let player = e.player
    setUpServer(e)
    setUpPlayer(e, player)
})
ServerEvents.tick(e => {
    serverTimerTick(e)
    projectileTick(e)
    entitySpawnTick(e)
    e.server.players.forEach(player => {
        playerTick(e, player)
    })
})
function playerTick(e, player) {
    let playerData = e.server.persistentData.playerData[player.stringUuid]
    if (playerData.servants.length >= 1) {
        servantTick(e, player)
    }
    if (playerData.cutscene) {
        if (playerData.cutscene.steps) {
            cutsceneTick(e, player)
        }
    }
    // TODO Move to gui
    let message = Text.of('')
    if (player.persistentData.maxMana) {
        message.append(Text.blue(`Mana: ${player.persistentData.mana} / ${player.persistentData.maxMana} `))
    }
    let rayTrace = player.rayTrace().entity
    if (rayTrace != null) {
        message.append(Text.green('Entity persistent data: ' + rayTrace.persistentData + ' '))
    }
    if (message) {
        player.sendSystemMessage(message, true)
    }
    if (player.persistentData.manaRegenCooldown >= player.persistentData.manaCooldown) {
        player.persistentData.manaRegenCooldown = 0
        player.persistentData.mana += player.persistentData.manaRegenRegen
        if (player.persistentData.mana > player.persistentData.maxMana) {
            player.persistentData.mana = player.persistentData.maxMana
        }
    } else {
        player.persistentData.manaRegenCooldown++
    }
    if (player.persistentData.hpRegenCooldown >= player.persistentData.hpCooldown) {
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
    if (serverPersistantData.timer1s >= 20) {
        serverPersistantData.timer1s = 0
        drawCircles(e)
        drawSpheres(e)
        stepServerTime(e)
    }
    serverPersistantData.timer10s += 1
    if (serverPersistantData.timer10s >= 20 * 10) {
        serverPersistantData.timer10s = 0
    }
    serverPersistantData.timer30s += 1
    if (serverPersistantData.timer30s >= 20 * 30) {
        serverPersistantData.timer30s = 0
    }
    serverPersistantData.timer1m += 1
    if (serverPersistantData.timer1m >= 20 * 60) {
        serverPersistantData.timer1m = 0
    }
    serverPersistantData.timer10m += 1
    if (serverPersistantData.timer10m >= 20 * 60 * 10) {
        serverPersistantData.timer10m = 0
    }
    serverPersistantData.timer30m += 1
    if (serverPersistantData.timer30m >= 20 * 60 * 30) {
        serverPersistantData.timer30m = 0
    }
    serverPersistantData.timer1h += 1
    if (serverPersistantData.timer1h >= 20 * 60 * 60) {
        serverPersistantData.timer1h = 0
    }
    serverPersistantData.timer2h += 1
    if (serverPersistantData.timer2h >= 20 * 60 * 60 * 2) {
        serverPersistantData.timer2h = 0
    }
    serverPersistantData.timer5h += 1
    if (serverPersistantData.timer5h >= 20 * 60 * 60 * 5) {
        serverPersistantData.timer5h = 0
    }
    serverPersistantData.timer1d += 1
    if (serverPersistantData.timer1d >= 20 * 60 * 60 * 24) {
        serverPersistantData.timer1d = 0
    }
}
function setUpPlayer(e, player) {
    let serverPersistantData = e.server.persistentData
    if (!serverPersistantData.playerData[player.stringUuid]) {
        serverPersistantData.playerData[player.stringUuid] = {}
    }
    let playerPersistantData = player.persistentData
    let playerSaveData = serverPersistantData.playerData[player.stringUuid]
    if (!playerPersistantData.initiated) {
        serverPersistantData.players += 1
        playerPersistantData.base = { x: serverPersistantData.players * 10000, y: serverPersistantData.players * 10000 }
        playerPersistantData.mana = 10
        playerPersistantData.manaRegenCooldown = 0
        playerPersistantData.hpRegenCooldown = 0
        playerSaveData.itemDetails = {
            nextId: 0
        }
        for (let riftKey in rifts) {
            playerSaveData.rifts = {}
            playerSaveData.rifts[riftKey] = {}
            let riftPlayerSaveData = playerSaveData.rifts[riftKey]
            riftPlayerSaveData.quests = []
            riftPlayerSaveData.mainQuestProgress = 0
            riftPlayerSaveData.sideQuestProgress = []
            riftPlayerSaveData.shopData = {}
            riftPlayerSaveData.currencies = {}
            for (let key in currencies) {
                riftPlayerSaveData.currencies[key] = 0
            }
            riftPlayerSaveData.levels = {}
            for (let key in levels) {
                riftPlayerSaveData.levels[key] = { level: 1, xp: 0, maxXp: 10 }
                if (levels[key].milestones) {
                    let milestones = []
                    for (let i = 0; i < levels[key].milestones.length; i++) {
                        milestones[i] = { claimed: false }
                    }
                    riftPlayerSaveData.levels[key].milestones = milestones
                }
            }
            riftPlayerSaveData.stats = {}
            riftPlayerSaveData.classes = {}
            for (let key in classes[riftKey]) {
                riftPlayerSaveData.classes[key] = { owned: false }
                if (classes[riftKey][key].skills) {
                    let skills = {}
                    for (let key2 in classes[riftKey][key].skills) {
                        skills[key2] = { owned: false }
                    }
                    riftPlayerSaveData.classes[key].skills = skills
                }
            }
            riftPlayerSaveData.achivements = {}
            for (let key in achivements[riftKey]) {
                riftPlayerSaveData.achivements[key] = { progress: 0, completed: false }
                if (achivements[riftKey][key].achivements) {
                    let playerAchivements = []
                    for (let i = 0; i < achivements[riftKey][key].achivements.length; i++) {
                        playerAchivements[i] = { completed: false, progress: 0 }
                    }
                    riftPlayerSaveData.achivements[key].achivements = playerAchivements
                }
            }
            riftPlayerSaveData.teleportationPoints = {
                unlocked: false
            }
            for (let key in teleportationPoints[riftKey]) {
                riftPlayerSaveData.teleportationPoints[key] = { unlocked: false }
            }
        }
        playerSaveData.servants = []
        playerPersistantData.activeRift = 'main_timeline1'
        playerPersistantData.initiated = true
        player.teleportTo(e.server.getLevel('fantasy_craft:void_dimension1'), 0, 0, 0, [], player.yaw, player.pitch)
        e.server.runCommandSilent('/execute in fantasy_craft:void_dimension1 run photon fx kubejs:player_spawn block 0 0 0')
        e.server.runCommandSilent(`/openguiscreen greeting_dialogue ${player.username}`)
    }
    recalculatePlayerStats(e, player)
}
function setUpServer(e) {
    let serverPersistantData = e.server.persistentData
    if (!serverPersistantData.playerData) {
        serverPersistantData.playerData = {}
    }
    if (!serverPersistantData.projectiles) {
        serverPersistantData.projectiles = []
    }
    if (!serverPersistantData.players) {
        serverPersistantData.players = 0
    }
    if (!serverPersistantData.timeS) {
        serverPersistantData.timeS = 0
    }
    if (!serverPersistantData.timeM) {
        serverPersistantData.timeM = 0
    }
    if (!serverPersistantData.timeH) {
        serverPersistantData.timeH = 0
    }
    if (!serverPersistantData.timeD) {
        serverPersistantData.timeD = 0
    }
    if (!serverPersistantData.timeY) {
        serverPersistantData.timeY = 0
    }
    if (!serverPersistantData.timer1s) {
        serverPersistantData.timer1s = 0
    }
    if (!serverPersistantData.timer10s) {
        serverPersistantData.timer10s = 0
    }
    if (!serverPersistantData.timer30s) {
        serverPersistantData.timer30s = 0
    }
    if (!serverPersistantData.timer1m) {
        serverPersistantData.timer1m = 0
    }
    if (!serverPersistantData.timer10m) {
        serverPersistantData.timer10m = 0
    }
    if (!serverPersistantData.timer30m) {
        serverPersistantData.timer30m = 0
    }
    if (!serverPersistantData.timer1h) {
        serverPersistantData.timer1h = 0
    }
    if (!serverPersistantData.timer2h) {
        serverPersistantData.timer2h = 0
    }
    if (!serverPersistantData.timer5h) {
        serverPersistantData.timer5h = 0
    }
    if (!serverPersistantData.timer1d) {
        serverPersistantData.timer1d = 0
    }
}
