function startCutscene(e, player, id) {
    player.closeMenu()
    let playerData = e.server.persistentData.playerData[player.stringUuid]
    playerData.cutscene = cutscenes[id]
    let cutscene = playerData.cutscene
    let level = e.server.getLevel(cutscene.dimension)
    player.teleportTo(level, cutscene.x, cutscene.y, cutscene.z, [], player.yaw, player.pitch)
}
function cutsceneTick(e, player) {
    let playerData = e.server.persistentData.playerData[player.stringUuid]
    let cutscene = playerData.cutscene
    let activeStep = cutscene.steps[cutscene.progress]
    let level = e.server.getLevel(cutscene.dimension)
    player.potionEffects.add('kubejs:immovable', 10, 1, false, false)
    activeStep.timer -= 1
    if (activeStep.timer <= 0) {
        if (activeStep.type == 'spawnNpc') {
            let block = level.getBlock(cutscene.x + activeStep.relX, cutscene.y + activeStep.relY, cutscene.z + activeStep.relZ)
            let entity = block.createEntity(activeStep.id)
            entity.customName = getColoredText(activeStep.name)
            entity.spawn()
            cutscene.progress += 1
        } else if (activeStep.type == 'moveNpc') {
            level.getEntitiesWithin(AABB.of(cutscene.x + activeStep.relX - 0.5, cutscene.y + activeStep.relY - 0.5, cutscene.z + activeStep.relZ - 0.5, cutscene.x + activeStep.relX + 0.5, cutscene.y + activeStep.relY + 0.5, cutscene.z + activeStep.relZ + 0.5)).forEach(entity => {
                entity.persistentData.targetX = cutscene.x + activeStep.moveRelX
                entity.persistentData.targetY = cutscene.x + activeStep.moveRelY
                entity.persistentData.targetZ = cutscene.x + activeStep.moveRelZ
                entity.persistentData.speed = cutscene.x + activeStep.speed
                entity.persistentData.target = true
            })
            cutscene.progress += 1
        } else if (activeStep.type == 'openConversation') {
            if (activeStep.progress == 0) {
                player.closeMenu()
                rpgDialogueGui(e, player, 0, activeStep.conversation, true)
                activeStep.progress = 1
            }
        } else if (activeStep.type == 'killNpc') {
            level.getEntitiesWithin(AABB.of(cutscene.x + activeStep.relX - 0.5, cutscene.y + activeStep.relY - 0.5, cutscene.z + activeStep.relZ - 0.5, cutscene.x + activeStep.relX + 0.5, cutscene.y + activeStep.relY + 0.5, cutscene.z + activeStep.relZ + 0.5)).forEach(entity => {
                entity.kill()
            })
            cutscene.progress += 1
        } else if (activeStep.type == 'endCutscene') {
            player.potionEffects.clear()
            playerData.cutscene = {}
        }
    }
}
function cutsceneCompleteConversation(e, player) {
    let playerData = e.server.persistentData.playerData[player.stringUuid]
    let cutscene = playerData.cutscene
    cutscene.progress += 1
}