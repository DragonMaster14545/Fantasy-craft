function entitySpawnTick(e) {
    enemySpawns.forEach(spawn => {
        spawn.cooldown += 1
        if(spawn.cooldown >= spawn.maxCooldown) {
            spawn.cooldown = 0
            if(spawn.type == 'circle') {
                let dim = e.server.getLevel(spawn.dimension)
                let block = dim.getBlock(spawn.x,spawn.y,spawn.z)
                if(block.getPlayersInRadius(spawn.spawnRadius).length > 0) {
                    let point = getRandomPointInCircle(spawn)
                    let block = dim.getBlock(point.x,point.y,point.z)
                    let selectedEntity = spawn.entities[Math.floor(Math.random()*spawn.entities.length)]
                    let entity = block.createEntity(selectedEntity.id)
                    if(selectedEntity.maxHp) {
                        console.log("Original max HP: " + entity.maxHealth)
                        entity.getAttribute($Attributes.MAX_HEALTH).removeModifiers()
                        entity.maxHealth = selectedEntity.maxHp
                        console.log("New max HP: " + entity.maxHealth)
                        entity.health = selectedEntity.maxHp
                    }
                    if(selectedEntity.name) {
                        entity.customName = selectedEntity.name
                    }
                    let persistentData = entity.persistentData
                    if(selectedEntity.armor) {
                        persistentData.armor = selectedEntity.armor
                    }
                    if(selectedEntity.damage) {
                        persistentData.damage = selectedEntity.damage
                    }
                    if(selectedEntity.types) {
                        persistentData.types = selectedEntity.types
                    }
                    entity.spawn()
                }
            } else if(spawn.type == 'rectangle') {
                let dim = e.server.getLevel(spawn.dimension)
                let block = dim.getBlock(spawn.x1,spawn.y1,spawn.z1)
                if(block.getPlayersInRadius(spawn.spawnRadius).length > 0) {
                    let point = getRandomPointInRectangle(spawn)
                    let block = dim.getBlock(point.x,point.y,point.z)
                    let selectedEntity = spawn.entities[Math.floor(Math.random()*spawn.entities.length)]
                    let entity = block.createEntity(selectedEntity.id)
                    if(selectedEntity.maxHp) {
                        entity.health = selectedEntity.maxHp
                    }
                    if(selectedEntity.name) {
                        entity.customName = selectedEntity.name
                    }
                    let persistentData = entity.persistentData
                    if(selectedEntity.armor) {
                        persistentData.armor = selectedEntity.armor
                    }
                    if(selectedEntity.damage) {
                        persistentData.damage = selectedEntity.damage
                    }
                    if(selectedEntity.types) {
                        persistentData.types = selectedEntity.types
                    }
                    entity.spawn()
                }
            }
        }
    })
}