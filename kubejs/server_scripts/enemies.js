function entitySpawnTick(e) {
    enemySpawns.forEach(spawn => {
        spawn.cooldown += 1
        if (spawn.cooldown >= spawn.maxCooldown) {
            spawn.cooldown = 0
            if (spawn.type == 'circle') {
                let dim = e.server.getLevel(spawn.dimension)
                let block = dim.getBlock(spawn.x, spawn.y, spawn.z)
                if (block.getPlayersInRadius(spawn.spawnRadius).length > 0) {
                    let point = getRandomPointInCircle(spawn)
                    spawnEnemy(e, point.x, point.y, point.z, spawn.dimension, spawn.entities[Math.floor(Math.random() * spawn.entities.length)])
                }
            } else if (spawn.type == 'rectangle') {
                let dim = e.server.getLevel(spawn.dimension)
                let block = dim.getBlock(spawn.x1, spawn.y1, spawn.z1)
                if (block.getPlayersInRadius(spawn.spawnRadius).length > 0) {
                    let point = getRandomPointInRectangle(spawn)
                    spawnEnemy(e, point.x, point.y, point.z, spawn.dimension, spawn.entities[Math.floor(Math.random() * spawn.entities.length)])
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
    if (data.maxHp) {
        entity.getAttribute($Attributes.MAX_HEALTH).removeModifiers()
        entity.maxHealth = data.maxHp
        entity.health = data.maxHp
        persistentData.maxHp = data.maxHp
    }
    if (data.name) {
        entity.customName = data.name
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
    entity.spawn()
}