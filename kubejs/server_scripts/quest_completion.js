EntityEvents.death(e => {
    if (e.source.actual) {
        let player = e.source.actual
        if (player.isPlayer()) {
            testForKillQuests(e, player)
            removeQuests(e, player)
        } else if (e.entity.persistentData.lastHit) {
            let player = e.server.getPlayerList().getPlayer(e.entity.persistentData.lastHit)
            testForKillQuests(e, player)
            removeQuests(e, player)
        }
    } else if (e.entity.persistentData.lastHit) {
        let player = e.server.getPlayerList().getPlayer(e.entity.persistentData.lastHit)
        testForKillQuests(e, player)
        removeQuests(e, player)
    }
})
PlayerEvents.inventoryChanged(e => {
    let player = e.entity
    testForItemQuests(e, player)
    removeQuests(e, player)
    updateItems(e, player)
})
function testForLevelQuests(e, player) {
    let playerSaveData = e.server.persistentData.playerData[player.stringUuid]
    let quests = playerSaveData.rifts[player.persistentData.activeRift].quests
    let levels = playerSaveData.rifts[player.persistentData.activeRift].levels
    let playerAchivements = playerSaveData.rifts[player.persistentData.activeRift].achivements
    quests.forEach(quest => {
        if (!quest.completed) {
            let activeStep = quest.steps[quest.progress]
            if (activeStep.task.type == 'reach_level') {
                activeStep.task.progress = levels[activeStep.task.id].level
                questTestForCompletion(e, quest, player)
            }
        }
    })
    for (let key in achivements[player.persistentData.activeRift]) {
        let playerAchivementCategory = playerAchivements[key]
        let achivementsCategory = achivements[player.persistentData.activeRift][key]
        if (playerAchivementCategory.completed == false) {
            for (let i = 0; i < achivementsCategory.achivements.length; i++) {
                if (playerAchivementCategory.achivements[i].completed == false) {
                    if (achivementsCategory.achivements[i].task.type == 'reach_level') {
                        playerAchivementCategory.achivements[i].progress = levels[achivementsCategory.achivements[i].task.id].level
                        achivementTestForCompletion(e, player, key, i)
                    }
                }
            }
        }
    }
}
function testForKillQuests(e, player) {
    let playerSaveData = e.server.persistentData.playerData[player.stringUuid]
    let quests = playerSaveData.rifts[player.persistentData.activeRift].quests
    let playerAchivements = playerSaveData.rifts[player.persistentData.activeRift].achivements
    quests.forEach(quest => {
        if (!quest.completed) {
            let activeStep = quest.steps[quest.progress]
            if (activeStep.task.type == 'kill_mobs') {
                if (activeStep.task.id == e.entity.type) {
                    activeStep.task.progress += 1
                    questTestForCompletion(e, quest, player)
                }
            }
        }
    })
    for (let key in achivements[player.persistentData.activeRift]) {
        let playerAchivementCategory = playerAchivements[key]
        let achivementsCategory = achivements[player.persistentData.activeRift][key]
        if (playerAchivementCategory.completed == false) {
            for (let i = 0; i < achivementsCategory.achivements.length; i++) {
                if (playerAchivementCategory.achivements[i].completed == false) {
                    if (achivementsCategory.achivements[i].task.type == 'kill_mobs') {
                        if (achivementsCategory.achivements[i].task.id == e.entity.type) {
                            playerAchivementCategory.achivements[i].progress += 1
                            achivementTestForCompletion(e, player, key, i)
                        }
                    }
                }
            }
        }
    }
}
function testForItemQuests(e, player) {
    let quests = e.server.persistentData.playerData[player.stringUuid].rifts[player.persistentData.activeRift].quests
    quests.forEach(quest => {
        if (!quest.completed) {
            let activeStep = quest.steps[quest.progress]
            if (activeStep.task.type == 'collect_items') {
                activeStep.task.progress = player.inventory.count(Item.of(activeStep.task.id))
                questTestForCompletion(e, quest, player)
            } else if (activeStep.task.type == 'deliver_items') {
                activeStep.task.inInventory = player.inventory.count(Item.of(activeStep.task.itemId))
            }
        }
    })
}
function questTestForCompletion(e, quest, player) {
    let activeStep = quest.steps[quest.progress]
    if (activeStep.task.type == 'kill_mobs' || activeStep.task.type == 'collect_items' || activeStep.task.type == 'talk_to_npc' || activeStep.task.type == 'deliver_items' || activeStep.task.type == 'reach_level') {
        if (activeStep.task.progress >= activeStep.task.amount) {
            activeStep.completed = true
            player.notify(Text.gray('Quest progress'), Text.green('Finished step ' + activeStep.name.text + ' of quest ' + quest.name.text))
            questRecalculateProgress(e, quest, player)
        }
    }
}
function achivementTestForCompletion(e, player, key, i) {
    let playerSaveData = e.server.persistentData.playerData[player.stringUuid]
    let playerAchivements = playerSaveData.rifts[player.persistentData.activeRift].achivements
    let playerAchivementCategory = playerAchivements[key]
    let achivementsCategory = achivements[player.persistentData.activeRift][key]
    let achivementData = achivementsCategory.achivements[i]
    let achivementPlayerData = playerAchivementCategory.achivements[i]
    if (achivementData.task.type == 'kill_mobs' || achivementData.task.type == 'collect_items' || achivementData.task.type == 'talk_to_npc' || achivementData.task.type == 'deliver_items' || achivementData.task.type == 'reach_level') {
        if (achivementPlayerData.progress >= achivementData.task.amount) {
            achivementPlayerData.completed = true
            player.notify(Text.gray('Achivement completed'), Text.green('Completed achivement ' + achivementData.name.text))
            achivementCategoryRecalculateProgress(e, player, key)
        }
    }
}
function questRecalculateProgress(e, quest, player) {
    quest.progress = 0
    quest.steps.forEach(step => {
        if (step.completed == true) {
            quest.progress += 1
        }
    })
    if (quest.progress >= quest.steps.length) {
        quest.completed = true
        player.notify(Text.gray('Quest finished'), Text.darkGreen('Finished quest ' + quest.name.text))
        if (!hasQuestRewards(quest)) {
            if (quest.rewards) {
                quest.rewards.forEach(reward => {
                    questGiveReward(e, player, reward)
                })
            }
            quest.remove = true
        }
    } else {
        testForItemQuests(e, player)
        testForLevelQuests(e, player)
    }
}
function achivementCategoryRecalculateProgress(e, player, key) {
    let playerSaveData = e.server.persistentData.playerData[player.stringUuid]
    let playerAchivements = playerSaveData.rifts[player.persistentData.activeRift].achivements
    let playerAchivementCategory = playerAchivements[key]
    let achivementsCategory = achivements[player.persistentData.activeRift][key]
    playerAchivementCategory.progress = 0
    playerAchivementCategory.achivements.forEach(achivement => {
        if (achivement.completed == true) {
            playerAchivementCategory.progress += 1
        }
    })
    if (playerAchivementCategory.progress >= achivementsCategory.achivements.length) {
        playerAchivementCategory.completed = true
        player.notify(Text.gray('Completed achivement category'), Text.darkGreen('Completed achivement category ' + playerAchivementCategory.name.text))
    }
}
function removeQuests(e, player) {
    let it = e.server.persistentData.playerData[player.stringUuid].rifts[player.persistentData.activeRift].quests.listIterator()
    while (it.hasNext()) {
        let quest = it.next();
        if (quest.contains("remove")) {
            it.remove();
        }
    }
}