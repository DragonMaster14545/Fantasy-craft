NetworkEvents.dataReceived('KeyPressed', e => {
    let player = e.player
    let key = e.data.key
    if (key == 'open_rpg_main_menu') {
        rpgMainMenuGui(e, player, 0)
    }
})

/**
 * @param {Internal.ServerPlayer} player 
 * @param {Integer} page 
 * @param {Internal.NetworkEventJS} event 
 */
let rpgMainMenuGui = (event, player, page) => {
    player.openChestGUI(Text.of(Text.darkAqua('Rpg main menu')), 4, gui => {
        gui.playerSlots = true
        let playerSaveData = event.server.persistentData.playerData[player.stringUuid]
        let mainQuestProgress = playerSaveData.rifts[player.persistentData.activeRift].mainQuestProgress
        gui.slot(0, 0, slot => {
            slot.item = Item.of('minecraft:book').withName(Text.of(Text.darkAqua('Player stats')))
            slot.leftClicked = e => rpgStatsGui(event, player, 0)
        })
        gui.slot(1, 0, slot => {
            slot.item = Item.of('minecraft:book').withName(Text.of(Text.darkAqua('Levels')))
            slot.leftClicked = e => rpgLevelsMenuGui(event, player, 0)
        })
        gui.slot(2, 0, slot => {
            slot.item = Item.of('minecraft:paper').withName(Text.of(Text.darkAqua('Quests')))
            slot.leftClicked = e => rpgQuestMenuGui(event, player, 0)
        })
        gui.slot(3, 0, slot => {
            slot.item = Item.of('minecraft:netherite_sword').withName(Text.of(Text.darkAqua('Classes')))
            slot.leftClicked = e => rpgClassOverviewGui(event, player, 0)
        })
        gui.slot(4, 0, slot => {
            slot.item = Item.of('minecraft:gold_ingot').withName(Text.of(Text.darkAqua('Achivements')))
            slot.leftClicked = e => rpgAchivementOverviewGui(event, player, 0)
        })
        if (playerSaveData.rifts[player.persistentData.activeRift].teleportationPoints.unlocked == true) {
            gui.slot(5, 0, slot => {
                slot.item = Item.of('minecraft:ender_pearl').withName(Text.of(Text.darkPurple('Teleportation points')))
                slot.leftClicked = e => rpgTeleportationPointsGui(event, player, 0)
            })
        }
        //if(mainQuestProgress >= 1) {
        gui.slot(6, 0, slot => {
            slot.item = Item.of('minecraft:chest').withName(Text.of(Text.darkAqua('Shop')))
            slot.leftClicked = e => rpgShopGui(event, player, 0)
        })
        //}
        //if(mainQuestProgress >= 5) {
        gui.slot(7, 0, slot => {
            slot.item = Item.of('minecraft:smithing_table').withName(Text.of(Text.darkAqua('Item modification')))
            slot.leftClicked = e => rpgItemModificationGui(event, player, 0)
        })
        //}
        gui.slot(0, 3, slot => {
            slot.item = Item.of('minecraft:netherite_ingot').withName(Text.of(Text.red('Operator menu')))
            slot.leftClicked = e => rpgOperatorGui(event, player, 0)
        })
    })
}
/**
 * @param {Internal.ServerPlayer} player 
 * @param {Integer} page 
 * @param {Internal.NetworkEventJS} event 
 */
let rpgTeleportationPointsGui = (event, player, page) => {
    player.openChestGUI(Text.of(Text.darkPurple('Teleportation points')), 6, gui => {
        gui.playerSlots = true
        let playerSaveData = event.server.persistentData.playerData[player.stringUuid]
        let playerTeleportationPoints = playerSaveData.rifts[player.persistentData.activeRift].teleportationPoints
        let slotX = 0
        let slotY = 0
        for (let key in teleportationPoints[player.persistentData.activeRift]) {
            let playerTeleportationPoint = playerTeleportationPoints[key]
            let dataTeleportationPoint = teleportationPoints[player.persistentData.activeRift][key]
            if (playerTeleportationPoint.unlocked == true) {
                let icon = Item.of(dataTeleportationPoint.icon).withName(getColoredText(dataTeleportationPoint.name))
                let savedKey = key
                gui.slot(slotX, slotY, slot => {
                    slot.item = icon
                    slot.leftClicked = e => {
                        player.teleportTo(event.server.getLevel(dataTeleportationPoint.dim), dataTeleportationPoint.x, dataTeleportationPoint.y, dataTeleportationPoint.z, [], player.yaw, player.pitch)
                        event.server.runCommandSilent(`/execute in ${dataTeleportationPoint.dim} run photon fx kubejs:player_spawn block ${dataTeleportationPoint.x} ${dataTeleportationPoint.y} ${dataTeleportationPoint.z}`)
                    }
                })
                slotX += 1
                if (slotX >= 9) {
                    slotX = 0
                    slotY += 1
                }
            }
        }
        gui.slot(8, 5, slot => {
            slot.item = Item.of('minecraft:barrier').withName(Text.of(Text.darkAqua('Return')))
            slot.leftClicked = e => rpgMainMenuGui(event, player, 0)
        })
    })
}
/**
 * @param {Internal.ServerPlayer} player 
 * @param {Integer} page 
 * @param {Internal.NetworkEventJS} event 
 */
let rpgAchivementOverviewGui = (event, player, page) => {
    player.openChestGUI(Text.of(Text.darkAqua('Achivements overview')), 6, gui => {
        gui.playerSlots = true
        let playerSaveData = event.server.persistentData.playerData[player.stringUuid]
        let playerAchivements = playerSaveData.rifts[player.persistentData.activeRift].achivements
        let slotX = 0
        let slotY = 0
        for (let key in achivements[player.persistentData.activeRift]) {
            let playerAchivement = playerAchivements[key]
            let dataAchivement = achivements[player.persistentData.activeRift][key]
            let icon
            if (playerAchivement.completed == true) {
                icon = Item.of(dataAchivement.iconCompleted)
            } else {
                icon = Item.of(dataAchivement.icon)
            }
            icon = icon.withName(getColoredText(dataAchivement.name))
            icon = icon.withLore(Text.aqua('Achivements completed: ' + playerAchivement.progress + ' / ' + dataAchivement.achivements.length))
            dataAchivement.description.forEach(line => {
                icon = icon.withLore(getColoredText(line))
            })
            let savedKey = key
            gui.slot(slotX, slotY, slot => {
                slot.item = icon
                slot.leftClicked = e => rpgAchivementDetailsGui(event, player, 0, savedKey)
            })
            slotX += 1
            if (slotX >= 9) {
                slotX = 0
                slotY += 1
            }
        }
        gui.slot(8, 5, slot => {
            slot.item = Item.of('minecraft:barrier').withName(Text.of(Text.darkAqua('Return')))
            slot.leftClicked = e => rpgMainMenuGui(event, player, 0)
        })
    })
}
/**
 * @param {Internal.ServerPlayer} player 
 * @param {Integer} page 
 * @param {Internal.NetworkEventJS} event 
 */
