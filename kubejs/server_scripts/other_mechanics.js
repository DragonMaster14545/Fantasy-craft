function debuffAreaTick(e) {
    debuffAreas.forEach(area => {
        let dim = e.server.getLevel(area.dimension)
        let block = dim.getBlock(area.x1, area.y1, area.z1)
        if (block.getPlayersInRadius(50).length > 0) {
            spawnParticlesInCube(e,area.x1, area.y1, area.z1, area.x2, area.y2, area.z2, area.particleChance,area.particle,area.dimension)
            area.cooldown += 1
            if(area.cooldown >= area.maxCooldown) {
                area.cooldown = 0
                let box = AABB.of(area.x1, area.y1, area.z1, area.x2, area.y2, area.z2)
                let entitiesWithin = dim.getEntitiesWithin(box)
                if(entitiesWithin.length >= 1) {
                    entitiesWithin.forEach(entity => {
                        let canAffect = true
                        if(area.affects == 'players') {
                            if(!entity.isPlayer()) {
                                canAffect = false
                            }
                        } else if(area.affects == 'enemies') {
                            if(entity.isPlayer() || !entity.isLiving()) {
                                canAffect = false
                            }
                        } else if(area.affects == 'all') {
                            if(!entity.isLiving()) {
                                canAffect = false
                            }
                        }
                        if(canAffect) {
                            if(area.type == 'damage') {
                                let damageSource = entity.damageSources().generic()
                                entity.attack(damageSource, area.damage)
                            } else if(area.type == 'effects') {
                                for (let key in area.effects) {
                                let selectedEffect = area.effects[key]
                                    if (!entity.potionEffects.isActive(effects[key].id)) {
                                        entity.potionEffects.add(effects[key].id, area.maxCooldown, selectedEffect.level, false, true)
                                    }
                                }
                            } else if(area.type == 'noPlayerMagic') {
                                entity.persistentData.magicBlocked = true
                                entity.persistentData.magicBlockedCooldown = area.maxCooldown+1
                            }
                        }
                    })
                }
            }
        }
    })
}