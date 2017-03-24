// module used from https://github.com/Arcath/screeps-code

module.exports = {
  createCreep: function(options){
    if(!options.extend){
      options.extend = options.base
    }

    if(options.canAffordOnly){
      var canSpend = options.room.energyAvailable
    }else{
      var canSpend = options.room.energyCapacityAvailable
    }

    if(canSpend > options.cap){
      var canSpend = options.cap
    }

    var creep = options.base
    var add = true
    var extendIndex = 0

    while(add){
      var creepCost = this.creepCost(creep)

      var nextPart = options.extend[extendIndex]

      if(creepCost + BODYPART_COST[nextPart] > canSpend){
        add = false
      }else{
        creep.push(options.extend[extendIndex])
        extendIndex += 1
        if(extendIndex == options.extend.length){
          extendIndex = 0
        }
      }
    }

    return creep
  },

  creepCost: function(creep){
    var cost = 0

    for(var part in creep){
      cost += BODYPART_COST[creep[part]]
    }

    return cost
  },

  baseDesign: {
    harvester: [WORK, WORK, CARRY, MOVE],
    upgrader: [WORK, CARRY, MOVE],
    hauler: [CARRY, CARRY, MOVE],
    builder: [WORK, WORK, CARRY, MOVE],
    mineralHarvester: [WORK, WORK, CARRY, MOVE],
    supplier: [CARRY, CARRY, MOVE],
    constructor: [WORK, WORK, CARRY, MOVE],
    defender: [TOUGH, MOVE, ATTACK, ATTACK]
  },

  caps: {
    harvester: 1200,
    upgrader: 800,
    hauler: 750,
    builder: 1200,
    mineralHarvester: 1200,
    supplier: 750,
    constructor: 1400,
    defender: 1200
  }
}