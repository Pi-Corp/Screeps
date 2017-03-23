var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.wait === undefined) { creep.memory.wait = 0; }
        if(creep.memory.harvesting === undefined) { creep.memory.harvesting = true; }
        if(creep.memory.harvesting) {
            if(creep.carry.energy == creep.carryCapacity) {
                creep.memory.harvesting = false;
                return;
            }
            
            /* 
                changed: 
                currentsource is now the source id instead of index
                less cpu used if not having to 'find' as often
            */ 
            // waiting too long, change source
            if(creep.memory.wait > 8 || creep.memory.currentsource === undefined) {
                var sources = creep.room.find(FIND_SOURCES);
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
                if(creepdistance > 1) { creep.memory.wait++; }
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
            
            // primary targets: the extensions and spawns
            var targets = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION
                    || structure.structureType == STRUCTURE_SPAWN)
                    && structure.energy < structure.energyCapacity;
                }
            });
            if(!targets.length) {
                // targets : towers with less than 80% of energy
                targets = creep.room.find(FIND_MY_STRUCTURES, { 
                    filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER) 
                        && structure.energy < (structure.energyCapacity * 0.8);
                    }
                });
            }
            if(!targets.length) {
                // targets: container, link and storage
                targets = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                	return ((structure.structureType == STRUCTURE_CONTAINER) 
                    	|| (structure.structureType == STRUCTURE_STORAGE))
                    	&& structure.energy < structure.energyCapacity;
                    }
                });
            }
            if(!targets.length) {
                // targets : towers with less than 100% of energy
                targets = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                	return (structure.structureType == STRUCTURE_TOWER) 
                	    && structure.energy < structure.energyCapacity;
                    }
                });
            }
            // found nothing that needs energy -- shouldn't happen but just in case
            if(!targets.length) { 
                creep.say('no dest')
                console.log('error: no energy dest');
                return;
            }
            
            // drop off energy
            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
	}
};

module.exports = roleHarvester;
