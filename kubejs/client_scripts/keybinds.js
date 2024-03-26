ClientEvents.tick(e => {
    if (global.OPEN_RPG_MAIN_MENU.consumeClick()) {
        Client.player.sendData('KeyPressed', { key: 'open_rpg_main_menu' })
    }
    if (global.SHOW_RPG_ENTITY_INFO.consumeClick()) {
        Client.player.sendData('KeyPressed', { key: 'show_rpg_entity_info' })
    }
    if (global.SHOW_RPG_AREA_INFO.consumeClick()) {
        Client.player.sendData('KeyPressed', { key: 'show_rpg_area_info' })
    }
})