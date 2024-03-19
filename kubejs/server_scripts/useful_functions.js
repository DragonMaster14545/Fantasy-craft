//priority: 10
const BigDecimal = Java.loadClass("java.math.BigDecimal")
function getRandomCoordinate(minX, minY, minZ, maxX, maxY, maxZ) {
    const randomX = Math.random() * (maxX - minX) + minX
    const randomY = Math.random() * (maxY - minY) + minY
    const randomZ = Math.random() * (maxZ - minZ) + minZ
  
    return { x: Math.floor(randomX), y: Math.floor(randomY), z: Math.floor(randomZ) }
}
  function isPointInsideRange(x1, y1, z1, x2, y2, z2, x3, y3, z3, dim, blockDim) {
    const minX = Math.min(x1, x2)
    const minY = Math.min(y1, y2)
    const minZ = Math.min(z1, z2)
    const maxX = Math.max(x1, x2)
    const maxY = Math.max(y1, y2)
    const maxZ = Math.max(z1, z2)
    const isInsideX = x3 >= minX && x3 <= maxX
    const isInsideY = y3 >= minY && y3 <= maxY
    const isInsideZ = z3 >= minZ && z3 <= maxZ
    return isInsideX && isInsideY && isInsideZ && dim == blockDim
}
function formatBigDecimal(bigNumber) {
    if (bigNumber.compareTo(BigDecimal("10000000000000000000000000000000000")) >= 0) {
        let E = bigNumber.setScale(0, 'half_up')
        E = E.toString()
        E = E.length()
        bigNumber = bigNumber.divide(BigDecimal(`1e${E - 1}`))
        E -= 33
        return bigNumber.setScale(2, 'half_up') + ` E+${E}`
    } else if (bigNumber.compareTo(BigDecimal("1000000000000000000000000000000000")) >= 0) {
        return (bigNumber.divide(BigDecimal("1000000000000000000000000000000000"))).setScale(2, 'half_up') + ' Dc';
    } else if (bigNumber.compareTo(BigDecimal("1000000000000000000000000000000")) >= 0) {
        return (bigNumber.divide(BigDecimal("1000000000000000000000000000000"))).setScale(2, 'half_up') + ' No';
    } else if (bigNumber.compareTo(BigDecimal("1000000000000000000000000000")) >= 0) {
        return (bigNumber.divide(BigDecimal("1000000000000000000000000000"))).setScale(2, 'half_up') + ' Oc';
    } else if (bigNumber.compareTo(BigDecimal("1000000000000000000000000")) >= 0) {
        return (bigNumber.divide(BigDecimal("1000000000000000000000000"))).setScale(2, 'half_up') + ' Sp';
    } else if (bigNumber.compareTo(BigDecimal("1000000000000000000000")) >= 0) {
        return (bigNumber.divide(BigDecimal("1000000000000000000000"))).setScale(2, 'half_up') + ' Sx';
    } else if (bigNumber.compareTo(BigDecimal("1000000000000000000")) >= 0) {
        return (bigNumber.divide(BigDecimal("1000000000000000000"))).setScale(2, 'half_up') + ' Qi';
    } else if (bigNumber.compareTo(BigDecimal("1000000000000000")) >= 0) {
        return (bigNumber.divide(BigDecimal("1000000000000000"))).setScale(2, 'half_up') + ' Qa';
    } else if (bigNumber.compareTo(BigDecimal("1000000000000")) >= 0) {
        return (bigNumber.divide(BigDecimal("1000000000000"))).setScale(2, 'half_up') + ' T';
    } else if (bigNumber.compareTo(BigDecimal("1000000000")) >= 0) {
        return (bigNumber.divide(BigDecimal("1000000000"))).setScale(2, 'half_up') + ' B';
    } else if (bigNumber.compareTo(BigDecimal("1000000")) >= 0) {
        return (bigNumber.divide(BigDecimal("1000000"))).setScale(2, 'half_up') + ' M';
    } else if (bigNumber.compareTo(BigDecimal("1000")) >= 0) {
        return (bigNumber.divide(BigDecimal("1000"))).setScale(2, 'half_up') + ' K';
    } else if (bigNumber.compareTo(BigDecimal("0.01")) >= 0) {
        return bigNumber.setScale(2, 'half_up')
    } else {
        return 0
    }
}
function formatTimeLong(time) {
    if (time < 20) {
        return time + ' ticks'
    } else if (time < 20 * 60) {
        return (time / 20).toFixed(1) + ' seconds'
    } else if (time < 20 * 60 * 60) {
        return (time / (20 * 60)).toFixed(1) + ' minutes'
    } else if (time < 20 * 60 * 60 * 24) {
        return (time / (20 * 60 * 60)).toFixed(1) + ' hours'
    } else if (time < 20 * 60 * 60 * 24 * 7) {
        return (time / (20 * 60 * 60 * 24)).toFixed(1) + ' days'
    } else if (time < 20 * 60 * 60 * 24 * 7 * 4.33) {
        return (time / (20 * 60 * 60 * 24 * 7)).toFixed(1) + ' weeks'
    } else if (time < 20 * 60 * 60 * 24 * 7 * 4.33 * 52) {
        return (time / (20 * 60 * 60 * 24 * 7 * 4.33)).toFixed(1) + ' months'
    } else {
        return formatLargeNumber(time / (20 * 60 * 60 * 24 * 7 * 4.33 * 52)) + ' years'
    }
}
function formatTimeShort(time) {
    if (time < 20) {
        return time + ' t'
    } else if (time < 20 * 60) {
        return (time / 20).toFixed(1) + ' s'
    } else if (time < 20 * 60 * 60) {
        return (time / (20 * 60)).toFixed(1) + ' m'
    } else if (time < 20 * 60 * 60 * 24) {
        return (time / (20 * 60 * 60)).toFixed(1) + ' h'
    } else if (time < 20 * 60 * 60 * 24 * 7) {
        return (time / (20 * 60 * 60 * 24)).toFixed(1) + ' d'
    } else if (time < 20 * 60 * 60 * 24 * 7 * 4.33) {
        return (time / (20 * 60 * 60 * 24 * 7)).toFixed(1) + ' w'
    } else if (time < 20 * 60 * 60 * 24 * 7 * 4.33 * 52) {
        return (time / (20 * 60 * 60 * 24 * 7 * 4.33)).toFixed(1) + ' mo'
    } else {
        return formatLargeNumber(time / (20 * 60 * 60 * 24 * 7 * 4.33 * 52)) + ' y'
    }
}
function timeToTicks(amount,unit) {
    if(unit == 't') {
        return BigDecimal(amount)
    } else if(unit == 's') {
        return BigDecimal(20).multiply(BigDecimal(amount))
    } else if(unit == 'm') {
        return BigDecimal(20).multiply(BigDecimal(60)).multiply(BigDecimal(amount))
    } else if(unit == 'h') {
        return BigDecimal(20).multiply(BigDecimal(60)).multiply(BigDecimal(60)).multiply(BigDecimal(amount))
    } else if(unit == 'd') {
        return BigDecimal(20).multiply(BigDecimal(60)).multiply(BigDecimal(60)).multiply(BigDecimal(24)).multiply(BigDecimal(amount))
    } else if(unit == 'w') {
        return BigDecimal(20).multiply(BigDecimal(60)).multiply(BigDecimal(60)).multiply(BigDecimal(24)).multiply(BigDecimal(7)).multiply(BigDecimal(amount))
    } else if(unit == 'mo') {
        return BigDecimal(20).multiply(BigDecimal(60)).multiply(BigDecimal(60)).multiply(BigDecimal(24)).multiply(BigDecimal(30)).multiply(BigDecimal(amount))
    } else if(unit == 'j') {
        return BigDecimal(20).multiply(BigDecimal(60)).multiply(BigDecimal(60)).multiply(BigDecimal(24)).multiply(BigDecimal(365)).multiply(BigDecimal(amount))
    }
}
function stepServerTime(e) {
    let serverPersistantData = e.server.persistentData
    serverPersistantData.timeS++
    if(serverPersistantData.timeS >= 60) {
        serverPersistantData.timeS = 0
        serverPersistantData.timeM++
        if(serverPersistantData.timeM >= 60) {
            serverPersistantData.timeM = 0
            serverPersistantData.timeH++
            if(serverPersistantData.timeH >= 24) {
                serverPersistantData.timeH = 0
                serverPersistantData.timeD++
                if(serverPersistantData.timeD >= 365) {
                    serverPersistantData.timeD = 0
                    serverPersistantData.timeY++
                }
            }
        }
    }
}
function getServerTimeInTicks(e) {
    let serverPersistantData = e.server.persistentData
    let time = BigDecimal(20).multiply(BigDecimal(serverPersistantData.timeS))
    time = time.add(BigDecimal(20).multiply(BigDecimal(60)).multiply(BigDecimal(serverPersistantData.timeM)))
    time = time.add(BigDecimal(20).multiply(BigDecimal(60)).multiply(BigDecimal(60)).multiply(BigDecimal(serverPersistantData.timeH)))
    time = time.add(BigDecimal(20).multiply(BigDecimal(60)).multiply(BigDecimal(60)).multiply(BigDecimal(24)).multiply(BigDecimal(serverPersistantData.timeD)))
    time = time.add(BigDecimal(20).multiply(BigDecimal(60)).multiply(BigDecimal(60)).multiply(BigDecimal(24)).multiply(BigDecimal(365)).multiply(BigDecimal(serverPersistantData.timeY)))
    return time
}
function getServerTimeFormated(e) {
    let serverPersistantData = e.server.persistentData
    return 'S: '+serverPersistantData.timeS+' m: '+serverPersistantData.timeM+' h: '+serverPersistantData.timeH+' d: '+serverPersistantData.timeD+' y: '+serverPersistantData.timeY
}
function sendTimeToPlayer(e,player) {
        player.tell(Text.green(getServerTimeFormated(e)))
}
function ErrorProveAdding(numberArray, percentArray) {
    let result = 0
    let resultPercent = 100
    numberArray.forEach(toAdd => {
        if (toAdd) {
            result += toAdd
        }
    })
    if (percentArray) {
        percentArray.forEach(percent => {
            if (percent) {
                resultPercent += percent
            }
        })
    }
    result = result * resultPercent / 100
    if (result == 0) {
        return undefined
    } else {
        if (countDecimals(result) > 2) {
            result = Math.floor(result * 100) / 100
        }
        return result
    }
}
function countDecimals(number) {
    if (Math.floor(number) == number) {
        return 0
    } else {
        return number.toString().split('.')[1].length
    }
}
function calculateMovement(angleX, angleY) {
    angleX = angleX * JavaMath.PI / 180
    angleY = angleY * JavaMath.PI / 180
    let movementX = -Math.sin(angleY) * Math.cos(angleX)
    let movementY = -Math.sin(angleX)
    let movementZ = Math.cos(angleY) * Math.cos(angleX)
  
    return { movementX: movementX, movementY: movementY, movementZ: movementZ }
  }
