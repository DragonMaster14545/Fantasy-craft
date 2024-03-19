ServerEvents.commandRegistry(e => {
    const { commands: Commands, arguments: Arguments } = e
    let cmd = Commands.literal('fantasy_craft')
  
    cmd.then(Commands.literal('resetPlayer').requires(s => true)
        .executes(ctx => {
          ctx.source.playerOrException.persistentData.initiated = false
          ctx.source.sendSuccess(Text.of('Sucesfully reset player'), false)
          return 1;
        })
      )
    e.register(cmd)
  })


// TODO Current issues:
//Items not appearing in emi, maybe not fixable, remove axiom and it will work
//Entityjs not having access to server side stuff, wait for sinytra connector team to answer

//Tips:
//block.blockState.randomTick(block.level, block.pos, block.level.random)
//e.server.getLevel().getBlock().getPlayersInRadius(20)
//item.addAttributeModifier("minecraft:generic.attack_damage",new AttributeModifier('Damage',customData.damage,AttributeModifier$Operation.ADDITION),EquipmentSlot.MAINHAND)

