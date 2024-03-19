NetworkEvents.dataReceived('jade_get_persistent_data',e => {
    let player = e.entity
    let data = e.data
    let entity = e.server.getLevel(data.level).getEntity(data.entity)
    let persistentData = entity.persistentData
    let toSendData = {}
    if(entity.persistentData.types) {
        toSendData.enemyTypes = ""
        entity.persistentData.types.forEach(type => {
            toSendData.enemyTypes = toSendData.enemyTypes+types[type.asString].icon
        })
        toSendData.damageDealtMultiplier = calculateTypeDamageMultiplier(getMainHandItemTypes(e,player),getEntityTypes(e,entity))
        toSendData.damageReceivedMultiplier = calculateTypeDamageMultiplier(getEntityTypes(e,entity),getArmorItemTypes(e,player))
    }
    persistentData = {player:{},entity:persistentData,data:toSendData}
    player.sendData('jade_set_persistent_data', {entity:entity.id,level:data.level,persistentData:persistentData})
})