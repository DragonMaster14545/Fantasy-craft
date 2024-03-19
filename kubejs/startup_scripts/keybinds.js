//priority: 100
const $KeyMappingRegistry = Java.loadClass('dev.architectury.registry.client.keymappings.KeyMappingRegistry')
const $KeyMapping = Java.loadClass('net.minecraft.client.KeyMapping')
const $GLFWKey = Java.loadClass('org.lwjgl.glfw.GLFW')

ClientEvents.init(event => {
    global.OPEN_RPG_MAIN_MENU = new $KeyMapping('key.kubejs.open_rpg_main_menu', $GLFWKey.GLFW_KEY_H, 'key.categories.kubejs')
    $KeyMappingRegistry.register(global.OPEN_RPG_MAIN_MENU)
})