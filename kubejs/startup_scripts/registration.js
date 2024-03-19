const UUID = Java.loadClass('java.util.UUID')
Platform.mods.kubejs.name = 'Fantasy craft'
ItemEvents.toolTierRegistry(event => {
	event.add('fantasy_craft.mystery_lands_lv1', tier => {
		tier.uses = -1
		tier.speed = 0
		tier.level = 6
		tier.attackDamageBonus = 0
	})
})
ItemEvents.armorTierRegistry(event => {
	event.add('fantasy_craft.mystery_lands_lv1', tier => {
		tier.durabilityMultiplier = -1
		tier.slotProtections = [0, 0, 0, 0]
		tier.equipSound = 'minecraft:item.armor.equip_iron'
		tier.toughness = 0
		tier.knockbackResistance = 0
	})
})
StartupEvents.registry('item', event => {
    event.create('custom_sword', 'sword').tier('fantasy_craft.mystery_lands_lv1').texture('minecraft:item/wooden_sword').color(0, 0xAFC875).displayName('Custom sword').rarity('common').maxDamage(0)

	event.create('custom_helmet', 'helmet').tier('fantasy_craft.mystery_lands_lv1').texture('minecraft:item/leather_helmet').displayName('Custom helmet').rarity('common').maxDamage(0)
	event.create('custom_chestplate', 'chestplate').tier('fantasy_craft.mystery_lands_lv1').texture('minecraft:item/leather_chestplate').displayName('Custom chestplate').rarity('common').maxDamage(0)
	event.create('custom_leggings', 'leggings').tier('fantasy_craft.mystery_lands_lv1').texture('minecraft:item/leather_leggings').displayName('Custom leggings').rarity('common').maxDamage(0)
	event.create('custom_boots', 'boots').tier('fantasy_craft.mystery_lands_lv1').texture('minecraft:item/leather_boots').displayName('Custom boots').rarity('common').maxDamage(0)

    event.create('cheat_item').texture('minecraft:item/barrier').displayName('Cheat item')

    let questIcons = [0xFF5733, 0x581845, 0x008080, 0xFFC300, 0xFF6363, 0x40E0D0, 0xFFD700, 0x800000, 0x0000FF, 0x808080, 0xFF00FF, 0x7FFFD4, 0xDAA520, 0x008000, 0xFFFF00, 0x000080, 0x800080, 0xB22222, 0xFFA500, 0x4682B4]
    for(let i = 0;i < questIcons.length;i++) {
        event.create(`quest_icon${i}`, )
        .texture('layer0', 'kubejs:item/quest_icon')
        .texture('layer1', 'kubejs:item/quest_icon_overlay')
        .color(1, questIcons[i])
    }
})
StartupEvents.registry('block', event => {
    event.create('machine_block').soundType('netherite_block').blockEntity(entityInfo => {
        entityInfo.inventory(9, 4) // create inventory to 9x4 / 36 slots
        entityInfo.rightClickOpensInventory() // Right-clicking on entity opens its inventory
        entityInfo.clientTick(12, 0, entity => { // Tick on client side only. 12, 0 = every 12 ticks with offset 0 (tick % 12 == 0)
            entity.level.addParticle('minecraft:campfire_cosy_smoke', true, entity.x + 0.5, entity.y + 1.05, entity.z + 0.5, 0, 0.3, 0)
        })
        entityInfo.serverTick(20, 0, entity => { // Tick on server side only
            entity.inventory.insertItem('minecraft:apple', false)
        })
    })
})
StartupEvents.registry('mob_effect', event => {
    event.create('immovable').displayName('Immovable').modifyAttribute('generic.movement_speed',UUID.randomUUID(),-100,'multiply_total').modifyAttribute('forge:entity_gravity',UUID.randomUUID(),10000,'multiply_total').color(Color.BLACK)
})
StartupEvents.registry('entity_type', event => {
    event.create('npc1', 'entityjs:animal')
    .eggItem(item => {
        item.backgroundColor(0x0000FF)
        item.highlightColor(0x0099FF)
    })
    .onInteract(ctx => {
        if(ctx.hand == 'MAIN_HAND') {
            if(!ctx.entity.getLevel().isClientSide()) return InteractionResult.PASS
            Client.player.sendData('rpg_npc_interaction', {entity:ctx.entity.stringUuid,level:ctx.entity.level.dimension.toString()})
        }
        return InteractionResult.PASS
    })
    .isPersistenceRequired(true)
    .isInvulnerableTo(ctx => {
        if(ctx.damageSource.type().msgId() != 'genericKill') {
            return true
        } else {
            return false
        }
    })
    .isPushable(false)
    .addAnimationController('idleAnimation', 5, e => {
        e.addTriggerableAnimation('idle', 'idleing', 'play_once')
        return true
    })
    .tick(entity => {
        if (entity.age % 100 != 0) return
        if (Math.random() <= 0.99) return
        entity.triggerAnimation('idleAnimation', 'idleing')
    })
})
/*


global.interact = context => {
    if (context.player.isShiftKeyDown()) return InteractionResult.FAIL
    context.player.startRiding(context.entity);
    return InteractionResult.sidedSuccess(context.entity.level.isClientSide());
}

you want an undespawnable mob?
.isPersistenceRequired(true)

Serverscripts:
EntityJSEvents.addGoalSelectors('kubejs:wyrm', e => {
    e.meleeAttack(4, 1, true)
})
EntityJSEvents.addGoals("kubejs:wyrm", event => {
    let Cow = Java.loadClass('net.minecraft.world.entity.animal.Cow')
    event.hurtByTarget(1, [Cow], true, [Cow])
    event.nearestAttackableTarget(2, Cow, 5, false, false, entity => {
        return entity.age < 500
    })
})
*/