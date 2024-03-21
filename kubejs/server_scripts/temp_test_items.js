PlayerEvents.inventoryChanged(e => {
    let player = e.entity
    for (let i = 0; i <= 35; i++) {
        let item = player.getSlot(i).get()
        player.getSlot(i).set(formatTempTestItem(e, player, item))
    }
})
let showEnemySpawnAreas = false
function formatTempTestItem(e, player, item) {
    if (item.id == 'kubejs:cheat_item') {
        if (!item.nbt) {
            item.nbt = {}
        }
        let nbt = item.nbt
        if (!nbt.display) {
            nbt.display = {}
        }
        nbt.display.Lore = []
        let count = item.count
        if (count == 1) {
            item = item.withLore(Text.green('Toggle show enemy spawn areas'))
        } else if (count == 2) {
            item = item.withLore(Text.green('Click to spawn test servants'))
            item = item.withLore(Text.green('Shift click to clear all servants'))
        } else if (count == 3) {
            item = item.withLore(Text.green('Click on a block to save the coordinates'))
            item = item.withLore(Text.green('Click on an entity to make them move to those coordinates'))
            item = item.withLore(Text.green('Shift click to kill any entity'))
        } else if (count == 4) {
            item = item.withLore(Text.green('Click to give test items'))
        } else if (count == 5) {
            item = item.withLore(Text.green('Click to spawn test quasar particle'))
        }
    }
    return item
}
ItemEvents.rightClicked('kubejs:cheat_item', e => {
    let player = e.entity
    let count = e.item.count
    if (count == 1) {
        showEnemySpawnAreas = !showEnemySpawnAreas
        player.tell(Text.blue('Set show enemy spawn areas to ' + showEnemySpawnAreas))
    } else if (count == 2) {
        let playerSaveData = e.server.persistentData.playerData[player.stringUuid]
        if (player.isShiftKeyDown()) {
            playerSaveData.servants = []
        } else {
            addServant(e, player, { type: 'ranged', drawRadius: 0.15, points: 5, verticalPoints: 5, rotation: 2.5, particle: 'minecraft:sculk_soul', maxCooldown: 20, range: 20, duration: 100000, projectile: { speed: 1, types: ['air'], damage: { damage: 10 }, particle: 'minecraft:dragon_breath' } }, 100, true)
            addServant(e, player, { type: 'mele', drawRadius: 0.15, points: 5, verticalPoints: 5, rotation: 2.5, particle: 'minecraft:flame', maxCooldown: 100, range: 20, duration: 100000, attack: { speed: 1, types: ['air'], damage: { damage: 10 } } }, 100, true)
        }
    } else if (count == 3) {
        if (e.entity.shiftKeyDown) {
            if (e.target.entity) {
                e.target.entity.kill()
            }
        } else {
            if (e.target.entity) {
                if (e.item.nbt.y >= -100) {
                    e.target.entity.persistentData.targetX = e.item.nbt.x
                    e.target.entity.persistentData.targetY = e.item.nbt.y
                    e.target.entity.persistentData.targetZ = e.item.nbt.z
                    e.target.entity.persistentData.speed = 1
                    e.target.entity.persistentData.target = true
                    player.tell(Text.blue('Sent entity to'))
                    player.tell(Text.blue(`X: ${e.item.nbt.x} y: ${e.item.nbt.y} z: ${e.item.nbt.z}`))
                }
            } else if (e.target.block) {
                e.item.nbt = {}
                e.item.nbt.x = e.target.block.x
                e.item.nbt.y = e.target.block.y
                e.item.nbt.z = e.target.block.z
                player.tell(Text.blue('Copied position:'))
                player.tell(Text.blue(`X: ${e.item.nbt.x} y: ${e.item.nbt.y} z: ${e.item.nbt.z}`))
            }
        }
    } else if (count == 4) {
        //giveCustomItem(e,e.player,'kubejs:custom_chestplate',{armor:10,type:'chestplate',level:1,xp:0,maxXp:10,types:['neutral'],levelUpRewards:[{owned:0,id:'armor',amount:1},{owned:0,id:'luck',amount:1}]})
        //giveCustomItem(e,e.player,'kubejs:custom_sword',{damage:10,type:'sword',level:1,xp:0,maxXp:10,types:['neutral'],levelUpRewards:[{owned:0,id:'damage',amount:1}]})
        //giveCustomItem(e,e.player,'kubejs:custom_sword',{damage:10,type:'sword',level:1,xp:0,maxXp:10,area:3,pierce:3,types:['neutral'],levelUpRewards:[{owned:0,id:'damage',amount:1}]})
        //giveCustomItem(e,e.player,'kubejs:custom_sword',{damage:10,type:'sword',level:1,xp:0,maxXp:10,area:3,types:['neutral'],levelUpRewards:[{owned:0,id:'damage',amount:1}]})
        //giveCustomItem(e,e.player,'kubejs:custom_sword',{damage:10,type:'sword',level:1,xp:0,maxXp:10,effects:{poison:{duration:100,level:1}},types:['neutral'],levelUpRewards:[{owned:0,id:'damage',amount:1}]})
        //giveCustomItem(e,e.player,'kubejs:custom_sword',{damage:10,type:'wand',level:1,xp:0,maxXp:10,manaCost:1,speed:1,pierce:2,types:['ice','water'],levelUpRewards:[{owned:0,id:'damage',amount:1},{owned:0,id:'manaCost',amount:-0.2},{owned:0,id:'speed',amount:0.5}]})
        //giveCustomItem(e,e.player,'kubejs:custom_sword',{type:'wand',level:1,xp:0,maxXp:10,manaCost:1,summons:[{type:'mele_servant',amount:1,attackCooldown:100,range:20,duration:200,attack:{speed:1,types:['air'],damage:{damage:1}}}],types:['summoning'],levelUpRewards:[{owned:0,id:'damage',amount:1},{owned:0,id:'manaCost',amount:-0.2},{owned:0,id:'speed',amount:0.5}]})
        //giveCustomItem(e,e.player,'kubejs:custom_sword',{type:'wand',level:1,xp:0,maxXp:10,manaCost:1,summons:[{type:'ranged_servant',amount:1,attackCooldown:40,range:20,duration:200,projectile:{speed:1,types:['air'],damage:{damage:1}}}],types:['summoning'],levelUpRewards:[{owned:0,id:'damage',amount:1},{owned:0,id:'manaCost',amount:-0.2},{owned:0,id:'speed',amount:0.5}]})
        //giveCustomItem(e,e.player,'kubejs:custom_sword',{type:'wand',level:1,xp:0,maxXp:10,manaCost:1,summons:[{type:'buff_servant',amount:2,duration:200,buffs:[{id:'meleExtraDamage',amount:1}]}],types:['summoning'],levelUpRewards:[{owned:0,id:'damage',amount:1},{owned:0,id:'manaCost',amount:-0.2},{owned:0,id:'speed',amount:0.5}]})
        //giveCustomItem(e,e.player,'kubejs:custom_sword',{type:'wand',level:1,xp:0,maxXp:10,manaCost:1,summons:[{type:'mele_servant',amount:1,attackCooldown:100,range:20,duration:200,attack:{speed:1,types:['air'],damage:{damage:1}}},{type:'ranged_servant',amount:1,attackCooldown:40,range:20,duration:200,projectile:{speed:1,types:['air'],damage:{damage:1}}}],types:['summoning'],levelUpRewards:[{owned:0,id:'damage',amount:1},{owned:0,id:'manaCost',amount:-0.2},{owned:0,id:'speed',amount:0.5}]})
        //giveCustomItem(e,e.player,'kubejs:custom_sword',{damage:10,type:'wand',level:1,xp:0,maxXp:10,manaCost:1,speed:1,area:3,types:['ice','water'],levelUpRewards:[{owned:0,id:'damage',amount:1},{owned:0,id:'manaCost',amount:-0.2},{owned:0,id:'speed',amount:0.5}]})
        //giveCustomItem(e,e.player,'kubejs:custom_sword',{damage:10,type:'wand',level:1,xp:0,maxXp:10,manaCost:1,speed:1,area:3,pierce:2,types:['ice','water'],levelUpRewards:[{owned:0,id:'damage',amount:1},{owned:0,id:'manaCost',amount:-0.2},{owned:0,id:'speed',amount:0.5}]})
        //giveCustomItem(e,e.player,'kubejs:custom_sword',{damage:10,type:'wand',level:1,xp:0,maxXp:10,manaCost:1,speed:1,area:3,pierce:10,types:['ice','water'],levelUpRewards:[{owned:0,id:'damage',amount:1},{owned:0,id:'manaCost',amount:-0.2},{owned:0,id:'speed',amount:0.5}]})
        giveCustomItem(e, e.player, 'kubejs:custom_sword', { damage: 10, type: 'wand', level: 1, xp: 0, maxXp: 10, manaCost: 1, speed: 1, types: ['ice', 'water'], effects: { poison: { duration: 100, level: 1 } }, levelUpRewards: [{ owned: 0, id: 'damage', amount: 1 }, { owned: 0, id: 'manaCost', amount: -0.2 }, { owned: 0, id: 'speed', amount: 0.5 }] })
    } else if (count == 5) {
        let manager = $VeilRenderSystem.renderer().particleManager
        /*
        let emitter = manager.createEmitter(ResourceLocation)
        emitter.setPosition(<pos>) OR emitter.setAttachedEntity(entity)
        manager.addParticleSystem(emitter)
        */
    }
})
ServerEvents.tick(e => {
    e.server.getPlayers().forEach(player => {
        if (showEnemySpawnAreas) {
            enemySpawns.forEach(area => {
                let dimension = e.server.getLevel(area.dimension)
                if (area.type == 'circle') {
                    let block = dimension.getBlock(area.x, area.y, area.z)
                    if (block.getPlayersInRadius(100).length >= 1) {
                        let circle = area
                        circle.points = area.radius * 5
                        circle.particle = 'minecraft:cloud'
                        drawCircle(e, circle)
                    }
                } else if (area.type == 'rectangle') {
                    let block = dimension.getBlock(area.x1, area.y1, area.z1)
                    if (block.getPlayersInRadius(100).length >= 1) {
                        let cube = area
                        cube.points = 200
                        cube.particle = 'minecraft:cloud'
                        drawCube(e, cube)
                    }
                }
            })
        }
    })
})