let rpgAchivementDetailsGui = (event, player, page, key) => {
    let playerSaveData = event.server.persistentData.playerData[player.stringUuid]
    let playerAchivementData = playerSaveData.rifts[player.persistentData.activeRift].achivements
    let playerAchivement = playerAchivementData[key]
    let dataAchivement = achivements[player.persistentData.activeRift][key]
    let playerAchivements = playerAchivement.achivements
    let dataAchivements = dataAchivement.achivements
    player.openChestGUI(getColoredText({ text: dataAchivement.name.text + ' achivements overview', color: dataAchivement.name.color }), 6, gui => {
        gui.playerSlots = true
        let slotX = 0
        let slotY = 0
        for (let key in dataAchivements) {
            let playerSelectedAchivement = playerAchivements[key]
            let dataSelectedAchivement = dataAchivements[key]
            let modifiedDataSelectedAchivement = Object.assign({}, dataSelectedAchivement)
            modifiedDataSelectedAchivement.completed = playerSelectedAchivement.completed
            modifiedDataSelectedAchivement.task.progress = playerSelectedAchivement.progress
            gui.slot(slotX, slotY, slot => {
                slot.item = questFormateStep(event, player, modifiedDataSelectedAchivement, true, true)
            })
            slotX += 1
            if (slotX >= 9) {
                slotX = 0
                slotY += 1
            }
        }
        gui.slot(8, 5, slot => {
            slot.item = Item.of('minecraft:barrier').withName(Text.of(Text.darkAqua('Return')))
            slot.leftClicked = e => rpgAchivementOverviewGui(event, player, 0)
        })
    })
}
/**
 * @param {Internal.ServerPlayer} player 
 * @param {Integer} page 
 * @param {Internal.NetworkEventJS} event 
 */
let rpgClassOverviewGui = (event, player, page) => {
    player.openChestGUI(Text.of(Text.darkAqua('Classes overview')), 6, gui => {
        gui.playerSlots = true
        let playerSaveData = event.server.persistentData.playerData[player.stringUuid]
        let playerClasses = playerSaveData.rifts[player.persistentData.activeRift].classes
        let playerCurrencies = playerSaveData.rifts[player.persistentData.activeRift].currencies
        for (let key in classes[player.persistentData.activeRift]) {
            let activeClass = classes[player.persistentData.activeRift][key]
            let activePlayerClass = playerClasses[key]
            if (activeClass.y - page >= 0) {
                let icon
                if (activePlayerClass.owned == true) {
                    icon = Item.of(activeClass.iconOwned)
                    icon = icon.withLore(Text.green('Already unlocked'))
                } else {
                    icon = Item.of(activeClass.icon)
                    icon = icon.withLore(getColoredText({ text: 'Costs ' + formatBigDecimal(BigDecimal(activeClass.cost)) + ' / ' + formatBigDecimal(BigDecimal(playerCurrencies.evolution_points)) + ' ' + currencies.evolution_points.name.text, color: currencies.evolution_points.name.color }))
                }
                icon = icon.withName(getColoredText(activeClass.name))
                activeClass.description.forEach(line => {
                    icon = icon.withLore(getColoredText(line))
                })
                gui.slot(activeClass.x, activeClass.y - page, slot => {
                    slot.item = icon
                    let actualKey = key
                    slot.leftClicked = e => {
                        if (activePlayerClass.owned == true) {
                            if (activeClass.skills) {
                                rpgClassDetailsGui(event, player, 0, actualKey)
                            }
                        } else {
                            if (BigDecimal(playerCurrencies.evolution_points).compareTo(BigDecimal(activeClass.cost)) >= 0) {
                                let canBuy = true
                                activeClass.requirements.forEach(requirement => {
                                    if (playerClasses[requirement].owned == false) {
                                        canBuy = false
                                    }
                                })
                                if (canBuy) {
                                    playerCurrencies.evolution_points = BigDecimal(playerCurrencies.evolution_points).subtract(BigDecimal(activeClass.cost))
                                    activePlayerClass.owned = true
                                    rpgClassOverviewGui(event, player, page)
                                } else {
                                    player.notify(Text.red('Could not unlock'), Text.red('Unlock prervious first'))
                                }
                            } else {
                                player.notify(Text.red('Could not unlock'), getColoredText({ text: 'Not enough ' + currencies.evolution_points.name.text, color: currencies.evolution_points.name.color }))
                            }
                        }
                    }
                })
            }
        }
        if (page > 0) {
            gui.slot(0, 5, slot => {
                slot.item = Item.of('minecraft:arrow').withName(Text.of(Text.darkAqua('Go up')))
                slot.leftClicked = e => rpgClassOverviewGui(event, player, page - 1)
            })
        }
        gui.slot(7, 5, slot => {
            slot.item = Item.of('minecraft:arrow').withName(Text.of(Text.darkAqua('Go down')))
            slot.leftClicked = e => rpgClassOverviewGui(event, player, page + 1)
        })
        gui.slot(8, 5, slot => {
            slot.item = Item.of('minecraft:barrier').withName(Text.of(Text.darkAqua('Return')))
            slot.leftClicked = e => rpgMainMenuGui(event, player, 0)
        })
    })
}
/**
 * @param {Internal.ServerPlayer} player 
 * @param {Integer} page 
 * @param {Internal.NetworkEventJS} event 
 */
let rpgClassDetailsGui = (event, player, page, classKey) => {
    player.openChestGUI(getColoredText({ text: 'Class ' + classes[classKey].name.text + ' details', color: classes[classKey].name.color }), 6, gui => {
        gui.playerSlots = true
        let playerSaveData = event.server.persistentData.playerData[player.stringUuid]
        let playerCurrencies = playerSaveData.rifts[player.persistentData.activeRift].currencies
        let activePlayerClass = playerSaveData.rifts[player.persistentData.activeRift].classes[classKey]
        let activeClass = classes[player.persistentData.activeRift][classKey]
        let skills = activeClass.skills
        for (let key in skills) {
            let activeSkill = skills[key]
            let activePlayerSkill = activePlayerClass.skills[key]
            if (activeSkill.y - page >= 0) {
                let icon
                if (activePlayerSkill.owned == true) {
                    icon = Item.of(activeSkill.iconOwned)
                    icon = icon.withLore(Text.green('Already unlocked'))
                } else {
                    icon = Item.of(activeSkill.icon)
                    icon = icon.withLore(getColoredText({ text: 'Costs ' + formatBigDecimal(BigDecimal(activeSkill.cost)) + ' / ' + formatBigDecimal(BigDecimal(playerCurrencies.skill_points)) + ' ' + currencies.skill_points.name.text, color: currencies.skill_points.name.color }))
                }
                icon = formatMilestoneIcon(icon, activeSkill)
                gui.slot(activeSkill.x, activeSkill.y - page, slot => {
                    slot.item = icon
                    slot.leftClicked = e => {
                        if (activePlayerSkill.owned == false) {
                            if (BigDecimal(playerCurrencies.skill_points).compareTo(BigDecimal(activeSkill.cost)) >= 0) {
                                let canBuy = true
                                activeSkill.requirements.forEach(requirement => {
                                    if (activePlayerClass.skills[requirement].owned == false) {
                                        canBuy = false
                                    }
                                })
                                if (canBuy) {
                                    playerCurrencies.skill_points = BigDecimal(playerCurrencies.skill_points).subtract(BigDecimal(activeSkill.cost))
                                    activePlayerSkill.owned = true
                                    claimMilestoneReward(event, player, activeSkill)
                                    rpgClassDetailsGui(event, player, page, classKey)
                                } else {
                                    player.notify(Text.red('Could not unlock'), Text.red('Unlock prervious first'))
                                }
                            } else {
                                player.notify(Text.red('Could not unlock'), getColoredText({ text: 'Not enough ' + currencies.skill_points.name.text, color: currencies.skill_points.name.color }))
                            }
                        } else {
                            player.notify(Text.red('Could not unlock'), Text.red('You already own this'))
                        }
                    }
                })
            }
        }
        if (page > 0) {
            gui.slot(0, 5, slot => {
                slot.item = Item.of('minecraft:arrow').withName(Text.of(Text.darkAqua('Go up')))
                slot.leftClicked = e => rpgClassDetailsGui(event, player, page - 1, classKey)
            })
        }
        gui.slot(7, 5, slot => {
            slot.item = Item.of('minecraft:arrow').withName(Text.of(Text.darkAqua('Go down')))
            slot.leftClicked = e => rpgClassDetailsGui(event, player, page + 1, classKey)
        })
        gui.slot(8, 5, slot => {
            slot.item = Item.of('minecraft:barrier').withName(Text.of(Text.darkAqua('Return')))
            slot.leftClicked = e => rpgClassOverviewGui(event, player, 0)
        })
    })
}
/**
 * @param {Internal.ServerPlayer} player 
 * @param {Integer} page 
 * @param {Internal.NetworkEventJS} event 
 */
