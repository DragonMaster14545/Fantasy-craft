StartupEvents.postInit((event) => {
	if (!Platform.isClientEnvironment()) return
	addTooltips(event)
})

let $WailaClientRegistration
let $WailaBlockAccessor
let $WailaEntityAccessor
let updateTimer = 0
if (Platform.isClientEnvironment()) {
	$WailaClientRegistration = Java.loadClass("snownee.jade.impl.WailaClientRegistration")
	$WailaBlockAccessor = Java.loadClass("snownee.jade.api.BlockAccessor")
	$WailaEntityAccessor = Java.loadClass("snownee.jade.api.EntityAccessor")
}
let addTooltips = (event) => {
	$WailaClientRegistration.INSTANCE.addTooltipCollectedCallback(0, (tooltip, accessor) => {
		if (!(accessor instanceof $WailaBlockAccessor)) return
		if (accessor.block.id != "minecraft:structure_block") return
		let addToTooltip = comp => tooltip["add(int,net.minecraft.network.chat.Component)"](tooltip.size() - 1, comp)
		let name = accessor.getBlockEntity().getStructureName()
		let mode = accessor.getBlockEntity().getMode()
		let size = accessor.getBlockEntity().getStructureSize().toShortString()
		let offset = accessor.getBlockEntity().getStructurePos().toShortString()
		let ignoresEntities = accessor.getBlockEntity().isIgnoreEntities()
		addToTooltip(Text.green('Name: ' + name))
		addToTooltip(Text.green('Mode: ' + mode))
		addToTooltip(Text.green('Size: ' + size))
		addToTooltip(Text.green('Offset: ' + offset))
		addToTooltip(Text.green('Ignores entites: ' + ignoresEntities))
	})
	$WailaClientRegistration.INSTANCE.addTooltipCollectedCallback(0, (tooltip, accessor) => {
		if (!(accessor instanceof $WailaEntityAccessor)) return
		let addToTooltip = comp => tooltip["add(int,net.minecraft.network.chat.Component)"](tooltip.size() - 1, comp)
		if (!accessor.getEntity().persistentData.jadeData) {
			Client.player.sendData('jade_get_persistent_data', { entity: accessor.getEntity().stringUuid, level: accessor.getEntity().level.dimension.toString() })
		} else {
			updateTimer++
			if (updateTimer >= 4) {
				Client.player.sendData('jade_get_persistent_data', { entity: accessor.getEntity().stringUuid, level: accessor.getEntity().level.dimension.toString() })
			}
			let persistentData = accessor.getEntity().persistentData.jadeData
			if (persistentData.data.enemyTypes) {
				addToTooltip(Text.white(persistentData.data.enemyTypes))
			}
			if (persistentData.data.damageDealtMultiplier) {
				addToTooltip(Text.red('Damage dealt multiplier: ' + persistentData.data.damageDealtMultiplier))
			}
			if (persistentData.data.damageReceivedMultiplier) {
				addToTooltip(Text.red('Damage received multiplier: ' + persistentData.data.damageReceivedMultiplier))
			}
			if (persistentData.data.armor) {
				addToTooltip(Text.white('\uE075 ').append(Text.gray(persistentData.data.armor)))
			}
			if (persistentData.data.hpBars) {
				addToTooltip(Text.white('\uE076 ').append(Text.red(persistentData.data.hpBars - persistentData.data.activeHpBar + 'x ' + persistentData.data.maxHp + ' hp + ' + persistentData.data.enemyHealth)))
			}
		}
	})
}