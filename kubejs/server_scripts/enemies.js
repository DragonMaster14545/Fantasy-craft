function entitySpawnTick(e) {
    enemySpawns.forEach(spawn => {
        spawn.cooldown += 1
        if (spawn.cooldown >= spawn.maxCooldown) {
            spawn.cooldown = 0
            if (spawn.type == 'circle') {
                let dim = e.server.getLevel(spawn.dimension)
                let block = dim.getBlock(spawn.x, spawn.y, spawn.z)
                if (block.getPlayersInRadius(spawn.spawnRadius).length > 0) {
                    let box = AABB.of(spawn.x - spawn.radius, spawn.y - spawn.radius, spawn.z - spawn.radius, spawn.x + spawn.radius, spawn.y + spawn.radius, spawn.z + spawn.radius)
                    let entitiesWithin = dim.getEntitiesWithin(box)
                    entitiesWithin = entitiesWithin.filter(entity => !(entity.isPlayer()))
                    if(entitiesWithin.length <= spawn.maxEnemies) {
                        let point = getRandomPointInCircle(spawn)
                        spawnEnemy(e, point.x, point.y, point.z, spawn.dimension, spawn.entities[Math.floor(Math.random() * spawn.entities.length)])
                    }
                }
            } else if (spawn.type == 'rectangle') {
                let dim = e.server.getLevel(spawn.dimension)
                let block = dim.getBlock(spawn.x1, spawn.y1, spawn.z1)
                if (block.getPlayersInRadius(spawn.spawnRadius).length > 0) {
                    let box = AABB.of(spawn.x1-1, spawn.y1-1, spawn.z1-1, spawn.x2+1, spawn.y2+1, spawn.z2+1)
                    let entitiesWithin = dim.getEntitiesWithin(box)
                    entitiesWithin = entitiesWithin.filter(entity => !(entity.isPlayer() || !entity.isLiving()))
                    if(entitiesWithin.length <= spawn.maxEnemies) {
                        let point = getRandomPointInRectangle(spawn)
                        spawnEnemy(e, point.x, point.y, point.z, spawn.dimension, spawn.entities[Math.floor(Math.random() * spawn.entities.length)])
                    }
                }
            }
        }
    })
}
function spawnEnemy(e, x, y, z, dimension, data) {
    let dim = e.server.getLevel(dimension)
    let block = dim.getBlock(x, y, z)
    let entity = block.createEntity(data.id)
    let persistentData = entity.persistentData
    persistentData.tempStats = {}
    if (data.maxHp) {
        entity.getAttribute($Attributes.MAX_HEALTH).removeModifiers()
        entity.maxHealth = data.maxHp
        entity.health = data.maxHp
        persistentData.maxHp = data.maxHp
    }
    if (data.name) {
        entity.customName = getColoredText(data.name)
        persistentData.name = data.name
    }
    if (data.armor) {
        persistentData.armor = data.armor
    }
    if (data.damage) {
        persistentData.damage = data.damage
    }
    if (data.types) {
        persistentData.types = data.types
    }
    if (data.hpBars) {
        persistentData.hpBars = data.hpBars
        persistentData.activeHpBar = 1
    }
    if (data.spawnOnDeathAmount) {
        persistentData.spawnOnDeath = data.spawnOnDeath
        persistentData.spawnOnDeathAmount = data.spawnOnDeathAmount
    }
    if (data.effectsOnHit) {
        persistentData.effectsOnHit = data.effectsOnHit
    }
    if (data.summons) {
        persistentData.summons = data.summons
        persistentData.maxSummonCooldown = data.summonCooldown
        persistentData.summonCooldown = 0
        persistentData.summonAmount = data.summonAmount
    }
    if (data.projectiles) {
        persistentData.projectiles = data.projectiles
        persistentData.maxProjectileCooldown = data.projectileCooldown
        persistentData.projectileCooldown = 0
    }
    if (data.nearEnemyBoosts) {
        persistentData.nearEnemyBoosts = data.nearEnemyBoosts
        persistentData.nearEnemyBoostsDistance = data.nearEnemyBoostsDistance
        persistentData.nearEnemyBoostsParticle = data.nearEnemyBoostsParticle
        persistentData.maxNearEnemyBoostsCooldown = data.nearEnemyBoostsCooldown
        persistentData.nearEnemyBoostsCooldown = 0
    }
    if (data.selfHealAmount) {
        persistentData.selfHealAmount = data.selfHealAmount
        persistentData.selfHealParticle = data.selfHealParticle
        persistentData.maxSelfHealCooldown = data.selfHealCooldown
        persistentData.selfHealCooldown = 0
    }
    if (data.nearEnemyHealAmount) {
        persistentData.nearEnemyHealAmount = data.nearEnemyHealAmount
        persistentData.nearEnemyHealDistance = data.nearEnemyHealDistance
        persistentData.nearEnemyHealParticle = data.nearEnemyHealParticle
        persistentData.maxNearEnemyHealCooldown = data.nearEnemyHealCooldown
        persistentData.nearEnemyHealCooldown = 0
    }
    if (data.selfGiveEffects) {
        persistentData.selfGiveEffects = data.selfGiveEffects
        persistentData.selfGiveEffectsParticle = data.selfGiveEffectsParticle
        persistentData.maxSelfGiveEffectsCooldown = data.selfGiveEffectsCooldown
        persistentData.selfGiveEffectsCooldown = 0
    }
    if (data.nearEntityGiveEffects) {
        persistentData.nearEntityGiveEffects = data.nearEntityGiveEffects
        persistentData.nearEntityGiveEffectsType = data.nearEntityGiveEffectsType
        persistentData.nearEntityGiveEffectsDistance = data.nearEntityGiveEffectsDistance
        persistentData.nearEntityGiveEffectsParticle = data.nearEntityGiveEffectsParticle
        persistentData.maxNearEntityGiveEffectsCooldown = data.nearEntityGiveEffectsCooldown
        persistentData.nearEntityGiveEffectsCooldown = 0
    }
    if (data.traps) {
        persistentData.traps = data.traps
        persistentData.maxTrapCooldown = data.trapCooldown
        persistentData.trapCooldown = 0
    }
    if (data.producesCorpse) {
        persistentData.producesCorpse = data.producesCorpse
        persistentData.corpseDuration = data.corpseDuration
        persistentData.corpseParticle = data.corpseParticle
        persistentData.reviveParticle = data.reviveParticle
    }
    if (data.respawnDeadEnemiesCooldown) {
        persistentData.maxRespawnDeadEnemiesCooldown = data.respawnDeadEnemiesCooldown
        persistentData.respawnDeadEnemiesCooldown = 0
        persistentData.respawnDeadEnemiesAmount = data.respawnDeadEnemiesAmount
        persistentData.respawnDeadEnemiesDistance = data.respawnDeadEnemiesDistance
    }
    if (data.absorbable) {
        persistentData.absorbable = data.absorbable
        persistentData.absorbedBoosts = data.absorbedBoosts
        persistentData.absorbedParticle = data.absorbedParticle
    }
    if (data.absorbEnemiesCooldown) {
        persistentData.maxAbsorbEnemiesCooldown = data.absorbEnemiesCooldown
        persistentData.absorbEnemiesCooldown = 0
        persistentData.absorbEnemiesAmount = data.absorbEnemiesAmount
        persistentData.absorbEnemiesDistance = data.absorbEnemiesDistance
    }
    if (data.blockPlayerMagicDistance) {
        persistentData.blockPlayerMagicDistance = data.blockPlayerMagicDistance
    }
    if (data.bossBarColor) {
        persistentData.bossBarColor = data.bossBarColor
        persistentData.bossBarDarkenScreen = data.bossBarDarkenScreen
        persistentData.bossBarCreateWorldFog = data.bossBarCreateWorldFog
        persistentData.bossBarstyle = data.bossBarstyle
        persistentData.bossBarDistance = data.bossBarDistance
        let text 
        if(data.name) {
            text = getColoredText(data.name)
        } else {
            text = Text.of(data.id)
        }
        e.server.customBossEvents.create('fantasy_craft:'+entity.stringUuid,text)
        let bossBar = e.server.customBossEvents.get('fantasy_craft:'+entity.stringUuid)
        bossBar.setColor(data.bossBarColor)
        bossBar.setMax(entity.maxHealth)
        bossBar.setValue(entity.health)
        bossBar.setDarkenScreen(data.bossBarDarkenScreen)
        bossBar.setCreateWorldFog(data.bossBarCreateWorldFog)
        bossBar.setOverlay(data.bossBarstyle)
    }
    if (data.stages) {
        let stages = []
        data.stages.forEach(stage => {
            let dataStage = Object.assign({},stage)
            dataStage.claimed = false
            stages.push(dataStage)
        })
        persistentData.stages = stages
    }
    entity.spawn()
    e.server.runCommandSilent(`/execute in ${dimension} run photon fx kubejs:enemy_spawn block ${x} ${y} ${z}`)
}
function entityTick(e,entity) {
    if(!entity.isPlayer() && entity.isLiving()) {
        if(entity.block.getPlayersInRadius(20).length >= 1) {
            let persistentData = entity.persistentData
            if(persistentData.summons) {
                persistentData.summonCooldown += 1
                if(persistentData.summonCooldown >= persistentData.maxSummonCooldown) {
                    persistentData.summonCooldown = 0
                    for(let i = persistentData.summonAmount;i > 0; i--) {
                        spawnEnemy(e, entity.x, entity.y, entity.z, entity.level.dimension.toString(), entity.persistentData.summons[Math.floor(Math.random() * entity.persistentData.summons.length)])
                    }
                }
            }
            if(persistentData.projectiles) {
                persistentData.projectileCooldown += 1
                if(persistentData.projectileCooldown >= persistentData.maxProjectileCooldown) {
                    persistentData.projectileCooldown = 0
                    let projectile = persistentData.projectiles[Math.floor(Math.random() * persistentData.projectiles.length)]
                    let speed = projectile.speed
                    let movement = calculateMovement(entity.getViewXRot(1), entity.getViewYRot(1))
                    let projectileData = { particle: projectile.particle, types: persistentData.types, damage: {damage:getEnemyBonus(e,entity,'any','damage',projectile.damage),effects:projectile.effects}, type: 'enemyProjectile', owner: entity.getStringUuid(), speed: speed, x: entity.x, y: entity.y + 1.5, z: entity.z, movementX: movement.movementX, movementY: movement.movementY, movementZ: movement.movementZ, dimension: entity.level.dimension.toString(), remove: false }
                    e.server.persistentData.projectiles.push(projectileData)
                }    
            }
            if(persistentData.tempStats) {
                for(let key in persistentData.tempStats) {
                    let stat = persistentData.tempStats[key]
                    if(stat.timer != undefined) {
                        stat.timer -= 1
                        if(stat.timer <= 0) {
                            delete persistentData.tempStats[key]
                        }
                    }
                }
            }
            if(persistentData.nearEnemyBoosts) {
                persistentData.nearEnemyBoostsCooldown += 1
                if(persistentData.nearEnemyBoostsCooldown >= persistentData.maxNearEnemyBoostsCooldown) {
                    persistentData.nearEnemyBoostsCooldown = 0
                    let distance = persistentData.nearEnemyBoostsDistance
                    let box = AABB.of(entity.x - distance, entity.y - distance, entity.z - distance, entity.x + distance, entity.y + distance, entity.z + distance)
                    let dim = entity.level
                    let entitiesWithin = dim.getEntitiesWithin(box)
                    if(entitiesWithin.length >= 1) {
                        entitiesWithin.forEach(target => {
                            if(target.isLiving() && !target.isPlayer()) {
                                let targetPersistentData = target.persistentData
                                if(targetPersistentData.tempStats) {
                                    if(target.stringUuid != entity.stringUuid) {
                                        persistentData.nearEnemyBoosts.forEach(boost => {
                                            targetPersistentData.tempStats[entity.stringUuid+boost.id] = Object.assign({},boost)
                                        })
                                        drawCircle(e, { particle: persistentData.nearEnemyBoostsParticle, dimension: target.level.dimension.toString(), x: target.x, y: target.y, z: target.z, points: distance*20, radius: 1 })
                                    }
                                }
                            }
                        })
                    }
                }    
            }
            if(persistentData.selfHealAmount) {
                persistentData.selfHealCooldown += 1
                if(persistentData.selfHealCooldown >= persistentData.maxSelfHealCooldown) {
                    persistentData.selfHealCooldown = 0
                    entity.heal(persistentData.selfHealAmount)
                    drawCircle(e, { particle: persistentData.selfHealParticle, dimension: entity.level.dimension.toString(), x: entity.x, y: entity.y, z: entity.z, points: 20, radius: 1 })
                }
            }
            if(persistentData.nearEnemyHealAmount) {
                persistentData.nearEnemyHealCooldown += 1
                if(persistentData.nearEnemyHealCooldown >= persistentData.maxNearEnemyHealCooldown) {
                    persistentData.nearEnemyHealCooldown = 0
                    let distance = persistentData.nearEnemyHealDistance
                    let box = AABB.of(entity.x - distance, entity.y - distance, entity.z - distance, entity.x + distance, entity.y + distance, entity.z + distance)
                    let dim = entity.level
                    let entitiesWithin = dim.getEntitiesWithin(box)
                    if(entitiesWithin.length >= 1) {
                        entitiesWithin.forEach(target => {
                            if(target.isLiving() && !target.isPlayer()) {
                                if(target.stringUuid != entity.stringUuid) {
                                target.heal(persistentData.nearEnemyHealAmount)
                                drawCircle(e, { particle: persistentData.nearEnemyHealParticle, dimension: target.level.dimension.toString(), x: target.x, y: target.y, z: target.z, points: 20, radius: 1 })
                                }
                            }
                        })
                    }
                }    
            }
            if(persistentData.selfGiveEffects) {
                persistentData.selfGiveEffectsCooldown += 1
                if(persistentData.selfGiveEffectsCooldown >= persistentData.maxSelfGiveEffectsCooldown) {
                    persistentData.selfGiveEffectsCooldown = 0
                    persistentData.selfGiveEffects.forEach(effect => {
                        if (entity.potionEffects.isActive(effect.id)) {
                            entity.potionEffects.add(effect.id, effect.duration + entity.potionEffects.getDuration(effect.id), effect.level, false, true)
                        } else {
                            entity.potionEffects.add(effect.id, effect.duration, effect.level, false, true)
                        }
                    })
                    drawCircle(e, { particle: persistentData.selfGiveEffectsParticle, dimension: entity.level.dimension.toString(), x: entity.x, y: entity.y, z: entity.z, points: 20, radius: 1 })
                }
            }
            if(persistentData.nearEntityGiveEffects) {
                persistentData.nearEntityGiveEffectsCooldown += 1
                if(persistentData.nearEntityGiveEffectsCooldown >= persistentData.maxNearEntityGiveEffectsCooldown) {
                    persistentData.nearEntityGiveEffectsCooldown = 0
                    let distance = persistentData.nearEntityGiveEffectsDistance
                    let box = AABB.of(entity.x - distance, entity.y - distance, entity.z - distance, entity.x + distance, entity.y + distance, entity.z + distance)
                    let dim = entity.level
                    let entitiesWithin = dim.getEntitiesWithin(box)
                    if(entitiesWithin.length >= 1) {
                        entitiesWithin.forEach(target => {
                            let isAllowed = true
                            if(persistentData.nearEntityGiveEffectsType == 'enemy') {
                                if(!target.isLiving() || target.isPlayer()) {
                                    isAllowed = false
                                }
                            } else if(persistentData.nearEntityGiveEffectsType == 'player') {
                                if(!target.isLiving() || !target.isPlayer()) {
                                    isAllowed = false
                                }
                            }
                            if(isAllowed == true) {
                                if(target.stringUuid != entity.stringUuid) {
                                    persistentData.nearEntityGiveEffects.forEach(effect => {
                                        if (target.potionEffects.isActive(effect.id)) {
                                            target.potionEffects.add(effect.id, effect.duration + target.potionEffects.getDuration(effect.id), effect.level, false, true)
                                        } else {
                                            target.potionEffects.add(effect.id, effect.duration, effect.level, false, true)
                                        }
                                    })
                                    drawCircle(e, { particle: persistentData.nearEntityGiveEffectsParticle, dimension: target.level.dimension.toString(), x: target.x, y: target.y, z: target.z, points: 20, radius: 1 })
                                }
                            }
                        })
                    }
                }    
            }
            if(persistentData.traps) {
                persistentData.trapCooldown += 1
                if(persistentData.trapCooldown >= persistentData.maxTrapCooldown) {
                    persistentData.trapCooldown = 0
                    let trap = persistentData.traps[Math.floor(Math.random() * persistentData.traps.length)]
                    let damage = {}
                    if(trap.damage) {
                        damage.damage = trap.damage
                    } else {
                        damage.damage = 0
                    }
                    if (trap.effects) {
                        damage.effects = []
                        for (let key in trap.effects) {
                            let selectedEffect = trap.effects[key]
                            damage.effects.push({ id: effects[key].id, duration: selectedEffect.duration, level: selectedEffect.level })
                        }
                    }
                    let trapData = {owner:entity.stringUuid,x:entity.x,y:entity.y,z:entity.z,dimension:entity.level.dimension.toString(),types:trap.types,onlyOwnerCanSee:trap.onlyOwnerCanSee,activationRange:trap.activationRange,particle:trap.particle,activations:trap.activations,damage:damage,effects:trap.effects,duration:trap.duration,remove:false,wandId:undefined}
                    e.server.persistentData.traps.push(trapData)
                    for(let i = trap.activationRange; i>0;i--) {
                        drawCube(e,{x1:trapData.x+i,y1:trapData.y+i,z1:trapData.z+i,x2:trapData.x-i,y2:trapData.y-i,z2:trapData.z-i,dimension:trapData.dimension,particle:trap.particle,points:i*40})
                    }
                }    
            }
            if(persistentData.maxRespawnDeadEnemiesCooldown) {
                persistentData.respawnDeadEnemiesCooldown += 1
                if(persistentData.respawnDeadEnemiesCooldown >= persistentData.maxRespawnDeadEnemiesCooldown) {
                    persistentData.respawnDeadEnemiesCooldown = 0
                    let respawnableEnemies = []
                    let distance = persistentData.respawnDeadEnemiesDistance
                    e.server.persistentData.corpses.forEach(corpse => {
                        if(isTargetInRange(entity.x,entity.y,entity.z,corpse.x,corpse.y,corpse.z,distance)) {
                            respawnableEnemies.push(corpse)
                        }
                    })
                    if(respawnableEnemies.length >= 1) {
                        for(let i = persistentData.respawnDeadEnemiesAmount; i > 0;i--) {
                            let toRespawn = respawnableEnemies[i-1]
                            if(toRespawn) {
                                respawnCorpse(e,toRespawn)
                                toRespawn.remove = true
                            }
                        }
                    }
                }
            }
            if(persistentData.maxAbsorbEnemiesCooldown) {
                persistentData.absorbEnemiesCooldown += 1
                if(persistentData.absorbEnemiesCooldown >= persistentData.maxAbsorbEnemiesCooldown) {
                    persistentData.absorbEnemiesCooldown = 0
                    let distance = persistentData.absorbEnemiesDistance
                    let box = AABB.of(entity.x - distance, entity.y - distance, entity.z - distance, entity.x + distance, entity.y + distance, entity.z + distance)
                    let dim = entity.level
                    let entitiesWithin = dim.getEntitiesWithin(box)
                    if(entitiesWithin.length >= 1) {
                        let absorbed = 0
                        entitiesWithin.forEach(target => {
                            if(absorbed < persistentData.absorbEnemiesAmount) {
                                if(target.isLiving() && !target.isPlayer()) {
                                    let targetPersistentData = target.persistentData
                                    if(target.stringUuid != entity.stringUuid) {
                                        absorbed += 1
                                        targetPersistentData.absorbedBoosts.forEach(boost => {
                                            if(boost.type == 'boost') {
                                                if(persistentData.tempStats) {
                                                    boost.boosts.forEach(boost2 => {
                                                        persistentData.tempStats[entity.stringUuid+boost.id] = Object.assign({},boost2)
                                                    })
                                                }
                                            } else if(boost.type == 'heal') {
                                                entity.heal(boost.hp)
                                            } else if(boost.type == 'effect') {
                                                boost.effects.forEach(effect => {
                                                    if (entity.potionEffects.isActive(effect.id)) {
                                                        entity.potionEffects.add(effect.id, effect.duration + entity.potionEffects.getDuration(effect.id), effect.level, false, true)
                                                    } else {
                                                        entity.potionEffects.add(effect.id, effect.duration, effect.level, false, true)
                                                    }
                                                })
                                            }
                                        })
                                        drawCircle(e, { particle: targetPersistentData.absorbedParticle, dimension: target.level.dimension.toString(), x: target.x, y: target.y, z: target.z, points: 20, radius: 1 })
                                        target.kill()
                                    }
                                }
                            }
                        })
                    }
                }    
            }
            if(persistentData.blockPlayerMagicDistance) {
                let distance = persistentData.blockPlayerMagicDistance
                let box = AABB.of(entity.x - distance, entity.y - distance, entity.z - distance, entity.x + distance, entity.y + distance, entity.z + distance)
                let dim = entity.level
                let entitiesWithin = dim.getEntitiesWithin(box)
                if(entitiesWithin.length >= 1) {
                    entitiesWithin.forEach(target => {
                        if(target.isPlayer()) {
                            target.persistentData.magicBlocked = true
                        }
                    })
                }    
            }
            if(persistentData.bossBarColor) {
                let bossBar = e.server.customBossEvents.get('fantasy_craft:'+entity.stringUuid)
                if(bossBar) {
                    let distance = persistentData.bossBarDistance
                    let players = entity.block.getPlayersInRadius(distance)
                    bossBar.setMax(entity.maxHealth)
                    bossBar.setValue(entity.health)
                    bossBar.players = players
                }
            }
            if(persistentData.stages) {
                persistentData.stages.forEach(stage => {
                    if(!stage.claimed) {
                        let canBeClaimed = false
                        if(stage.requirementType == 'hp') {
                            if(entity.health <= stage.requirementAmount) {
                                canBeClaimed = true
                            }
                        } else if(stage.requirementType == 'hpBars') {
                            if(persistentData.activeHpBar >= stage.requirementAmount) {
                                canBeClaimed = true
                            }
                        }
                        if(canBeClaimed) {
                            if(stage.stagesRequired) {
                                stage.stagesRequired.forEach(requiredStage => {
                                    if(!persistentData.stages[parseInt(requiredStage)].claimed) {
                                        canBeClaimed = false
                                    }
                                })
                            }
                        }
                        if(canBeClaimed) {
                            stage.claimed = true
                            stage.rewards.forEach(reward => {
                                if(reward.type == 'heal') {
                                    entity.heal(reward.amount)
                                } else if(reward.type == 'giveEffects') {
                                    reward.effects.forEach(effect => {
                                        if (entity.potionEffects.isActive(effect.id)) {
                                            entity.potionEffects.add(effect.id, effect.duration + entity.potionEffects.getDuration(effect.id), effect.level, false, true)
                                        } else {
                                            entity.potionEffects.add(effect.id, effect.duration, effect.level, false, true)
                                        }
                                    })
                                } else if(reward.type == 'summonEnemies') {
                                    for(let i = reward.amount;i > 0; i--) {
                                        spawnEnemy(e, entity.x, entity.y, entity.z, entity.level.dimension.toString(), reward.enemies[Math.floor(Math.random() * reward.enemies.length)])
                                    }
                                } else if(reward.type == 'changeName') {
                                    persistentData.name = reward.name
                                    entity.customName = getColoredText(reward.name)
                                    if(persistentData.bossBarColor) {
                                        let bossBar = e.server.customBossEvents.get('fantasy_craft:'+entity.stringUuid)
                                        bossBar.setName(getColoredText(reward.name))
                                    }
                                } else if(reward.type == 'setData') {
                                    for(let key in reward.data) {
                                        persistentData[key] = reward.data[key]
                                    }
                                } else if(reward.type == 'removeData') {
                                    reward.data.forEach(data => {
                                        delete persistentData[data.asString]
                                    })
                                } else if(reward.type == 'setMaxHp') {
                                    entity.getAttribute($Attributes.MAX_HEALTH).removeModifiers()
                                    entity.maxHealth = reward.amount
                                    persistentData.maxHp = reward.amount
                                } else if(reward.type == 'setMaxHpWithHeal') {
                                    entity.getAttribute($Attributes.MAX_HEALTH).removeModifiers()
                                    entity.maxHealth = reward.amount
                                    entity.health = reward.amount
                                    persistentData.maxHp = reward.amount
                                }
                            })
                        }
                    }
                })
            }
        }
    }
}
function spawnCorpse(e,entity) {
    let corpseData = entity.persistentData
    corpseData.producesCorpse = false
    corpseData.dead = false
    corpseData.x = entity.x
    corpseData.y = entity.y
    corpseData.z = entity.z
    corpseData.dimension = entity.level.dimension.toString()
    corpseData.id = entity.type
    corpseData.remove = false
    e.server.persistentData.corpses.push(corpseData)
}
function corpsTick(e) {
    let corpses = e.server.persistentData.corpses
    corpses.forEach(corpse => {
        let i = 0.5
        drawCube(e,{x1:corpse.x+i,y1:corpse.y+i,z1:corpse.z+i,x2:corpse.x-i,y2:corpse.y-i,z2:corpse.z-i,dimension:corpse.dimension,particle:corpse.corpseParticle,points:i*60})
        corpse.corpseDuration -= 1
        if(corpse.corpseDuration <= 0) {
            corpse.remove = true
        }
    })
    e.server.persistentData.corpses = e.server.persistentData.corpses.filter(corpse => !(corpse.remove == true))
}
function respawnCorpse(e,corpse) {
    delete corpse.remove
    let dim = e.server.getLevel(corpse.dimension)    
    let block = dim.getBlock(corpse.x, corpse.y, corpse.z)
    let entity = block.createEntity(corpse.id)
    entity.getAttribute($Attributes.MAX_HEALTH).removeModifiers()
    entity.maxHealth = corpse.maxHp
    entity.health = corpse.maxHp
    if (corpse.name) {
        entity.customName = getColoredText(corpse.name)
    }
    for(let key in corpse) {
        entity.persistentData[key] = corpse[key]
    }
    entity.spawn()
    drawCircle(e, { particle: corpse.reviveParticle, dimension: corpse.dimension, x: corpse.x, y: corpse.y, z: corpse.z, points: 20, radius: 1 })
}