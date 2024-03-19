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
  
// TODO Veil documentation/ ingame editor


// TODO Enemy spawn system
// TODO Enemy that spawns more enemies on death
// TODO Multiple enemy health bars, jade display
// TODO Enemies that give effects
// TODO Story quest dungeon system, story dungeon quest requirement
// TODO Moral system, where the player has some morale points, and depending on what they do, the get or don't get some quests
// TODO Police that attacks bad players and arrests them
// TODO Clan system, there are a few diffrent clans and each npc belongs to one of them. When you do tasks for them you gain their trust. Depending on your trust, you will get or not get some quests
// TODO Auctions in shop, only at random times, with npc that also bid for the item
// TODO Infinite dungeon system, where more mobs spawn over time and get stronger
// TODO Lootcrate system
// TODO Solo boss system, where you get trapped in an arena until you die or kill the boss
// TODO Pet system
// TODO Pet simulator like system, where you have pets that mine blocks
// TODO Minigames for work
// TODO Version system, store current version in persisten data, display changelog on version change
// TODO Prototype equipment modification system
// TODO Equipmen modification rarities
// TODO Equipmen modification enchantments
// TODO Equipmen modification exchanging diffrent parts of the weapon to diffrent materials
// TODO Custom curious like system
// TODO Player home system, where they can build, with size upgrades in shop
// TODO Crafting mechanics for player home
// TODO Custom machines for player home
// TODO Custom magic rituals for player home
// TODO Timed bounty quest system
// TODO Timed event system
// TODO Players can own a flying ship that can travel to places. Is animated by moving the walls around the ship
// TODO Castle minigame, where you must defend a wall, spawn warriors, build turrets,...
// TODO Add more combat systems

// TODO Current issues:
//Items not appearing in emi, maybe not fixable, remove axiom and it will work
//Entityjs not having access to server side stuff, wait for sinytra connector team to answer

//Tips:
//block.blockState.randomTick(block.level, block.pos, block.level.random)