let rpgItemModificationGui = (event, player, page, slotSelected) => {
    player.openChestGUI(Text.of(Text.darkAqua('Item modification')), 6, gui => {
        gui.playerSlots = true
        let playerSaveData = event.server.persistentData.playerData[player.stringUuid]
        let drawX = 0
        let drawY = 6
        for (let i = 0; i <= 35; i++) {
            let item = player.getSlot(i).get()
            if (item) {
                gui.slot(drawX, drawY, slot => {
                    slot.item = item
                    //slot.leftClicked = e => rpgMainMenuGui(event, player, 0)
                })
            }
            drawX += 1
            if (drawX >= 9) {
                drawX = 0
                drawY += 1
            }
        }
        gui.slot(8, 5, slot => {
            slot.item = Item.of('minecraft:barrier').withName(Text.of(Text.darkAqua('Return')))
            slot.leftClicked = e => rpgMainMenuGui(event, player, 0)
        })
        gui.slot(0, 5, slot => {
            slot.item = Item.of('minecraft:barrier').withName(Text.of(Text.darkAqua('Return')))
            slot.leftClicked = e => player.getSlot(5).set(Item.of("minecraft:acacia_boat"))
        })
    })
}
/**
 * @param {Internal.ServerPlayer} player 
 * @param {Integer} page 
 * @param {Internal.NetworkEventJS} event 
 */
let rpgLevelsMenuGui = (event, player, page) => {
    player.openChestGUI(Text.of(Text.darkAqua('Levels overview')), 6, gui => {
        gui.playerSlots = true
        let playerSaveData = event.server.persistentData.playerData[player.stringUuid]
        let playerLevelData = playerSaveData.rifts[player.persistentData.activeRift].levels
        let drawX = 0
        let drawY = 0
        for (let key in playerLevelData) {
            let playerLevel = playerLevelData[key]
            let dataLevel = levels[key]
            if (playerSaveData.rifts[player.persistentData.activeRift].mainQuestProgress >= dataLevel.mainQuestReqired) {
                gui.slot(drawX, drawY, slot => {
                    playerLevel.key = key
                    let icon = Item.of(dataLevel.icon).withName(getColoredText(dataLevel.name))
                    icon = icon.withLore(Text.green('Level ' + playerLevel.level))
                    icon = icon.withLore(Text.green('Xp ' + formatBigDecimal(BigDecimal(playerLevel.xp)) + ' / ' + formatBigDecimal(BigDecimal(playerLevel.maxXp))))
                    dataLevel.description.forEach(line => {
                        icon = icon.withLore(getColoredText(line))
                    })
                    slot.item = icon
                    if (dataLevel.milestones) {
                        slot.leftClicked = e => rpgLevelDetailsGui(event, player, 0, playerLevel.key)
                    }
                })
                drawX += 1
                if (drawX >= 9) {
                    drawX = 0
                    drawY += 1
                }
            }
        }
        gui.slot(8, 5, slot => {
            slot.item = Item.of('minecraft:barrier').withName(Text.of(Text.darkAqua('Return')))
            slot.leftClicked = e => rpgMainMenuGui(event, player, 0)
        })
    })
}
/**
 * @param {Internal.ServerPlayer} player 
 * @param {Integer} page 
 * @param {Internal.NetworkEventJS} event 
 */
let rpgLevelDetailsGui = (event, player, page, key) => {
    let playerSaveData = event.server.persistentData.playerData[player.stringUuid]
    let playerLevelData = playerSaveData.rifts[player.persistentData.activeRift].levels
    let playerLevel = playerLevelData[key]
    let dataLevel = levels[key]
    player.openChestGUI(getColoredText({ text: dataLevel.name.text + ' level details', color: dataLevel.name.color }), 6, gui => {
        gui.playerSlots = true
        let toSkip = 29 * page
        let toForget = toSkip + 29
        if (toForget > dataLevel.milestones.length) {
            toForget = dataLevel.milestones.length
        }
        if (dataLevel.milestones.length > toForget) {
            gui.slot(7, 5, slot => {
                slot.item = Item.of('minecraft:arrow').withName(Text.aqua('Next page'))
                slot.leftClicked = e => rpgLevelDetailsGui(event, player, page + 1, key)
            })
        }
        if (page >= 1) {
            gui.slot(0, 5, slot => {
                slot.item = Item.of('minecraft:arrow').withName(Text.aqua('Previous page'))
                slot.leftClicked = e => rpgLevelDetailsGui(event, player, page - 1, key)
            })
        }
        gui.slot(4, 5, slot => {
            slot.item = Item.of('minecraft:book').withName(Text.aqua('Page ' + (page + 1) + ' / ' + Math.ceil(dataLevel.milestones.length / 29)))
        })
        let drawX = 0
        let drawY = 0
        for (let i = toSkip; i < toForget; i++) {
            let playerMilestone = playerLevel.milestones[i]
            let dataMilestone = dataLevel.milestones[i]
            gui.slot(drawX, drawY, slot => {
                let icon
                if (playerMilestone.claimed) {
                    icon = Item.of(dataMilestone.iconCompleted)
                } else {
                    icon = Item.of(dataMilestone.icon)
                }
                icon = formatMilestoneIcon(icon, dataMilestone)
                slot.item = icon
            })
            if (drawY == 0) {
                drawX += 1
                if (drawX >= 9) {
                    drawX = 8
                    drawY = 1
                }
            } else if (drawY == 1) {
                drawY = 2
                drawX = 8
            } else if (drawY == 2) {
                drawX -= 1
                if (drawX <= -1) {
                    drawX = 0
                    drawY = 3
                }
            } else if (drawY == 3) {
                drawY = 4
                drawX = 0
            } else if (drawY == 4) {
                drawX += 1
            }
        }
        gui.slot(8, 5, slot => {
            slot.item = Item.of('minecraft:barrier').withName(Text.of(Text.darkAqua('Return')))
            slot.leftClicked = e => rpgLevelsMenuGui(event, player, 0)
        })
    })
}
function formatMilestoneIcon(icon, dataMilestone) {
    if (dataMilestone.type == 'stat') {
        let stat = stats[dataMilestone.id]
        icon = icon.withName(getColoredText(stat.name))
        icon = icon.withLore(Text.green('Amount: ' + dataMilestone.amount))
        if (dataMilestone.level) {
            icon = icon.withLore(Text.green('Level required: ' + dataMilestone.level))
        }
    } else if (dataMilestone.type == 'text') {
        icon = icon.withName(getColoredText(dataMilestone.name))
        dataMilestone.description.forEach(line => {
            icon = icon.withLore(getColoredText(line))
        })
        if (dataMilestone.level) {
            icon = icon.withLore(Text.green('Level required: ' + dataMilestone.level))
        }
    } else if (dataMilestone.type == 'currency') {
        let currency = currencies[dataMilestone.id]
        icon = icon.withName(getColoredText(currency.name))
        icon = icon.withLore(Text.green('Amount: ' + formatBigDecimal(BigDecimal(dataMilestone.amount))))
        if (dataMilestone.level) {
            icon = icon.withLore(Text.green('Level required: ' + dataMilestone.level))
        }
    }
    return icon
}
/**
 * @param {Internal.ServerPlayer} player 
 * @param {Integer} page 
 * @param {Internal.NetworkEventJS} event 
 */
