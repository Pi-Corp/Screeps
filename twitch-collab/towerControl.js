module.exports = {
    run: function(roomName) {
        var towers = Game.rooms[roomName].find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER);
            }
        })
        //console.log('#towers: ' + towers.length);
        
        if (towers.length === 0) {
            // create repair creep
        }
        
        for(var i in towers){
          var tower = towers[i]
    
          if(tower){
            runTower(tower);
          }
        }
    },
    
    runTower: function(tower){
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
        if(closestHostile){
          tower.attack(closestHostile);
        } else {
          var repairTargets = tower.pos.findInRange(FIND_STRUCTURES, 40, {
            filter: function(structure){
              if(structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART){
                return (structure.hits < 100000);
              }else{
                return (structure.hits < structure.hitsMax);
              }
            }
          })
    
          if(repairTargets.length){
            repairTargets.sort(function(a, b){
              return a.hits - b.hits;
            })
    
            tower.repair(repairTargets[0]);
          }
        }
    }
};