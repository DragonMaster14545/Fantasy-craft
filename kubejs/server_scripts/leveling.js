function giveXp(e,player,amount,statName) {
    let playerSaveData = e.server.persistentData.playerData[player.stringUuid]
    let playerLevelData = playerSaveData.levels
    let playerLevel = playerLevelData[statName]
    let dataLevel = levels[statName]
    let xp = BigDecimal(playerLevel.xp).add(BigDecimal(amount))
    if(xp.compareTo(BigDecimal(playerLevel.maxXp)) >= 0) {
        xp = 0
        playerLevel.level += 1
        playerLevel.maxXp = BigDecimal(10).multiply(BigDecimal(dataLevel.costMultiplier).pow(playerLevel.level))
        player.notify(Text.aqua('Level up'),getColoredText({text:dataLevel.name.text+' level '+playerLevel.level,color:dataLevel.name.color}))
        if(dataLevel.milestones) {
            let playerStats = playerSaveData.stats
            for(let i = 0;i<dataLevel.milestones.length;i++) {
                let playerMilestone = playerLevel.milestones[i]
                let dataMilestone = dataLevel.milestones[i]
                if(playerMilestone.claimed == false) {
                    if(playerLevel.level >= dataMilestone.level) {
                        playerMilestone.claimed = true
                        claimMilestoneReward(e,player,dataMilestone)
                        player.notify(Text.aqua('Milestone unlocked'),getColoredText({text:'Milestone for '+dataLevel.name.text+' unlocked',color:dataLevel.name.color}))
                    }
                }
            }
        }
        testForLevelQuests(e,player)
    }
    playerLevel.xp = xp
    if(statName != 'universal') {
        giveXp(e,player,amount,'universal')
    }
}
function claimMilestoneReward(e,player,dataMilestone) {
    let playerSaveData = e.server.persistentData.playerData[player.stringUuid]
    let playerStats = playerSaveData.stats
    if(dataMilestone.type == 'stat') {
        if(playerStats[dataMilestone.id]) {
            playerStats[dataMilestone.id].amount += dataMilestone.amount
        } else {
            playerStats[dataMilestone.id] = {}
            playerStats[dataMilestone.id].amount = dataMilestone.amount
        }
    } else if(dataMilestone.type == 'text') {
        player.notify(Text.aqua(dataMilestone.name),getColoredText(dataMilestone.description[0]))
    } else if(dataMilestone.type == 'currency') {
        playerSaveData.currencies[dataMilestone.id] = BigDecimal(playerSaveData.currencies[dataMilestone.id]).add(BigDecimal(dataMilestone.amount))
    } 
}
function giveArmorXp(e,player,amount) {
    let items = ['feetArmorItem','legsArmorItem','chestArmorItem','headArmorItem']
    let playerData = e.server.persistentData.playerData[player.stringUuid]
    let itemDataPath = playerData.itemDetails
    items.forEach(itemName => {
        let item = player[itemName]
        if(item.hasNBT()) {
            if(item.nbt.customDataId) {
            let itemCustomData = itemDataPath[item.nbt.customDataId]
            itemCustomData.xp += amount
            }
        }
    })
    giveXp(e,player,amount,'defense')
    updateItems(e,player)
}
EntityEvents.hurt(e => {
    if(e.entity.persistentData.dead == undefined && e.damage > 0) {
        if(processDamage(e,e.source.actual,e.entity,'unknown',e.entity.health)) {
            e.cancel()
        }
    }
})



EntityJSEvents.addGoalSelectors('kubejs:npc1', e => {
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
                if(mob.persistentData.target) {
                    mob.getNavigation().moveTo(mob.getNavigation().createPath(mob.persistentData.targetX,mob.persistentData.targetY,mob.persistentData.targetZ,0.1), mob.persistentData.speed);
                }
        },
        mob => {
            mob.getNavigation().stop();
        },
        true, 
        mob => {
            if(mob.persistentData.target) {
                mob.getNavigation().moveTo(mob.getNavigation().createPath(mob.persistentData.targetX,mob.persistentData.targetY,mob.persistentData.targetZ,0.1), mob.persistentData.speed);
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