let rpgShopGui = (event, player, page) => {
    player.openChestGUI(Text.of(Text.darkAqua('Shop')), 6, gui => {
        gui.playerSlots = true
        let playerSaveData = event.server.persistentData.playerData[player.stringUuid]
        if (page == 0) {
            let slotX = 0
            let slotY = 0
            let offerIndex = 0
            shopOffers[player.persistentData.activeRift].items.forEach(offer => {
                createShopButton(event, player, gui, 'item', shopOffers[player.persistentData.activeRift].items, offerIndex, slotX, slotY)
                offerIndex += 1
                slotX += 1
                if (slotX >= 9) {
                    slotX = 0
                    slotY += 1
                }
            })
        }
        gui.slot(0, 5, slot => {
            let icon
            if (page == 0) {
                icon = Item.of('minecraft:green_concrete').withName(Text.of(Text.green('Items')))
            } else {
                icon = Item.of('minecraft:diamond_sword').withName(Text.of(Text.green('Items')))
            }
            slot.item = icon
            slot.leftClicked = e => rpgShopGui(event, player, 0)
        })
        gui.slot(1, 5, slot => {
            let icon
            if (page == 1) {
                icon = Item.of('minecraft:green_concrete').withName(Text.of(Text.green('Upgrades')))
            } else {
                icon = Item.of('minecraft:smithing_table').withName(Text.of(Text.green('Upgrades')))
            }
            slot.item = icon
            slot.leftClicked = e => rpgShopGui(event, player, 1)
        })
        gui.slot(8, 5, slot => {
            slot.item = Item.of('minecraft:barrier').withName(Text.of(Text.darkAqua('Return')))
            slot.leftClicked = e => rpgMainMenuGui(event, player, 0)
        })
    })
}
/**
 * @param {Internal.ServerPlayer} player 
 * @param {Internal.NetworkEventJS} event 
 */
function createShopButton(event, player, gui, buttonType, offers, index, x, y) {
    let playerSaveData = event.server.persistentData.playerData[player.stringUuid]
    let playerShopData = playerSaveData.rifts[player.persistentData.activeRift].shopData
    let playerCurrencies = playerSaveData.rifts[player.persistentData.activeRift].currencies
    let offer = offers[index]
    if (buttonType == 'item') {
        if (offer.type == 'basic') {
            gui.slot(x, y, slot => {
                let icon = Item.of(offer.id).withName(getColoredText({ text: offer.amount + 'x ' + offer.name.text, color: offer.name.color }))
                icon = icon.withLore(Text.gray('Costs: ').append(getColoredText({ text: formatBigDecimal(BigDecimal(offer.price)) + ' / ' + formatBigDecimal(BigDecimal(playerCurrencies[offer.currency])) + ' ' + currencies[offer.currency].name.text, color: currencies[offer.currency].name.color })))
                offer.tooltip.forEach(line => {
                    icon = icon.withLore(getColoredText(line))
                })
                slot.item = icon
                slot.leftClicked = e => {
                    if (BigDecimal(playerCurrencies[offer.currency]).compareTo(BigDecimal(offer.price)) >= 0) {
                        playerCurrencies[offer.currency] = BigDecimal(playerCurrencies[offer.currency]).subtract(BigDecimal(offer.price))
                        player.give(Item.of(offer.id, offer.amount))
                    } else {
                        player.notify(Text.red('Could not purchase'), getColoredText({ text: 'Not enough ' + currencies[offer.currency].name.text, color: currencies[offer.currency].name.color }))
                    }
                }
            })
        } else if (offer.type == 'restocking') {
            if (!playerShopData[index + 'item']) {
                playerShopData[index + 'item'] = { stock: offer.stock, timer: timeToTicks(offer.timer, offer.unit), lastTimeCalculated: getServerTimeInTicks(event) }
            }
            let playerOfferData = playerShopData[index + 'item']
            if (playerOfferData.stock == offer.stock) {
                playerOfferData.lastTimeCalculated = getServerTimeInTicks(event)
            }
            playerOfferData.timer = BigDecimal(playerOfferData.timer).subtract(getServerTimeInTicks(event).subtract(BigDecimal(playerOfferData.lastTimeCalculated)))
            if (BigDecimal(0).compareTo(BigDecimal(playerOfferData.timer)) >= 0) {
                playerOfferData.stock = offer.stock
                playerOfferData.timer = timeToTicks(offer.timer, offer.unit)
            }
            gui.slot(x, y, slot => {
                let icon = Item.of(offer.id).withName(getColoredText({ text: offer.amount + 'x ' + offer.name.text, color: offer.name.color }))
                icon = icon.withLore(Text.gray('Costs: ').append(getColoredText({ text: formatBigDecimal(BigDecimal(offer.price)) + ' / ' + formatBigDecimal(BigDecimal(playerCurrencies[offer.currency])) + ' ' + currencies[offer.currency].name.text, color: currencies[offer.currency].name.color })))
                icon = icon.withLore(Text.blue('Stock ' + playerOfferData.stock + ' / ' + offer.stock))
                icon = icon.withLore(Text.blue('Restocks every ' + offer.timer + ' ' + offer.unit))
                offer.tooltip.forEach(line => {
                    icon = icon.withLore(getColoredText(line))
                })
                slot.item = icon
                slot.leftClicked = e => {
                    if (playerOfferData.stock >= 1) {
                        if (BigDecimal(playerCurrencies[offer.currency]).compareTo(BigDecimal(offer.price)) >= 0) {
                            playerCurrencies[offer.currency] = BigDecimal(playerCurrencies[offer.currency]).subtract(BigDecimal(offer.price))
                            playerOfferData.stock -= 1
                            player.give(Item.of(offer.id, offer.amount))
                        } else {
                            player.notify(Text.red('Could not purchase'), getColoredText({ text: 'Not enough ' + currencies[offer.currency].name.text, color: currencies[offer.currency].name.color }))
                        }
                    } else {
                        player.notify(Text.red('Could not purchase'), Text.red('Out of stock'))
                    }
                }
            })
        } else if (offer.type == 'limited_stock') {
            if (!playerShopData[index + 'item']) {
                playerShopData[index + 'item'] = { stock: offer.stock }
            }
            let playerOfferData = playerShopData[index + 'item']
            gui.slot(x, y, slot => {
                let icon = Item.of(offer.id).withName(getColoredText({ text: offer.amount + 'x ' + offer.name.text, color: offer.name.color }))
                icon = icon.withLore(Text.gray('Costs: ').append(getColoredText({ text: formatBigDecimal(BigDecimal(offer.price)) + ' / ' + formatBigDecimal(BigDecimal(playerCurrencies[offer.currency])) + ' ' + currencies[offer.currency].name.text, color: currencies[offer.currency].name.color })))
                icon = icon.withLore(Text.blue('Stock ' + playerOfferData.stock + ' / ' + offer.stock))
                icon = icon.withLore(Text.blue('Limited stock'))
                offer.tooltip.forEach(line => {
                    icon = icon.withLore(getColoredText(line))
                })
                slot.item = icon
                slot.leftClicked = e => {
                    if (playerOfferData.stock >= 1) {
                        if (BigDecimal(playerCurrencies[offer.currency]).compareTo(BigDecimal(offer.price)) >= 0) {
                            playerCurrencies[offer.currency] = BigDecimal(playerCurrencies[offer.currency]).subtract(BigDecimal(offer.price))
                            playerOfferData.stock -= 1
                            player.give(Item.of(offer.id, offer.amount))
                        } else {
                            player.notify(Text.red('Could not purchase'), getColoredText({ text: 'Not enough ' + currencies[offer.currency].name.text, color: currencies[offer.currency].name.color }))
                        }
                    } else {
                        player.notify(Text.red('Could not purchase'), Text.red('Out of stock'))
                    }
                }
            })
        }
    }
}
/**
 * @param {Internal.ServerPlayer} player 
 * @param {Integer} page 
 * @param {Internal.NetworkEventJS} event 
 */
