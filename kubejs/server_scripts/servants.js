//dust, dust_color_transition
//cloud, composter, flame, sculk_soul, soul_fire_flame, crit
/*

{type:'mele',drawRadius:0.15,points:5,verticalPoints:5,rotation:2.5,particle:'minecraft:crit',maxCooldown:100,range:20,duration:2000,attack:{speed:1,types:['air'],damage:{damage:1}}},
{type:'mele',drawRadius:0.15,points:5,verticalPoints:5,rotation:2.5,particle:'minecraft:crit',maxCooldown:100,range:20,duration:2000,attack:{speed:1,types:['air'],damage:{damage:1}}},
{type:'buff',drawRadius:0.15,points:5,verticalPoints:5,rotation:2.5,particle:'minecraft:cloud',duration:200,buffs:[{id:'meleExtraDamage',amount:1}]},
{type:'buff',drawRadius:0.15,points:5,verticalPoints:5,rotation:2.5,particle:'minecraft:cloud',duration:200,buffs:[{id:'meleExtraDamage',amount:1}]},
{type:'ranged',drawRadius:0.15,points:5,verticalPoints:5,rotation:2.5,particle:'minecraft:sculk_soul',maxCooldown:20,range:20,duration:200,projectile:{speed:1,types:['air'],damage:{damage:1},particle:'minecraft:dragon_breath'}},
{type:'ranged',drawRadius:0.15,points:5,verticalPoints:5,,rotation:2.5,particle:'minecraft:sculk_soul',maxCooldown:20,range:20,duration:200,projectile:{speed:1,types:['air'],damage:{damage:1},particle:'minecraft:dragon_breath'}},

*/

