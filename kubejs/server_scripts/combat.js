/**
 * @param {Internal.Entity} attacker 
 * @param {Internal.Entity} attacked 
 * @param {String} wandId 
 * @param {String} damageType 
 * @param {Internal.NetworkEventJS} event 
 */
function processDamage(e,attacker,attacked,damageType,attackedHp,wandId,data,hitAoe) {
    if(attacker && attacked) {
        if(damageType == 'unknown') {
            return processDamageUnknown(e,attacker,attacked,damageType,attackedHp,data,hitAoe)
        } else if(damageType == 'wand') {
            return processDamageWand(e,attacker,attacked,damageType,attackedHp,wandId,data)
        } else return false
    } else return false
}
function processDamageUnknown(e,attacker,attacked,damageType,attackedHp,data,hitAoe) {
    let attackerTypes = []
    let attackedTypes = []
    if(attacker.isPlayer()) {
        let types = getMainHandItemTypes(e,attacker)
        types.forEach(type => {
            attackerTypes.push(type)
        })
    } else {
        let types = getEntityTypes(e,attacker)
        types.forEach(type => {
            attackerTypes.push(type)
        })
    }
    if(attacked.isPlayer()) {
        let types = getArmorItemTypes(e,attacked)
        types.forEach(type => {
            attackedTypes.push(type)
        })
    } else {
        let types = getEntityTypes(e,attacked)
        types.forEach(type => {
            attackedTypes.push(type)
        })
    }
    let typeDamageMultiplier = calculateTypeDamageMultiplier(attackerTypes,attackedTypes)
    let damage = 0
    let damageData
    let attackType = ''
    if(attacker.isPlayer()) {
        let playerData = e.server.persistentData.playerData[attacker.stringUuid]
        let itemDataPath = playerData.itemDetails
        let item = attacker.mainHandItem
        if(item.hasNBT()) {
            if(item.nbt.customDataId) {
                let itemCustomData = itemDataPath[item.nbt.customDataId]
                if(itemTypes.meleWeapons.includes(itemCustomData.type)) {
                    damageData = getPlayerMainHandItemDamage(e,attacker)
                    damage = damageData.damage
                    attackType = 'player'
                } else return false
            } else return false
        } else return false
    } else {
        if(attacker.persistentData.damage) {
           damage = attacker.persistentData.damage
           attackType = 'entity'
        } else return false
    }
    damage *= typeDamageMultiplier
    let damageBlocked = 0
    if(attacked.isPlayer()) {
        damageBlocked = getPlayerArmor(e,attacked).armor
        damage -= damageBlocked
    } else {
        if(attacked.persistentData.armor) {
            damage -= attacked.persistentData.armor
        }
    }
    if(damage <= 0) {
        damageBlocked += damage
        damage = 0
    }
    if(attackType == 'player') {
        let damageSource = attacked.damageSources().playerAttack(attacker)
        if(attackedHp - damage > 0) {
            attacked.health = attacked.health - damage
            attacked.attack(damageSource,0)
        } else {
            attacked.persistentData.dead = true
            attacked.attack(damageSource,damage)
        }
        attacked.persistentData.lastHit = attacker.getStringUuid()
    } else if(attackType == 'entity') {                        
        let damageSource = attacked.damageSources().mobAttack(attacker) 
        if(attackedHp - damage > 0) {
            attacked.health = attacked.health - damage
            attacked.attack(damageSource,0)
        } else {
            attacked.persistentData.dead = true
            if(!attacked.isPlayer()) {
                enemyDied(e,attacked)
            }
            attacked.attack(damageSource,damage)
        }
    } else return false     
    if(attacked.isPlayer()) {
        giveArmorXp(e,attacked,damageBlocked*0.1)
    }
    if(attacker.isPlayer()) {
        let xp = damage*0.1
        if(attackedHp < damage) {
            xp = attackedHp*0.1
        }
        givePlayerCombatXp(e,attacker,xp,false)
    }
    if(attacker.isPlayer()) {
        if(hitAoe != true) {
            if(damageData.area) {
                let dim = e.server.getLevel(attacked.level.dimension.toString())
                let box = AABB.of(attacked.x - damageData.area, attacked.y - damageData.area, attacked.z - damageData.area, attacked.x + damageData.area, attacked.y + damageData.area, attacked.z + damageData.area)
                let entitiesWithin = dim.getEntitiesWithin(box)
                let entitiesFound = entitiesWithin.length
                if (entitiesFound > 0) {
                    for (let i = 0; entitiesFound - 1 >= i; i++) {
                        let entity = entitiesWithin[i]
                        let isAttacker = false
                        let isAttacked = false
                        if(entity.stringUuid == attacker.stringUuid) {
                            isAttacker = true
                        }
                        if(entity.stringUuid == attacked.stringUuid) {
                            isAttacked = true
                        }
                        if(entity.isLiving() && !isAttacker && !isAttacked) {
                            let couldDamage
                            couldDamage = processDamage(e,attacker,entity,damageType,attackedHp,undefined,data,true)
                            if(couldDamage) {
                                if(damageData.pierce) {
                                    if(damageData.pierce > 2) {
                                        damageData.pierce -= 1
                                    } else {
                                        break
                                    }
                                } else {
                                    break
                                }
                            }
                        }
                    }
                }
            }
        }
        if(damageData.effects) {
            damageData.effects.forEach(effect => {
                if(attacked.potionEffects.isActive(effect.id)) {
                    attacked.potionEffects.add(effect.id,effect.duration+attacked.potionEffects.getDuration(effect.id),effect.level,false,true)
                } else {
                    attacked.potionEffects.add(effect.id,effect.duration,effect.level,false,true)
                }
            })
        }
    }
    drawCircle(e,{particle:'minecraft:crit',dimension:attacked.level.dimension.toString(),x:attacked.x,y:attacked.y,z:attacked.z,points:20,radius:1})
    return true
}
function processDamageWand(e,attacker,attacked,damageType,attackedHp,wandId,data) {
    let attackerTypes = []
    let attackedTypes = []
    let types = data.types
    types.forEach(type => {
        attackerTypes.push(type)
    })
    if(attacked.isPlayer()) {
        let types = getArmorItemTypes(e,attacked)
        types.forEach(type => {
            attackedTypes.push(type)
        })
    } else {
        let types = getEntityTypes(e,attacked)
        types.forEach(type => {
            attackedTypes.push(type)
        })
    }
    let typeDamageMultiplier = calculateTypeDamageMultiplier(attackerTypes,attackedTypes)
    let damage = 0
    let damageData
    let playerData = e.server.persistentData.playerData[attacker.stringUuid]
    let itemDataPath = playerData.itemDetails
    if(itemTypes.wands.includes(data.type) || itemTypes.rangedServants.includes(data.type) || itemTypes.meleServants.includes(data.type)) {
        damageData = data.damage
        damage = damageData.damage
    } else return false
    damage *= typeDamageMultiplier
    let damageBlocked = 0
    if(attacked.isPlayer()) {
        damageBlocked = getPlayerArmor(e,attacked).armor
        damage -= damageBlocked
    } else {
        if(attacked.persistentData.armor) {
            damage -= attacked.persistentData.armor
        }
    }
    if(damage <= 0) {
        damageBlocked += damage
        damage = 0
    }
    let damageSource = attacked.damageSources().playerAttack(attacker)
    if(attackedHp - damage > 0) {
        attacked.health = attacked.health - damage
        attacked.attack(damageSource,0)
    } else {
        attacked.persistentData.dead = true
        if(!attacked.isPlayer()) {
            enemyDied(e,attacked)
        }
        attacked.attack(damageSource,damage)
    }
    if(damageData.effects) {
        damageData.effects.forEach(effect => {
            if(attacked.potionEffects.isActive(effect.id)) {
                attacked.potionEffects.add(effect.id,effect.duration+attacked.potionEffects.getDuration(effect.id),effect.level,false,true)
            } else {
                attacked.potionEffects.add(effect.id,effect.duration,effect.level,false,true)
            }
        })
    }
    if(!attacked.isPlayer()) {
        attacked.persistentData.lastHit = attacker.getStringUuid()
    }    
    if(attacked.isPlayer()) {
        giveArmorXp(e,attacked,damageBlocked*0.1)
    }
    let xp = damage*0.1
    if(attackedHp < damage) {
        xp = attackedHp*0.1
    }
    givePlayerCombatXp(e,attacker,xp,true,wandId,{types:types})
    drawCircle(e,{particle:'minecraft:crit',dimension:attacked.level.dimension.toString(),x:attacked.x,y:attacked.y,z:attacked.z,points:20,radius:1})
    return true
}
function givePlayerCombatXp(e,player,amount,isWand,wandId,data) {
    // TODO Maybe put death bonus here
    if(!isWand) {
        let playerData = e.server.persistentData.playerData[player.stringUuid]
        let itemDataPath = playerData.itemDetails
        let item = player.mainHandItem
        let itemCustomData = itemDataPath[item.nbt.customDataId]
        if(itemTypes.lightMeleWeapons.includes(itemCustomData.type)) {
            giveXp(e,player,amount,'lightMeleCombat')
        } else if(itemTypes.heavyMeleWeapons.includes(itemCustomData.type)) {
            giveXp(e,player,amount,'heavyMeleCombat')
        }
        itemCustomData.xp += amount
        updateItems(e,player)
    } else {
        if(wandId) {
            let playerData = e.server.persistentData.playerData[player.stringUuid]
            let itemDataPath = playerData.itemDetails
            let itemCustomData = itemDataPath[wandId]
            if(itemTypes.wands.includes(itemCustomData.type)) {
                itemCustomData.types.forEach(type => {
                    giveXp(e,player,amount,type.asString+'Magic')
                })
            }
            itemCustomData.xp += amount
            updateItems(e,player)
        } else {
            data.types.forEach(type => {
                giveXp(e,player,amount,type.asString+'Magic')
            })
        }
    }
}
function enemyDied(e,enemy) {

}