let rpgStatsGui = (event, player, page) => {
    player.openChestGUI(Text.of(Text.darkAqua('Stats overview')), 6, gui => {
        gui.playerSlots = true
        let playerSaveData = event.server.persistentData.playerData[player.stringUuid]
        let playerStats = playerSaveData.rifts[player.persistentData.activeRift].stats
        let icon1 = Item.of('minecraft:emerald').withName(Text.of(Text.green('Currencies:')))
        let icon2 = Item.of('minecraft:diamond').withName(Text.of(Text.aqua('Skill points:')))
        for (let key in currencies) {
            let activeCurrency = currencies[key]
            let add = true
            if (activeCurrency.requirementType == 'storyProgress') {
                if (playerSaveData.rifts[player.persistentData.activeRift].mainQuestProgress < activeCurrency.requirementAmount) {
                    add = false
                }
            }
            if (add == true) {
                if (activeCurrency.type == 'currency') {
                    icon1 = icon1.withLore(getColoredText({ text: activeCurrency.name.text + ': ', color: activeCurrency.name.color }).append(Text.aqua(formatBigDecimal(BigDecimal(playerSaveData.rifts[player.persistentData.activeRift].currencies[key])))))
                } else if (activeCurrency.type == 'skillPoint') {
                    icon2 = icon2.withLore(getColoredText({ text: activeCurrency.name.text + ': ', color: activeCurrency.name.color }).append(Text.aqua(formatBigDecimal(BigDecimal(playerSaveData.rifts[player.persistentData.activeRift].currencies[key])))))
                }
            }
        }
        gui.slot(0, 0, slot => {
            slot.item = icon1
        })
        gui.slot(1, 0, slot => {
            slot.item = icon2
        })
        let slotX = 0
        let slotY = 1
        for (let key in playerStats) {
            let playerStat = playerStats[key]
            let dataStat = stats[key]
            let icon = Item.of(dataStat.icon).withName(getColoredText(dataStat.name))
            icon = icon.withLore(Text.aqua('Amount: ' + playerStat.amount))
            dataStat.description.forEach(line => {
                icon = icon.withLore(getColoredText(line))
            })
            gui.slot(slotX, slotY, slot => {
                slot.item = icon
            })
            slotX += 1
            if (slotX >= 9) {
                slotX = 0
                slotY += 1
            }
        }
        gui.slot(8, 5, slot => {
            slot.item = Item.of('minecraft:barrier').withName(Text.of(Text.darkAqua('Return')))
            slot.leftClicked = e => rpgMainMenuGui(event, player, 0)
        })
    })
}
/**
 * @param {Internal.ServerPlayer} player 
 * @param {Integer} page 
 * @param {Internal.NetworkEventJS} event
 */
let rpgQuestMenuGui = (event, player, page) => {
    let quests = event.server.persistentData.playerData[player.stringUuid].rifts[player.persistentData.activeRift].quests
    player.openChestGUI(Text.of(Text.darkAqua('Quest overview')), 6, gui => {
        gui.playerSlots = true
        gui.slot(8, 5, slot => {
            slot.item = Item.of('minecraft:barrier').withName(Text.of(Text.darkAqua('Return')))
            slot.leftClicked = e => rpgMainMenuGui(event, player, 0)
        })
        let questIndex = 0
        let slotX = 0
        let slotY = 0
        quests.forEach(quest => {
            quest.index = questIndex
            gui.slot(slotX, slotY, slot => {
                slot.item = getQuestIcon(event, player, quest, true, false)
                slot.leftClicked = e => rpgQuestDetailsMenu(event, player, 0, quest.index)
            })
            questIndex += 1
            slotX += 1
            if (slotX >= 9) {
                slotX = 0
                slotY += 1
            }
        })
    })
}
/**
 * @param {Internal.ServerPlayer} player 
 * @param {Integer} page 
 * @param {Internal.NetworkEventJS} event
 */
let rpgQuestDetailsMenu = (event, player, page, questIndex) => {
    let quests = event.server.persistentData.playerData[player.stringUuid].rifts[player.persistentData.activeRift].quests
    let quest = quests[questIndex]
    player.openChestGUI(getColoredText(quest.name), 3, gui => {
        gui.playerSlots = true
        gui.slot(8, 2, slot => {
            slot.item = Item.of('minecraft:barrier').withName(Text.of(Text.darkAqua('Return')))
            slot.leftClicked = e => rpgQuestMenuGui(event, player, 0)
        })
        gui.slot(0, 0, slot => {
            slot.item = getQuestIcon(event, player, quest, false, false)
        })
        let slotX = 0
        quest.steps.forEach(step => {
            gui.slot(slotX, 1, slot => {
                slot.item = questFormateStep(event, player, step, true, true)
            })
            slotX += 1
        })
        if (quest.type == 'bonus_quest') {
            gui.slot(8, 0, slot => {
                slot.item = Item.of('minecraft:red_concrete').withName(Text.of(Text.red('Cancel quest')))
                slot.leftClicked = e => {
                    delete quests[questIndex]
                    rpgQuestMenuGui(event, player, 0)
                }
            })
        }
        if (hasQuestRewards(quest)) {
            gui.slot(1, 0, slot => {
                let icon = Item.of('minecraft:chest').withName(Text.of(Text.gray('Quest rewards')))
                quest.rewards.forEach(reward => {
                    icon = questFormateReward(icon, reward)
                })
                slot.item = icon
                slot.leftClicked = e => {
                    if (quest.completed) {
                        quest.rewards.forEach(reward => {
                            questGiveReward(event, player, reward)
                        })
                        delete quests[questIndex]
                        rpgQuestMenuGui(event, player, 0)
                    }
                }
            })
        }
    })
}
/**
 * @param {Internal.ServerPlayer} player 
 * @param {Integer} page 
 * @param {Internal.NetworkEventJS} event 
 */
