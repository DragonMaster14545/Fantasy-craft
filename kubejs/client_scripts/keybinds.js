ClientEvents.tick(e => {
    if (global.OPEN_RPG_MAIN_MENU.consumeClick()) {
        Client.player.sendData('KeyPressed', { key: 'open_rpg_main_menu' })
    }
})