function addServant(e, player, servantData, amount, bypassLimit) {
    let playerSaveData = e.server.persistentData.playerData[player.stringUuid]
    let servants = playerSaveData.servants
    let baseMaxServants = 2
    if (bypassLimit) {
        baseMaxServants = 99999999
    }
    let maxServants = getBonus(e, player, 'any', 'maxServants', baseMaxServants)
    for (let i = amount; i > 0; i--) {
        if (servants.length >= maxServants) {
        } else {
            servantData.remove = false
            if (servantData.type == 'mele') {
                servantData.cooldown = 0
                servantData.isWithPlayer = true
            } else if (servantData.type == 'buff') {
            } else if (servantData.type == 'ranged') {
                servantData.cooldown = 0
            }
            servants.push(servantData)
            adjustServantPositions(e, player)
        }
    }
}
function adjustServantPositions(e, player) {
    let playerSaveData = e.server.persistentData.playerData[player.stringUuid]
    let servants = playerSaveData.servants
    let amount = servants.length
    let baseRadius = 1
    let activeRadius = -1
    let servantsInRadius = 0
    let positions = {}
    for (let i = 0; i < amount; i++) {
        if (servantsInRadius <= 0) {
            activeRadius += 1
            servantsInRadius = activeRadius * 2 + 2
            positions[activeRadius] = []
        }
        servantsInRadius -= 1
        let radius = activeRadius + baseRadius
        servants[i].radius = radius
        positions[activeRadius].push(i)
    }
    for (let key in positions) {
        let position = positions[key]
        let servantsInPosition = position.length
        let angelToAdd = 360 / servantsInPosition
        let activeAngel = 0
        position.forEach(i => {
            servants[i].angel = activeAngel
            activeAngel += angelToAdd
        })
    }
}
/**
* @param {Internal.ServerPlayer} player
* @param {Internal.NetworkEventJS} e 
*/
function servantTick(e, player) {
    let drawOnClient = []
    let playerSaveData = e.server.persistentData.playerData[player.stringUuid]
    let servants = playerSaveData.servants
    let servantHeightOverPlayer = 4
    servants.forEach(servant => {
        servant.angel += servant.rotation
        if (servant.duration != undefined) {
            servant.duration -= 1
            if (servant.duration <= 0) {
                servant.remove = true
                e.server.scheduleInTicks(1, event => adjustServantPositions(e, player))
            }
        }
        let pos
        if (servant.x && servant.y && servant.z) {
            pos = { x: servant.x, y: servant.y, z: servant.z }
        } else {
            pos = calculateAngelPosition(servant.radius, servant.angel, { x: player.x, y: player.y + servantHeightOverPlayer, z: player.z })
        }
        drawOnClient.push({ x: pos.x, y: pos.y, z: pos.z, radius: servant.drawRadius, points: servant.points, verticalPoints: servant.verticalPoints, dimension: player.level.dimension.toString(), particle: servant.particle })
        if (servant.type == 'ranged') {
            servant.cooldown += 1
            if (servant.cooldown >= servant.maxCooldown) {
                servant.cooldown = 0
                let target = getServantNearestEntity(e, player, pos.x, pos.y, pos.z, servant.range)
                if (target) {
                    let movement = calculateMovementFromBlocks(pos.x, pos.y, pos.z, target.x, target.y + 0.5, target.z)
                    e.server.persistentData.projectiles.push({ particle: servant.projectile.particle, types: servant.projectile.types, damage: servant.projectile.damage, type: 'ranged_servant', wandId: servant.wandId, owner: player.getStringUuid(), speed: servant.projectile.speed, x: pos.x, y: pos.y, z: pos.z, movementX: movement.movementX, movementY: movement.movementY, movementZ: movement.movementZ, dimension: player.level.dimension.toString(), remove: false })
                }
            }
        } else if (servant.type == 'mele') {
            if (servant.isWithPlayer) {
                servant.cooldown += 1
                if (servant.cooldown >= servant.maxCooldown) {
                    servant.cooldown = 0
                    let target = getServantNearestEntity(e, player, pos.x, pos.y, pos.z, servant.range)
                    if (target) {
                        servant.target = target.stringUuid
                        servant.hitTarget = false
                        servant.isWithPlayer = false
                        servant.x = pos.x
                        servant.y = pos.y
                        servant.z = pos.z
                    }
                }
            } else {
                for (let i = servant.attack.speed; i > 0; i--) {
                    let multiplier = 0
                    if (i >= 1) {
                        multiplier = 1
                    } else {
                        multiplier = i
                    }
                    if (servant.target) {
                        let target = getServantNearestEntity(e, player, pos.x, pos.y, pos.z, servant.range, servant.target)
                        if (target) {
                            let dx = target.x - pos.x
                            let dy = target.y - pos.y
                            let dz = target.z - pos.z
                            let distance = Math.abs(dx) + Math.abs(dy) + Math.abs(dz)
                            if (distance <= 1.5) {
                                delete servant.target
                                servant.hitTarget = true
                                let couldDamage = processDamage(e, player, target, 'wand', target.health, servant.wandId, { types: servant.attack.types, damage: servant.attack.damage, type: 'mele_servant' })
                                if (couldDamage) {
                                    drawCircle(e, { particle: 'minecraft:crit', dimension: player.level.dimension.toString(), x: target.x, y: target.y, z: target.z, points: 20, radius: 1 })
                                }
                            } else {
                                let movement = calculateMovementFromBlocks(pos.x, pos.y, pos.z, target.x, target.y + 0.5, target.z)
                                servant.x += movement.movementX * multiplier
                                servant.y += movement.movementY * multiplier
                                servant.z += movement.movementZ * multiplier
                            }
                        } else {
                            delete servant.target
                            servant.hitTarget = true
                        }
                    } else if (servant.hitTarget == true) {
                        let playerTarget = calculateAngelPosition(servant.radius, servant.angel, { x: player.x, y: player.y + servantHeightOverPlayer, z: player.z })
                        let dx = playerTarget.x - pos.x
                        let dy = playerTarget.y - pos.y
                        let dz = playerTarget.z - pos.z
                        let distance = Math.abs(dx) + Math.abs(dy) + Math.abs(dz)
                        if (distance <= 1.5) {
                            servant.isWithPlayer = true
                            servant.hitTarget = false
                            delete servant.x
                            delete servant.y
                            delete servant.z
                            break
                        } else {
                            let movement = calculateMovementFromBlocks(pos.x, pos.y, pos.z, playerTarget.x, playerTarget.y, playerTarget.z)
                            servant.x += movement.movementX * multiplier
                            servant.y += movement.movementY * multiplier
                            servant.z += movement.movementZ * multiplier
                        }
                    }
                }
            }
        }
    })
    e.server.persistentData.playerData[player.stringUuid].servants = servants.filter(servant => !(servant.remove == true))
    drawClientSpheresToAllPlayers(e, player.x, player.y, player.z, drawOnClient, player.level.dimension.toString())
}
function getServantNearestEntity(e, player, x, y, z, range, entityUuid) {
    let dim = e.server.getLevel(player.level.dimension.toString())
    let box = AABB.of(x - range, y - range, z - range, x + range, y + range, z + range)
    let entitiesWithin = dim.getEntitiesWithin(box)
    let entitiesFound = entitiesWithin.length
    if (entitiesFound > 0) {
        let nearestEntity = { i: -1, distance: Infinity - 1 }
        for (let i = 0; entitiesFound - 1 >= i; i++) {
            let entity = entitiesWithin[i]
            if (entityUuid) {
                if (entity.stringUuid == entityUuid) {
                    return entity
                }
            } else {
                let isOwner = false
                if (entity.isPlayer) {
                    if (entity.stringUuid == player.stringUuid) {
                        isOwner = true
                    }
                }
                if (entity.isLiving() && !isOwner) {
                    let distance = calculateDistance(x, y, z, entity.x, entity.y, entity.z)
                    if (nearestEntity.distance >= distance) {
                        nearestEntity.distance = distance
                        nearestEntity.i = i
                    }
                }
            }
        }
        if (nearestEntity.i > -1) {
            let target = entitiesWithin[nearestEntity.i]
            return target
        }
    }
}
function calculateAngelPosition(radius, angle, center) {
    var radians = angle * (JavaMath.PI / 180)
    var x = center.x + radius * Math.cos(radians)
    var y = center.y
    var z = center.z + radius * Math.sin(radians)
    return { x: x, y: y, z: z }
}
function calculateDistance(x1, y1, z1, x2, y2, z2) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    let dz = z2 - z1;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
function calculateMovementFromBlocks(x1, y1, z1, x2, y2, z2) {
    let dx = x2 - x1
    let dy = y2 - y1
    let dz = z2 - z1
    let totalDistance = Math.sqrt(dx * dx + dy * dy + dz * dz)
    let scale = 1 / totalDistance
    let movement = {
        movementX: dx * scale,
        movementY: dy * scale,
        movementZ: dz * scale
    }
    return movement
}