let rpgOperatorGui = (event, player, page) => {
    player.openChestGUI(Text.of(Text.red('Operator gui')), 6, gui => {
        gui.playerSlots = true
        gui.slot(0, 0, slot => {
            slot.item = Item.of('minecraft:paper').withName(Text.of(Text.red('Reset player quests')))
            slot.leftClicked = e => selectPlayerGui(event, player, 0, 'reset_player_quests')
        })
        gui.slot(1, 0, slot => {
            slot.item = Item.of('minecraft:zombie_spawn_egg').withName(Text.of(Text.red('Reset npcs')))
            slot.leftClicked = e => updateNPCS(event)
        })
        gui.slot(2, 0, slot => {
            slot.item = Item.of('minecraft:book').withName(Text.of(Text.red('Open test dialogue')))
            slot.leftClicked = e => selectPlayerGui(event, player, 0, 'open_test_dialogue')
        })
        gui.slot(3, 0, slot => {
            slot.item = Item.of('minecraft:red_concrete').withName(Text.of(Text.red('Reset player')))
            slot.leftClicked = e => selectPlayerGui(event, player, 0, 'reset_player')
        })
        gui.slot(4, 0, slot => {
            slot.item = Item.of('minecraft:red_concrete').withName(Text.of(Text.red('Reset server'))).withLore(Text.red('Caution, can break things'))
            slot.leftClicked = e => {
                event.server.runCommandSilent('/kubejs persistent_data server remove *')
                setUpServer(event)
            }
        })
        gui.slot(5, 0, slot => {
            slot.item = Item.of('minecraft:emerald').withName(Text.of(Text.yellow('Give 1000 coins')))
            slot.leftClicked = e => selectPlayerGui(event, player, 0, 'give_coins')
        })
        gui.slot(6, 0, slot => {
            slot.item = Item.of('minecraft:clock').withName(Text.of(Text.yellow('Get server time')))
            slot.leftClicked = e => selectPlayerGui(event, player, 0, 'get_server_time')
        })
        gui.slot(7, 0, slot => {
            slot.item = Item.of('minecraft:paper').withName(Text.of(Text.yellow('Give 1k light mele combat xp')))
            slot.leftClicked = e => selectPlayerGui(event, player, 0, 'give_light_mele_xp')
        })
        gui.slot(8, 0, slot => {
            slot.item = Item.of('minecraft:chest').withName(Text.of(Text.aqua('Start test cutscene')))
            slot.leftClicked = e => selectPlayerGui(event, player, 0, 'test_cutscene')
        })
        gui.slot(0, 1, slot => {
            slot.item = Item.of('minecraft:diamond').withName(Text.of(Text.yellow('Give 10 skill and evolution points')))
            slot.leftClicked = e => selectPlayerGui(event, player, 0, 'give_skill_points')
        })
        gui.slot(8, 5, slot => {
            slot.item = Item.of('minecraft:barrier').withName(Text.of(Text.darkAqua('Return')))
            slot.leftClicked = e => rpgMainMenuGui(event, player, 0)
        })
    })
}
/**
 * @param {Internal.ServerPlayer} player 
 * @param {Integer} page 
 * @param {Internal.NetworkEventJS} event 
 */
let selectPlayerGui = (event, player, page, usecase) => {
    player.openChestGUI(Text.of(Text.red('Select player')), 6, gui => {
        gui.playerSlots = true
        let drawX = 0
        let drawY = 0
        event.server.players.forEach(selectedPlayer => {
            gui.slot(drawX, drawY, slot => {
                slot.item = Item.playerHead(player.username).withName(Text.aqua(player.username))
                slot.leftClicked = e => {
                    if (usecase == 'reset_player_quests') {
                        event.server.persistentData.playerData[selectedPlayer.stringUuid].rifts[player.persistentData.activeRift].quests = testQuests
                        rpgOperatorGui(event, player, 0)
                    } else if (usecase == 'open_test_dialogue') {
                        rpgDialogueGui(event, selectedPlayer, 0, Object.assign({}, testChatData), false)
                    } else if (usecase == 'reset_player') {
                        selectedPlayer.persistentData.initiated = false
                        setUpPlayer(event, selectedPlayer)
                    } else if (usecase == 'give_coins') {
                        event.server.persistentData.playerData[player.stringUuid].rifts[player.persistentData.activeRift].currencies.coins = BigDecimal(event.server.persistentData.playerData[player.stringUuid].rifts[player.persistentData.activeRift].currencies.coins).add(BigDecimal(1000))
                        rpgOperatorGui(event, player, 0)
                    } else if (usecase == 'get_server_time') {
                        sendTimeToPlayer(event, player)
                        rpgOperatorGui(event, player, 0)
                    } else if (usecase == 'give_light_mele_xp') {
                        giveXp(event, player, 1000, 'lightMeleCombat')
                        rpgOperatorGui(event, player, 0)
                    } else if (usecase == 'test_cutscene') {
                        startCutscene(event, player, 'test1')
                    } else if (usecase == 'give_skill_points') {
                        event.server.persistentData.playerData[player.stringUuid].rifts[player.persistentData.activeRift].currencies.skill_points = BigDecimal(event.server.persistentData.playerData[player.stringUuid].rifts[player.persistentData.activeRift].currencies.skill_points).add(BigDecimal(10))
                        event.server.persistentData.playerData[player.stringUuid].rifts[player.persistentData.activeRift].currencies.evolution_points = BigDecimal(event.server.persistentData.playerData[player.stringUuid].rifts[player.persistentData.activeRift].currencies.evolution_points).add(BigDecimal(10))
                        rpgOperatorGui(event, player, 0)
                    }
                }
            })
        })
        gui.slot(8, 5, slot => {
            slot.item = Item.of('minecraft:barrier').withName(Text.of(Text.darkAqua('Return')))
            slot.leftClicked = e => {
                //if (usecase == 'reset_player_quests' || usecase == 'open_test_dialogue' || usecase == 'reset_player') {
                rpgOperatorGui(event, player, 0)
                //}
            }
        })
    })
}
/**
 * @param {Internal.ServerPlayer} player 
 * @param {Integer} page 
 * @param {Object} chatData 
 * @param {Internal.NetworkEventJS} event 
 */
