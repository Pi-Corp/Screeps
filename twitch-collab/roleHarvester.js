module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');
        var sources = creep.room.find(FIND_SOURCES);
        
        if(harvesters.length == sources.length || haulers.length > 0) {
            for(var h = 0; h < harvesters.length; h++) {
                harvesters[h].memory.currentsource = sources[h].id;
            }
            
            var source = Game.getObjectById(creep.memory.currentsource);
            var creepdistance = creep.pos.getRangeTo(source);
            
            if(creep.carry.energy == creep.carryCapacity && creepdistance == 1) {
                creep.drop(RESOURCE_ENERGY);
            }
        
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                // out of range, try to move closer and keep track of time waiting
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            
            return;
        }
        
        
        if(creep.memory.wait === undefined) { creep.memory.wait = 0; }
        if(creep.memory.harvesting === undefined) { creep.memory.harvesting = true; }
        
        if(creep.memory.harvesting) {
            if(creep.carry.energy == creep.carryCapacity) {
                creep.memory.harvesting = false;
                return;
            }
            
            // waiting too long, change source
            if(creep.memory.wait > 8 || creep.memory.currentsource === undefined) {
                _.forIn(sources, function(source) {
                    if (creep.memory.currentsource != source.id) {
                        creep.memory.currentsource = source.id;
                        creep.memory.wait = 0;
                    }
                });
            }

            // harvest energy
            var source = Game.getObjectById(creep.memory.currentsource);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                // out of range, try to move closer and keep track of time waiting
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                var creepdistance = creep.pos.getRangeTo(source);
                if(creepdistance > 1 && creepdistance < 5) { creep.memory.wait++; }
            } else {
                // no longer out of range
                creep.memory.wait = 0;
            }
        } else {
            if(creep.carry.energy === 0) {
                creep.memory.harvesting = true;
                // reset wait time just before harvesting again
                creep.memory.wait = 0;
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
            // found nothing that needs energy -- shouldn't happen but just in case
            if(!target) {
                creep.say('no dest')
                //console.log('error: no energy dest');
                return;
            }
            
            // drop off energy
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                //console.log('harvester target: ' + targets[0]);
            }
        }
	}
};