function updateNPCS(e) {
    let level = e.server.getLevel('fantasy_craft:void_dimension')
    resetNpc(e, level, 0, 0, 0, 0, 1, 0, 'npc1', 'kubejs:npc1', { text: 'Test npc', color: 0x00FFFF })
}
function resetNpc(e, level, x1, y1, z1, x2, y2, z2, npcId, npcType, npcName) {
    let block = level.getBlock(x1, y1, z1)
    if (level.isLoaded(block)) {
        level.getEntitiesWithin(AABB.of(x1, y1, z1, x2, y2, z2)).forEach(entity => {
            if (entity.persistentData.npcId == npcId) {
                entity.kill()
            }
        })
        let entity = block.createEntity(npcType)
        entity.persistentData.npcId = npcId
        entity.customName = getColoredText(npcName)
        entity.spawn()
    }
}
NetworkEvents.dataReceived('rpg_npc_interaction', e => {
    let player = e.entity
    let data = e.data
    let entity = e.server.getLevel(data.level).getEntity(data.entity)
    rpgNpcInteraction(e, player, entity)
})
function rpgNpcInteraction(e, player, entity) {
    let npcId = entity.persistentData.npcId
    if (npcId) {
        let quests = e.server.persistentData.playerData[player.stringUuid].rifts[player.persistentData.activeRift].quests
        let questIndex = 0
        let dialogueOptions = []
        quests.forEach(quest => {
            if (!quest.completed) {
                let activeStep = quest.steps[quest.progress]
                if (activeStep.task.type == 'talk_to_npc') {
                    if (activeStep.task.id == npcId) {
                        dialogueOptions.push({ type: 'talk_quest', questIndex: questIndex })
                    }
                } else
                    if (activeStep.task.type == 'deliver_items') {
                        if (activeStep.task.id == npcId) {
                            if (activeStep.task.inInventory >= activeStep.task.amount) {
                                dialogueOptions.push({ type: 'deliver_quest', questIndex: questIndex })
                            }
                        }
                    }
            }
            questIndex += 1
        })
        let interactions = npcInteractions[npcId]
        if (interactions) {
            for (let i = interactions.length - 1; i >= 0; i--) {
                let interaction = interactions[i]
                if (interaction.requirement == 'none') {
                    dialogueOptions.push({ type: 'dialogue', dialogue: Object.assign({}, interaction.dialogue) })
                }
            }
        }
        if (dialogueOptions.length > 1) {
            rpgChooseDialogueGui(e, player, 0, dialogueOptions, entity.displayName)
        } else {
            let option = dialogueOptions[0]
            if (option.type == 'talk_quest') {
                openQuestDialogue(e, player, option.questIndex)
            } else if (option.type == 'deliver_quest') {
                let quests = e.server.persistentData.playerData[player.stringUuid].rifts[player.persistentData.activeRift].quests
                let quest = quests[option.questIndex]
                let activeStep = quest.steps[quest.progress]
                e.server.runCommandSilent(`clear ${player.username} ${activeStep.task.itemId} ${activeStep.task.amount}`)
                openQuestDialogue(e, player, option.questIndex)
            } else if (option.type == 'dialogue') {
                rpgDialogueGui(e, player, 0, option.dialogue, false)
            }
        }
    }
}
global.NPCS.forEach(npc => {
    EntityJSEvents.addGoalSelectors('kubejs:'+npc.id, e => {
        e.customGoal(
            'move_to_persistent_data_position',
            1,
            mob => {
                return true
            },
            mob => {
                return true
            },
            true,
            mob => {
                if (mob.persistentData.target) {
                    mob.getNavigation().moveTo(mob.getNavigation().createPath(mob.persistentData.targetX, mob.persistentData.targetY, mob.persistentData.targetZ, 0.1), mob.persistentData.speed);
                }
            },
            mob => {
                mob.getNavigation().stop();
            },
            true,
            mob => {
                if (mob.persistentData.target) {
                    mob.getNavigation().moveTo(mob.getNavigation().createPath(mob.persistentData.targetX, mob.persistentData.targetY, mob.persistentData.targetZ, 0.1), mob.persistentData.speed);
                    let targetpos = mob.getNavigation().targetPos
                    if (targetpos) {
                        if (mob.distanceToSqr(targetpos) <= 0.5) {
                            mob.getNavigation().stop()
                            mob.persistentData.target = false
                            mob.deltaMovement = 0
                        }
                    }
                }
            }
        );
    })
})