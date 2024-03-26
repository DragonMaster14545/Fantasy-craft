function giveXp(e, player, amount, statName) {
    let playerSaveData = e.server.persistentData.playerData[player.stringUuid]
    let playerLevelData = playerSaveData.rifts[player.persistentData.activeRift].levels
    let playerLevel = playerLevelData[statName]
    let dataLevel = levels[statName]
    let xp = BigDecimal(playerLevel.xp).add(BigDecimal(amount))
    if (xp.compareTo(BigDecimal(playerLevel.maxXp)) >= 0) {
        xp = 0
        playerLevel.level += 1
        playerLevel.maxXp = BigDecimal(10).multiply(BigDecimal(dataLevel.costMultiplier).pow(playerLevel.level))
        player.notify(Text.aqua('Level up'), getColoredText({ text: dataLevel.name.text + ' level ' + playerLevel.level, color: dataLevel.name.color }))
        if (dataLevel.milestones) {
            let playerStats = playerSaveData.rifts[player.persistentData.activeRift].stats
            for (let i = 0; i < dataLevel.milestones.length; i++) {
                let playerMilestone = playerLevel.milestones[i]
                let dataMilestone = dataLevel.milestones[i]
                if (playerMilestone.claimed == false) {
                    if (playerLevel.level >= dataMilestone.level) {
                        playerMilestone.claimed = true
                        claimMilestoneReward(e, player, dataMilestone)
                        player.notify(Text.aqua('Milestone unlocked'), getColoredText({ text: 'Milestone for ' + dataLevel.name.text + ' unlocked', color: dataLevel.name.color }))
                    }
                }
            }
        }
        testForLevelQuests(e, player)
    }
    playerLevel.xp = xp
    if (statName != 'universal') {
        giveXp(e, player, amount, 'universal')
    }
}
function claimMilestoneReward(e, player, dataMilestone) {
    let playerSaveData = e.server.persistentData.playerData[player.stringUuid]
    let playerStats = playerSaveData.rifts[player.persistentData.activeRift].stats
    if (dataMilestone.type == 'stat') {
        if (playerStats[dataMilestone.id]) {
            playerStats[dataMilestone.id].amount += dataMilestone.amount
        } else {
            playerStats[dataMilestone.id] = {}
            playerStats[dataMilestone.id].amount = dataMilestone.amount
        }
    } else if (dataMilestone.type == 'text') {
        player.notify(Text.aqua(dataMilestone.name), getColoredText(dataMilestone.description[0]))
    } else if (dataMilestone.type == 'currency') {
        playerSaveData.rifts[player.persistentData.activeRift].currencies[dataMilestone.id] = BigDecimal(playerSaveData.rifts[player.persistentData.activeRift].currencies[dataMilestone.id]).add(BigDecimal(dataMilestone.amount))
    }
}
function giveArmorXp(e, player, amount) {
    let items = ['feetArmorItem', 'legsArmorItem', 'chestArmorItem', 'headArmorItem']
    let playerData = e.server.persistentData.playerData[player.stringUuid]
    let itemDataPath = playerData.itemDetails
    items.forEach(itemName => {
        let item = player[itemName]
        if (item.hasNBT()) {
            if (item.nbt.customDataId) {
                let itemCustomData = itemDataPath[item.nbt.customDataId]
                itemCustomData.xp += amount
            }
        }
    })
    giveXp(e, player, amount, 'defense')
    updateItems(e, player)
}
EntityEvents.hurt(e => {
    if (e.entity.persistentData.dead != true && e.damage > 0) {
        if (processDamage(e, e.source.actual, e.entity, 'unknown', e.entity.health)) {
            e.cancel()
        } else if (e.entity.health - e.damage < 0) {
            if (e.entity.isLiving && !e.entity.isPlayer()) {
                if (enemyDied(e, e.entity)) {
                    e.cancel()
                }
                e.entity.persistentData.dead = true
            }
        }
    }
})


