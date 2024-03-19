const LivingEntity = Java.loadClass("net.minecraft.world.entity.LivingEntity");
const AttributeModifier = Java.loadClass('net.minecraft.world.entity.ai.attributes.AttributeModifier')
const AttributeModifier$Operation = Java.loadClass('net.minecraft.world.entity.ai.attributes.AttributeModifier$Operation')
const EquipmentSlot = Java.loadClass('net.minecraft.world.entity.EquipmentSlot')
function updateItems(e, player) {
    for (let i = 0; i <= 35; i++) {
        let item = player.getSlot(i).get()
        if (item.hasNBT()) {
            player.getSlot(i).set(updateItem(e, player, item))
        }
    }
    for (let i = 99; i <= 103; i++) {
        let item = player.getSlot(i).get()
        if (item.hasNBT()) {
            player.getSlot(i).set(updateItem(e, player, item))
        }
    }
    recalculatePlayerStats(e,player)
}
function updateItem(e,player,item) {
    let nbt = item.nbt
    if(nbt.customDataId != undefined) {
        let customData = e.server.persistentData.playerData[player.stringUuid].itemDetails[nbt.customDataId]
        if(!nbt.display) {
            nbt.display = {}
        }
        nbt.display.Lore = []
        nbt.AttributeModifiers = []
        if(customData.types) {
            let typesText = ""
            customData.types.forEach(type => {
                typesText = typesText+types[type.asString].icon
            })
            item = item.withLore(Text.white(typesText))
        }
        if(customData.level) {
            if(customData.xp >= customData.maxXp) {
                customData.level += 1
                customData.xp = 0
                customData.maxXp = 10*Math.pow(1.25,customData.level)
                let reward = customData.levelUpRewards[Math.floor(Math.random()*customData.levelUpRewards.length)]
                reward.owned += 1
                if(customData[reward.id]) {
                    customData[reward.id] += reward.amount
                } else {
                    customData[reward.id] = reward.amount
                }
            }
            item = item.withLore(Text.aqua(`Level: ${customData.level}`))
            item = item.withLore(Text.blue(`Xp: ${customData.xp} / ${customData.maxXp}`))
        }
        if(itemTypes.wands.includes(customData.type)) {
            item = item.withLore(Text.blue(`Mana cost: ${customData.manaCost}`))
            if(customData.speed) {
                item = item.withLore(Text.yellow(`Speed: ${customData.speed}`))
            }
        }
        if(customData.armor) {
            if(itemTypes.armor.includes(customData.type)) {
                //item.addAttributeModifier("minecraft:generic.armor",new AttributeModifier('Armor',customData.armor,AttributeModifier$Operation.ADDITION),LivingEntity.getEquipmentSlotForItem(item))
                item = item.withLore(Text.blue('+'+customData.armor+' armor'))
            }
        }
        if(customData.luck) {
            if(itemTypes.armor.includes(customData.type)) {
                item = item.withLore(Text.yellow('+'+customData.luck+' luck'))
            }
        }
        if(customData.damage) {
            if(itemTypes.meleWeapons.includes(customData.type)) {
                //item.addAttributeModifier("minecraft:generic.attack_damage",new AttributeModifier('Damage',customData.damage,AttributeModifier$Operation.ADDITION),EquipmentSlot.MAINHAND)
                item = item.withLore(Text.red('+'+customData.damage+' damage'))
            } else if(itemTypes.wands.includes(customData.type)) {
                item = item.withLore(Text.red('+'+customData.damage+' damage'))
            }
        }
        if(customData.effects) {
            for(let key in customData.effects) {
                let selectedEffect = customData.effects[key]
                item = item.withLore(getColoredText({text:'Inflicts '+formatTimeShort(selectedEffect.duration)+' '+effects[key].name.text+' level '+selectedEffect.level,color:effects[key].name.color}))
            }
        }
        if(customData.area) {
            item = item.withLore(Text.blue('Aoe area: '+customData.area+' blocks'))
        }
        if(customData.pierce) {
            item = item.withLore(Text.blue('Max pierce: '+customData.pierce+' enemies'))
        }
        if(customData.summons) {
            item = item.withLore(Text.aqua('Summons:'))
            customData.summons.forEach(summon => {
                if(summon.type == 'mele_servant' || summon.type == 'ranged_servant') {
                    let damageDirectory 
                    if(summon.type == 'mele_servant') {
                        item = item.withLore(Text.red('- '+summon.amount+'x mele servant'))
                        damageDirectory = summon.attack
                    } else if(summon.type == 'ranged_servant') {
                        damageDirectory = summon.projectile
                        item = item.withLore(Text.green('- '+summon.amount+'x ranged servant'))
                    }            
                    let typesText = "  "
                    damageDirectory.types.forEach(type => {
                        typesText = typesText+types[type.asString].icon
                    })
                    item = item.withLore(Text.white(typesText))
                    item = item.withLore(Text.red('  Damage: '+damageDirectory.damage.damage))
                    item = item.withLore(Text.yellow('  Range: '+summon.range))
                    item = item.withLore(Text.yellow('  Attack cooldown: '+formatTimeShort(summon.attackCooldown)))
                    item = item.withLore(Text.yellow('  Speed: '+damageDirectory.speed))
                } else if(summon.type == 'buff_servant') {
                    item = item.withLore(Text.blue('- '+summon.amount+'x buff servant'))
                    item = item.withLore(Text.blue('  Buffs:'))
                    summon.buffs.forEach(buff => {
                        item = item.withLore(getColoredText({text:'  -'+buff.amount+'x '+stats[buff.id].name.text,color:stats[buff.id].name.color}))
                    })
                }
                item = item.withLore(Text.aqua('  Duration: '+formatTimeShort(summon.duration)))
            })
        }
    }
    return item
}
function giveCustomItem(e,player,itemId,data) {
    let itemDirectory = e.server.persistentData.playerData[player.stringUuid].itemDetails
    let nextId = itemDirectory.nextId
    itemDirectory['id'+nextId] = data
    e.server.runCommandSilent(`/give ${player.username} ${itemId}{customDataId:${'id'+nextId}}`)
    itemDirectory.nextId += 1
}
function projectileTick(e) {
    if (e.server.persistentData.projectiles.length > 0) {
        let projectileIndex = -1
        e.server.persistentData.projectiles.forEach(projectile => {
            projectileIndex += 1
            for (let i = projectile.speed; i > 0; i--) {
                let multiplier = 0
                if (i >= 1) {
                    multiplier = 1
                } else {
                    multiplier = i
                }
                projectile.x += projectile.movementX * multiplier
                projectile.y += projectile.movementY * multiplier
                projectile.z += projectile.movementZ * multiplier
                let player = e.server.getPlayerList().getPlayer(projectile.owner)
                let dim = e.server.getLevel(projectile.dimension)
                let block = dim.getBlock(projectile.x, projectile.y, projectile.z)
                let box
                if(projectile.area) {
                    box = AABB.of(projectile.x - projectile.area, projectile.y - projectile.area, projectile.z - projectile.area, projectile.x + projectile.area, projectile.y + projectile.area, projectile.z + projectile.area)
                } else {
                    box = AABB.of(projectile.x - 0.1, projectile.y - 0.1, projectile.z - 0.1, projectile.x + 0.1, projectile.y + 0.1, projectile.z + 0.1)
                }
                let entitiesWithin = dim.getEntitiesWithin(box)
                let entitiesFound = entitiesWithin.length
                if (entitiesFound > 0) {
                    for (let i = 0; entitiesFound - 1 >= i; i++) {
                        if( projectile.remove == false){
                            let entity = entitiesWithin[i]
                            let isOwner = false
                            if(entity.isPlayer) {
                                if(entity.stringUuid == player.stringUuid) {
                                    isOwner = true
                                }
                            }
                            if (entity.isLiving() && !isOwner) {
                                let couldDamage
                                couldDamage = processDamage(e,player,entity,'wand',entity.health,projectile.wandId,{types:projectile.types,damage:projectile.damage,type:projectile.type})
                                if(couldDamage) {
                                    if(projectile.pierce) {
                                        if(projectile.pierce > 1) {
                                            projectile.pierce -= 1
                                        } else {
                                            projectile.remove = true
                                        }
                                    } else {
                                        projectile.remove = true
                                    }
                                }
                            }
                        }
                    }
                }
                if (!(e.server.runCommandSilent(`execute positioned ${projectile.x.toFixed(2)} ${projectile.y.toFixed(2)} ${projectile.z.toFixed(2)} in ${projectile.dimension} if entity @a[distance=..30]`))) {
                    projectile.remove = true
                } else if (!(block.id == 'minecraft:air')) {
                    projectile.remove = true
                }
                dim.sendParticles(projectile.particle,projectile.x,projectile.y,projectile.z,0,0,0,1,0)
            }
        })
        e.server.persistentData.projectiles = e.server.persistentData.projectiles.filter(projectile => !(projectile.remove == true))
    }
}
ItemEvents.rightClicked( e => {
    let player = e.entity
    let manaCost = 0
    let wandId = -1
    let speed = 0
    if (player.mainHandItem.hasNBT()) {
        if (player.mainHandItem.getNbt().customDataId) {
            let customDataId = player.mainHandItem.nbt.customDataId
            let customData = e.server.persistentData.playerData[player.stringUuid].itemDetails[customDataId]
            if(itemTypes.wands.includes(customData.type)) {
            wandId = customDataId
            manaCost = customData.manaCost
            speed = customData.speed
            if (player.persistentData.mana >= manaCost) {
                player.persistentData.mana -= manaCost
                let movement = calculateMovement(player.getViewXRot(1), player.getViewYRot(1))
                let projectileData = { particle:'minecraft:crit',types:customData.types,damage:getPlayerWandItemDamage(e,player,wandId),type: customData.type, owner: player.getStringUuid(), speed: speed, wandId: wandId, x: player.x, y: player.y + 1.5, z: player.z, movementX: movement.movementX, movementY: movement.movementY, movementZ: movement.movementZ, dimension: player.level.dimension.toString(),remove:false }
                if(customData.pierce) {
                    projectileData.pierce = customData.pierce
                }
                if(customData.area) {
                    projectileData.area = customData.area
                }
                if(projectileData.damage.damage >= 0 || projectileData.damage.effects) {
                    e.server.persistentData.projectiles.push(projectileData)
                }
                if(customData.summons) {
                    customData.summons.forEach(summon => {
                        if(summon.type == 'mele_servant') {
                            addServant(e,player,{type:'mele',drawRadius:0.15,points:5,verticalPoints:5,rotation:2.5,particle:'minecraft:flame',maxCooldown:summon.attackCooldown,range:summon.range,duration:summon.duration,attack:{speed:summon.attack.speed,types:summon.attack.types,damage:summon.attack.damage}},summon.amount)
                        } else if(summon.type == 'ranged_servant') {
                            addServant(e,player,{type:'ranged',drawRadius:0.15,points:5,verticalPoints:5,rotation:2.5,particle:'minecraft:soul_fire_flame',maxCooldown:summon.attackCooldown,range:summon.range,duration:summon.duration,projectile:{speed:summon.projectile.speed,types:summon.projectile.types,damage:summon.projectile.damage,particle:'minecraft:dragon_breath'}},summon.amount)
                        } else if(summon.type == 'buff_servant') {
                            addServant(e,player,{type:'buff',drawRadius:0.15,points:5,verticalPoints:5,rotation:2.5,particle:'minecraft:cloud',duration:summon.duration,buffs:summon.buffs},summon.amount)
                        }
                    })
                }
            } else {
                player.notify(Text.red('Cannot cast spell'),Text.red('Not enough mana'))
            }}
        }
    }
})
function recalculatePlayerStats(e, player) {
    player.persistentData.maxMana = ErrorProveAdding([10],[])
    player.persistentData.manaCooldown = 200
    player.persistentData.manaRegenRegen = 1
    player.persistentData.hpCooldown = 1200
    player.persistentData.hpRegenRegen = 0
    let customDataPath = e.server.persistentData.playerData[player.getUuid()].itemDetails
    for (let i = 99; i <= 103; i++) {
        let item = player.getSlot(i).get()
        if (item.hasNBT()) {
            let nbt = item.nbt
            if (nbt.customDataId) {
                let customDataId = nbt.customDataId
                let customData = customDataPath[customDataId]
                if (customData.maxMana) {
                    player.persistentData.maxMana += customData.maxMana
                }
                if (customData.manaCooldown) {
                    player.persistentData.manaCooldown -= customData.manaCooldown
                }
                if (customData.manaRegen) {
                    player.persistentData.manaRegenRegen += customData.manaRegen
                }
                if (customData.hpCooldown) {
                    player.persistentData.hpCooldown -= customData.hpCooldown
                }
                if (customData.hpRegen) {
                    player.persistentData.hpRegenRegen += customData.hpRegen
                }
            }
        }
    }
    if (player.persistentData.manaCooldown < 1) {
        player.persistentData.manaCooldown = 1
    }
    if (player.persistentData.mana > player.persistentData.maxMana) {
        player.persistentData.mana = player.persistentData.maxMana
    }
}