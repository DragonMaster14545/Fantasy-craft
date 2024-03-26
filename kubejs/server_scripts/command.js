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
/*
global.extraTickCube = entity => {
  const { level, blockPos } = entity;
  const range = 5; // Range for checking around the cube
  const extraTicksCube = Math.floor(Math.random() * 10) + 1;
  const chanceToApplyTicksCube = Math.random() * 0.7 + 0.1;

  // Iterate over a cube area around the block
  for (let dx = -range; dx <= range; dx++) {
    for (let dy = -range; dy <= range; dy++) {
      for (let dz = -range; dz <= range; dz++) {
        let adjacentPos = blockPos.offset(dx, dy, dz);
        let adjacentBlockState = level.getBlockState(adjacentPos);

        if (adjacentBlockState.block.id == "kubejs:cube_of_growth") continue;

        // Check if the block is plantable and apply extra growth ticks if it is
        if (adjacentBlockState.block instanceof $IPlantable) {
          if (Math.random() < chanceToApplyTicksCube) {
            for (let i = 0; i < extraTicksCube; i++) {
              adjacentBlockState.randomTick(level, adjacentPos, level.random);
            }
          }
        }

        // Now check for block entities to apply extra operational ticks
        let blockEntity = level.getBlockEntity(adjacentPos);
        if (blockEntity && Math.random() < chanceToApplyTicksCube) {
          let ticker = adjacentBlockState.block.getTicker(level, adjacentBlockState, blockEntity.getType());
          //level.server.tell(`${adjacentBlockState.block.id} block ticker`)
          if (ticker) {
            for (let i = 0; i < extraTicksCube; i++) {
              level.server.tell(`${adjacentBlockState.block.id} block ticker`)
              ticker.tick(level, adjacentPos, adjacentBlockState, blockEntity);
            }
          }
        }
      }
    }
  }
};
*/