function getEntityTypes(e,entity) {
    if(entity.persistentData) {
        if(entity.persistentData.types) {
            return entity.persistentData.types
        } else return []
    } else return []
}
function getMainHandItemTypes(e,player) {
    if(player.mainHandItem) {
        if(player.mainHandItem.hasNBT()) {
            let itemDetails = e.server.persistentData.playerData[player.stringUuid].itemDetails
            return itemDetails[player.mainHandItem.nbt.customDataId].types
        } else {
            return []
        }
    } else {
        return []
    }
}
function getWandItemTypes(e,player,wandId) {
    let itemDetails = e.server.persistentData.playerData[player.stringUuid].itemDetails
    return itemDetails[wandId].types
}
function getArmorItemTypes(e,player){
    let itemDetails = e.server.persistentData.playerData[player.stringUuid].itemDetails
    let types = []
    if(player.feetArmorItem) {
        if(player.feetArmorItem.hasNBT()) {
            itemDetails[player.feetArmorItem.nbt.customDataId].types.forEach(type => {
                types.push(type)
            })
        }
    }
    if(player.legsArmorItem) {
        if(player.legsArmorItem.hasNBT()) {
            itemDetails[player.legsArmorItem.nbt.customDataId].types.forEach(type => {
                types.push(type)
            })
        }
    }
    if(player.chestArmorItem) {
        if(player.chestArmorItem.hasNBT()) {
            itemDetails[player.chestArmorItem.nbt.customDataId].types.forEach(type => {
                types.push(type)
            })
        }
    }
    if(player.headArmorItem) {
        if(player.headArmorItem.hasNBT()) {
            itemDetails[player.headArmorItem.nbt.customDataId].types.forEach(type => {
                types.push(type)
            })
        }
    }
    return types
}
function calculateTypeDamageMultiplier(attackerTypes,attackedTypes) {
    if(attackerTypes && attackedTypes) {
        if(attackerTypes.length >= 1 && attackedTypes.length >= 1) {
        let multipliers = []
        attackerTypes.forEach(type => {
            let multiplier = 1
            attackedTypes.forEach(type2 => {
                multiplier += types[type.asString][type2.asString]
            })
            multiplier /= (attackedTypes.length+1)
            multipliers.push(multiplier)
        })
        let endMultiplier = 1
        multipliers.forEach(multiplier => {
            endMultiplier += multiplier
        })
        endMultiplier /= (multipliers.length+1)
        return endMultiplier
    } else {
        return 1
    }
} else {
    return 1
}
}
function getBonus(e,player,type,bonusCategory,amount) {
    let playerData = e.server.persistentData.playerData[player.stringUuid]
    let playerStats = playerData.stats
    let bonuses = {}
    for(let key in playerStats) {
        if(bonuses[key]) {
            bonuses[key].amount += playerStats[key].amount
        } else {
            bonuses[key] = {amount:playerStats[key].amount}
        }
    }
    playerData.servants.forEach(servant => {
        if(servant.type == 'buff') {
            servant.buffs.forEach(buff => {
                if(bonuses[buff.id]) {
                    bonuses[buff.id].amount += buff.amount
                } else {
                    bonuses[buff.id] = {amount:buff.amount}
                }
            })
        }
    })
    for(let key in bonuses) {
        let stat = stats[key]
        if(stat.type == type) {
            if(stat.stat == bonusCategory) {
                if(stat.mode == '+') {
                    amount += bonuses[key].amount
                } else if(stat.mode == '*') {
                    amount *= bonuses[key].amount
                } else if(stat.mode == '-') {
                    amount -= bonuses[key].amount
                } else if(stat.mode == '/') {
                    amount /= bonuses[key].amount
                }
            }
        }
    }
    return amount
}
function getPlayerMainHandItemDamage(e,player) {
    let playerData = e.server.persistentData.playerData[player.stringUuid]
    let itemDataPath = playerData.itemDetails
    let item = player.mainHandItem
    let toReturn
    if(item.hasNBT()) {
        if(item.nbt.customDataId) {
        	let itemCustomData = itemDataPath[item.nbt.customDataId]
            toReturn = {damage:getBonus(e,player,itemCustomData.type,'damage',itemCustomData.damage),area:itemCustomData.area,pierce:itemCustomData.pierce}
            if(itemCustomData.effects) {
                toReturn.effects = []
                for(let key in itemCustomData.effects) {
                    let selectedEffect = itemCustomData.effects[key]
                    toReturn.effects.push({id:effects[key].id,duration:selectedEffect.duration,level:selectedEffect.level})
                }
            }
        } else toReturn = {damage:0}
    } else toReturn = {damage:0}
    return toReturn
}
function getPlayerWandItemDamage(e,player,wandId) {
    let playerData = e.server.persistentData.playerData[player.stringUuid]
    let itemDataPath = playerData.itemDetails
    let itemCustomData = itemDataPath[wandId]
    let toReturn
    if(itemCustomData.damage) {
        toReturn = {damage:getBonus(e,player,itemCustomData.type,'damage',itemCustomData.damage)}
    } else {
        toReturn = {damage:0}
    }
    if(itemCustomData.effects) {
        toReturn.effects = []
        for(let key in itemCustomData.effects) {
            let selectedEffect = itemCustomData.effects[key]
            toReturn.effects.push({id:effects[key].id,duration:selectedEffect.duration,level:selectedEffect.level})
        }
    }
    return toReturn
}
function getPlayerArmor(e,player) {
    let items = ['feetArmorItem','legsArmorItem','chestArmorItem','headArmorItem']
    let playerData = e.server.persistentData.playerData[player.stringUuid]
    let itemDataPath = playerData.itemDetails
    let armor = {armor:0}
    items.forEach(itemName => {
        let item = player[itemName]
        if(item.hasNBT()) {
            if(item.nbt.customDataId) {
            let itemCustomData = itemDataPath[item.nbt.customDataId]
            armor.armor += getBonus(e,player,itemCustomData.type,'armor',itemCustomData.armor)
            }
        }
    })
    return armor
}
function getPlayerLuck(e,player) {
    let items = ['feetArmorItem','legsArmorItem','chestArmorItem','headArmorItem']
    let playerData = e.server.persistentData.playerData[player.stringUuid]
    let itemDataPath = playerData.itemDetails
    let luck = {luck:0}
    items.forEach(itemName => {
        let item = player[itemName]
        if(item.hasNBT()) {
            if(item.nbt.customDataId) {
            let itemCustomData = itemDataPath[item.nbt.customDataId]
                if(itemCustomData.luck) {
                luck.luck += getBonus(e,player,itemCustomData.type,'luck',itemCustomData.luck)
                }
            }
        }
    })
    return luck
}
  /*
  function getRandomPointInCircle(circleName) {
    let circle = mysteryLandsCircles[circleName]
    var randomRadius = Math.random() * circle.radius
    var theta = Math.random() * (2 * JavaMath.PI)
    var x = circle.x + randomRadius * Math.cos(theta)
    var z = circle.z + randomRadius * Math.sin(theta)
    var randomPoint = { x: x, y: circle.y, z: z }
    return randomPoint
  }
  function isPlayerInsideCircle(playerX, playerY, playerZ, playerDim, circleName) {
    let range = 5
    let circleCenterX = mysteryLandsCircles[circleName].x
    let circleCenterY = mysteryLandsCircles[circleName].y
    let circleCenterZ = mysteryLandsCircles[circleName].z
    let circleDim = mysteryLandsCircles[circleName].dimension
    let circleRadius = mysteryLandsCircles[circleName].radius
    let minY = circleCenterY - range
    let maxY = circleCenterY + range
    let distance = Math.sqrt(Math.pow(playerX - circleCenterX, 2) + Math.pow(playerZ - circleCenterZ, 2))
    return distance <= circleRadius && playerY >= minY && playerY <= maxY && playerDim == circleDim
  }
  */