let rpgDialogueGui = (event, player, page, chatData, isCutscene) => {
    player.openChestGUI(getColoredText(chatData.npcName), 2, gui => {
        gui.playerSlots = true
        let canBeClosed = false
        gui.closed = () => {
            if (canBeClosed == false) {
                event.server.scheduleInTicks(1, e => {
                    rpgDialogueGui(event, player, page, chatData, isCutscene)
                })
                player.notify(Text.red('Error'), Text.red('You can`t just close a converstion'))
            }
        }
        if (!chatData.activeSentence) {
            chatData.activeSentence = 0
        }
        let activeSentence = chatData.sentences[chatData.activeSentence]
        gui.slot(0, 0, slot => {
            let icon = Item.of('minecraft:paper').withName(getColoredText({ text: chatData.npcName.text + ':', color: chatData.npcName.color }))
            activeSentence.npc.forEach(line => {
                icon = icon.withLore(getColoredTextAdvanced(line, player))
            })
            slot.item = icon
        })
        let answerIndex = 0
        activeSentence.answers.forEach(answer => {
            answer.index = answerIndex
            gui.slot(answerIndex, 1, slot => {
                let icon = Item.of('minecraft:paper').withName(Text.gray('Answer ' + (answerIndex + 1)))
                answer.lines.forEach(line => {
                    icon = icon.withLore(getColoredTextAdvanced(line, player))
                })
                slot.item = icon
                slot.leftClicked = e => {
                    if (rpgDialogueAnswerSelection(event, player, chatData, answer.index, isCutscene) == true) {
                        if (isCutscene == true) {
                            cutsceneCompleteConversation(event, player)
                        }
                        canBeClosed = true
                        player.closeMenu()
                    }
                }
            })
            answerIndex += 1
        })
    })
}
let rpgChooseDialogueGui = (event, player, page, dialogueOptions, npcName) => {
    player.openChestGUI(npcName, 2, gui => {
        gui.playerSlots = true
        let quests = event.server.persistentData.playerData[player.stringUuid].rifts[player.persistentData.activeRift].quests
        gui.slot(0, 0, slot => {
            slot.item = Item.of('minecraft:paper').withName(Text.aqua('What do you want to talk about?'))
        })
        let optionIndex = 0
        dialogueOptions.forEach(option => {
            option.index = optionIndex
            if (option.type == 'talk_quest') {
                let quest = quests[option.questIndex]
                gui.slot(optionIndex, 1, slot => {
                    let icon = Item.of('minecraft:paper').withName(getColoredText(quest.name))
                    icon = icon.withLore(getColoredText({ text: 'Do you want to talk about ' + quest.name.text + '?', color: quest.name.color }))
                    slot.item = icon
                    slot.leftClicked = e => openQuestDialogue(event, player, option.questIndex)
                })
            } else if (option.type == 'deliver_quest') {
                let quest = quests[option.questIndex]
                gui.slot(optionIndex, 1, slot => {
                    let icon = Item.of('minecraft:paper').withName(getColoredText(quest.name))
                    icon = icon.withLore(getColoredText({ text: 'Do you want to talk about ' + quest.name.text + '?', color: quest.name.color }))
                    slot.item = icon
                    slot.leftClicked = e => {
                        let activeStep = quest.steps[quest.progress]
                        event.server.runCommandSilent(`clear ${player.username} ${activeStep.task.itemId} ${activeStep.task.amount}`)
                        openQuestDialogue(event, player, option.questIndex)
                    }
                })
            } else if (option.type == 'dialogue') {
                gui.slot(optionIndex, 1, slot => {
                    let icon = Item.of('minecraft:paper').withName(getColoredText(option.dialogue.title))
                    icon = icon.withLore(getColoredText({ text: 'Do you want to talk about ' + option.dialogue.title.text + '?', color: option.dialogue.title.color }))
                    slot.item = icon
                    slot.leftClicked = e => rpgDialogueGui(event, player, 0, option.dialogue, false)
                })
            }
            optionIndex += 1
        })
    })
}
function openQuestDialogue(e, player, questIndex) {
    let quests = e.server.persistentData.playerData[player.stringUuid].rifts[player.persistentData.activeRift].quests
    let quest = quests[questIndex]
    let activeStep = quest.steps[quest.progress]
    rpgDialogueGui(e, player, 0, Object.assign({}, activeStep.task.dialogue), false)
    activeStep.task.progress = activeStep.task.amount
    questTestForCompletion(e, quest, player)
    removeQuests(e, player)
}
function hasQuestRewards(quest) {
    if (quest.rewards) {
        let hasReward = false
        quest.rewards.forEach(reward => {
            if (reward.type == 'item' || reward.type == 'currency' || reward.type == 'teleportation_point') {
                hasReward = true
            }
        })
        if (hasReward == true) {
            return true
        }
    }
    return false
}
function questGiveReward(e, player, reward) {
    if (reward.type == 'item') {
        player.give(Item.of(reward.id, reward.amount))
    } else if (reward.type == 'currency') {
        let playerData = e.server.persistentData.playerData[player.stringUuid]
        playerData.rifts[player.persistentData.activeRift].currencies[reward.id] = BigDecimal(`${playerData.rifts[player.persistentData.activeRift].currencies[reward.id]}`).add(BigDecimal(BigDecimal(`${reward.amount}`)))
    } else if (reward.type == 'teleportation_point') {
        let playerData = e.server.persistentData.playerData[player.stringUuid]
        playerData.rifts[player.persistentData.activeRift].teleportationPoints[reward.id].unlocked = true
        playerData.rifts[player.persistentData.activeRift].teleportationPoints.unlocked = true
    } else if (reward.type == 'side_quest_completed') {
        let playerData = e.server.persistentData.playerData[player.stringUuid]
        playerData.rifts[player.persistentData.activeRift].sideQuestProgress.push(reward.value)
    } else if (reward.type == 'story_quest_progress') {
        let playerData = e.server.persistentData.playerData[player.stringUuid]
        playerData.rifts[player.persistentData.activeRift].mainQuestProgress = reward.value
    }
}
function questFormateReward(icon, reward) {
    if (reward.type == 'item') {
        icon = icon.withLore(Text.green(reward.amount + 'x ' + reward.name))
    } else if (reward.type == 'currency') {
        icon = icon.withLore(getColoredText({ text: formatBigDecimal(BigDecimal(reward.amount)) + ' ' + currencies[reward.id].name.text, color: currencies[reward.id].name.color }))
    } else if (reward.type == 'teleportation_point') {
        icon = icon.withLore(Text.darkPurple('Unlocks teleportation point: '))
        icon = icon.withLore(getColoredText(teleportationPoints[reward.id].name))
    }
    return icon
}
function rpgDialogueAnswerSelection(event, player, chatData, answerIndex, isCutscene) {
    let activeSentence = chatData.sentences[chatData.activeSentence]
    let activeAnswer = activeSentence.answers[answerIndex]
    if (activeAnswer.result == 'close') {
        return true
    } else if (activeAnswer.result == 'setSentence') {
        chatData.activeSentence = activeAnswer.sentence
        rpgDialogueGui(event, player, 0, chatData, isCutscene)
    } else if (activeAnswer.result == 'giveQuest') {
        let quests = event.server.persistentData.playerData[player.stringUuid].rifts[player.persistentData.activeRift].quests
        quests.push(activeAnswer.quest)
        if (activeAnswer.mode == 'close') {
            return true
        } else if (activeAnswer.mode == 'setSentence') {
            chatData.activeSentence = activeAnswer.sentence
            rpgDialogueGui(event, player, 0, chatData, isCutscene)
        }
    } else if (activeAnswer.result == 'giveQuestId') {
        let quests = event.server.persistentData.playerData[player.stringUuid].rifts[player.persistentData.activeRift].quests
        quests.push(quests[activeAnswer.questId])
        if (activeAnswer.mode == 'close') {
            return true
        } else if (activeAnswer.mode == 'setSentence') {
            chatData.activeSentence = activeAnswer.sentence
            rpgDialogueGui(event, player, 0, chatData, isCutscene)
        }
    } else {
        player.notify(Text.red('Error'), Text.gray('Invalid sentence result'))
    }
}
function getColoredText(text) {
    return Text.of(text.text).color(text.color)
}
function getColoredTextAdvanced(text, player) {
    let changedText = text.text
    changedText = changedText.replace('///username', player.username)
    return Text.of(changedText).color(text.color)
}
function getQuestIcon(e, player, quest, displayDetails, displayDescription) {
    let icon = Item.of(quest.icon).withName(getColoredText(quest.name))
    if (quest.type == 'bonus_quest') {
        icon = icon.withLore(Text.of(Text.gray('Bonus quest')))
    } else if (quest.type == 'side_quest') {
        icon = icon.withLore(Text.of(Text.aqua('Side quest')))
    } else if (quest.type == 'story_quest') {
        icon = icon.withLore(Text.of(Text.green('Story quest')))
    }
    icon = icon.withLore(Text.of(Text.blue('Step ' + quest.progress + ' / ' + quest.steps.length)))
    quest.description.forEach(line => {
        icon = icon.withLore(getColoredText(line))
    })
    if (quest.completed) {
        icon = icon.withLore(Text.of(Text.green('You completed this quest')))
    } else {
        icon = icon.withLore(Text.of(Text.blue('Next step:')))
        icon = questFormateStepWithExistingIcon(e, player, quest.steps[quest.progress], icon, displayDetails, displayDescription)
    }
    return icon
}
function questFormateStepWithExistingIcon(e, player, step, icon, displayDetails, displayDescription) {
    icon = icon.withLore(getColoredText(step.name))
    if (displayDetails == true) {
        icon = questFormateStepType(e, player, step, icon)
        if (displayDescription == true) {
            step.description.forEach(line => {
                icon = icon.withLore(getColoredText(line))
            })
        }
    }
    return icon
}
function questFormateStep(e, player, step, displayDetails, displayDescription) {
    let icon
    if (step.completed) {
        icon = Item.of(step.iconCompleted)
    } else {
        icon = Item.of(step.icon)
    }
    icon = icon.withName(getColoredText(step.name))
    if (displayDetails == true) {
        icon = questFormateStepType(e, player, step, icon)
    }
    if (displayDescription == true) {
        step.description.forEach(line => {
            icon = icon.withLore(getColoredText(line))
        })
    }
    return icon
}
function questFormateStepType(e, player, step, icon) {
    if (step.task.type == 'kill_mobs') {
        icon = icon.withLore(Text.of(Text.red('Kill ' + step.task.amount + ' ' + step.task.name)))
        icon = icon.withLore(Text.of(Text.blue(step.task.name.charAt(0).toUpperCase() + step.task.name.slice(1) + ' killed: ' + step.task.progress + ' / ' + step.task.amount)))
    } else if (step.task.type == 'collect_items') {
        icon = icon.withLore(Text.of(Text.red('Collect ' + step.task.amount + ' ' + step.task.name)))
        icon = icon.withLore(Text.of(Text.blue(step.task.name.charAt(0).toUpperCase() + step.task.name.slice(1) + ' collected: ' + step.task.progress + ' / ' + step.task.amount)))
    } else if (step.task.type == 'talk_to_npc') {
        icon = icon.withLore(Text.of(Text.red('Talk to ' + step.task.name)))
    } else if (step.task.type == 'deliver_items') {
        icon = icon.withLore(Text.of(Text.red('Deliver ' + step.task.amount + 'x ' + step.task.itemName + ' to ' + step.task.name)))
        icon = icon.withLore(Text.of(Text.blue(step.task.itemName.charAt(0).toUpperCase() + step.task.itemName.slice(1) + ' in your inventory: ' + step.task.inInventory + ' / ' + step.task.amount)))
    } else if (step.task.type == 'reach_level') {
        let playerSaveData = e.server.persistentData.playerData[player.stringUuid]
        icon = icon.withLore(Text.of(Text.red('Reach ' + levels[step.task.id].name.text + ' level ' + step.task.amount)))
        icon = icon.withLore(Text.of(Text.blue(levels[step.task.id].name.text.charAt(0).toUpperCase() + levels[step.task.id].name.text.slice(1) + ' level: ' + playerSaveData.rifts[player.persistentData.activeRift].levels[step.task.id].level + ' / ' + step.task.amount)))
    }
    return icon
}
var headLat = Item.playerHead('LatvianModder')
var headBramsy = Item.playerHead('Bramsy')
var arrowLeft = Item.playerHeadFromSkinHash('3866a889e51ca79c5d200ea6b5cfd0a655f32fea38b8138598c72fb200b97b9')
var arrowRight = Item.playerHeadFromSkinHash('dfbf1402a04064cebaa96b77d5455ee93b685332e264c80ca36415df992fb46c')
/**
 * @param {Internal.ServerPlayer} player 
 * @param {Integer} page 
 * @param {Internal.NetworkEventJS} e 
 * @param {} e 
 */
