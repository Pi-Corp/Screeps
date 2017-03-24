module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.hauling === undefined) { creep.memory.hauling = false; }
        
        if(!creep.memory.hauling) {
            if(creep.carry.energy == creep.carryCapacity) {
                creep.memory.hauling = true;
                return;
            }
            
            var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');
            var droppedSources = creep.room.find(FIND_DROPPED_ENERGY);
        
            if(haulers.length > 0) {
                
                if(creep.memory.currentsource === undefined) {
                    var min = 100;
                    var leastOccupiedSource;
                    
                    _.forIn(droppedSources, function(source) {
                        var haulersAtSource = _.filter(Game.creeps, (h) => h.memory.role == 'hauler' && h.memory.currentsource == source.id);
                        if(haulersAtSource.length < min) {
                            min = haulersAtSource.length;
                            leastOccupiedSource = source.id;
                        }
                    });
                    
                    console.log('Assigning hauler to source: ' + leastOccupiedSource);
                    creep.memory.currentsource = leastOccupiedSource;
                }
            }

            //var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
            var target = Game.getObjectById(creep.memory.currentsource);
            if(target) {
                if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
            if(creep.carry.energy === 0) {
                creep.memory.hauling = false;
                return;
            }

            //Prioritized energy dropoff
            
            // primary targets: extensions - usually close to sources
            var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => {
                return s.structureType == STRUCTURE_EXTENSION
                    && s.energy < s.energyCapacity;
                }
            });
            //if(!targets.length) {
            if(!target) {
                // targets : spawn
                target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => {
                return s.structureType == STRUCTURE_SPAWN
                    && s.energy < s.energyCapacity;
                }
            });
            }
            if(!target) {
                // targets : towers with less than 80% of energy
                target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { 
                    filter: (s) => {
                    return (s.structureType == STRUCTURE_TOWER) 
                        && s.energy < (s.energyCapacity * 0.8);
                    }
                });
            }
            if(!target) {
                // targets: container, link and storage
                target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (s) => {
                	return ((s.structureType == STRUCTURE_CONTAINER) 
                    	|| (s.structureType == STRUCTURE_STORAGE))
                    	&& s.energy < s.energyCapacity;
                    }
                });
            }
            if(!target) {
                // targets : towers with less than 100% of energy
                target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (s) => {
                	return (s.structureType == STRUCTURE_TOWER) 
                	    && s.energy < s.energyCapacity;
                    }
                });
            }
            // found nothing that needs energy -- not enough storage, not spawning enough
            if(!target) {
                creep.say('no dest')
                creep.memory.hauling = false;
                return;
            }
            
            // if target is further away than dropped energy source, refill first
            if(creep.carry.energy < creep.carryCapacity) {
                var droppedSource = Game.getObjectById(creep.memory.currentsource);
                var sourceDistance = creep.pos.getRangeTo(droppedSource);
                var targetDistance = creep.pos.getRangeTo(target);
                
                if(targetDistance >= sourceDistance) {
                    creep.say('refill');
                    creep.memory.hauling = false;
                    return;
                }
            }
            
            // drop off energy
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                //console.log('harvester target: ' + targets[0]);
            }
        }
	}
};