NetworkEvents.dataReceived('jade_set_persistent_data', e => {
    let data = e.data
    let entity = e.getLevel().getEntity(data.entity)
    entity.persistentData.jadeData = data.persistentData
})