let customGui = (e, player, page) => {
    player.openChestGUI('KubeJS Chest GUI ☺', 6, gui => {
        gui.playerSlots = true
        gui.button(0, 9, arrowLeft, 'Previous Page', e => {
            if (page > 0) {
                customGui(e, player, page - 1)
            }
        })
        gui.button(8, 9, arrowRight, 'Next Page', e => {
            if (page < 14) {
                customGui(e, player, page + 1)
            }
        })
        gui.button(4, 9, Item.of('minecraft:light', `{BlockStateTag:{level:"${page + 1}"}}`), 'Page ' + (page + 1), e => {
            if (page !== 0) {
                customGui(e, player, 0)
            }
        })
        if (page == 0) {
            // Slot at X0 Y0
            gui.slot(0, 0, slot => {
                slot.item = Item.of('minecraft:gold_block').withName('Test Button')
                // slot.leftClicked = e => player.notify('Left-clicked')
                slot.rightClicked = e => player.notify('Right-clicked')
                slot.middleClicked = e => player.notify('Middle-clicked')
                slot.swapped = e => player.notify('Swapped with ' + e.button)
                slot.thrown = e => player.notify('Thrown')
                slot.shiftLeftClicked = e => player.notify('Shift-left-clicked')
                slot.shiftRightClicked = e => player.notify('Shift-right-clicked')
                slot.doubleClicked = e => {
                    if (slot.item.id === 'minecraft:gold_block') {
                        slot.item = Item.of('minecraft:diamond_block').withName('Test Button')
                    } else {
                        slot.item = Item.of('minecraft:gold_block').withName('Test Button')
                    }
                }
            })

            // Shortcut for left-click event with icon and name
            gui.button(8, 0, 'minecraft:emerald_block', 'Test Button II', e => {
                //player.notify('Left-clicked second button')

                if (gui.mouseItem.empty) {
                    gui.mouseItem = headLat
                } else {
                    gui.mouseItem = Item.empty
                }
            })

            gui.button(8, 1, headLat, 'Test Button III', e => {
                gui.mouseItem = headBramsy
            })
        }
    })
}