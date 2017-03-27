module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.upgrading === undefined) {
            creep.memory.upgrading = false;   
        }
        
	    if(creep.memory.upgrading) {
	        var delivering = _.filter(Game.creeps, (c) => c.memory.role == 'hauler'
                            && c.memory.target == creep.id
            );
            // get energy if empty and nobody is bringing energy
	        if(creep.carry.energy == 0 && delivering.length == 0) {
	            creep.memory.upgrading = false;
	            //creep.say('collect')
	            return;
            }
            
	        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            if(creep.carry.energy == creep.carryCapacity) {
                creep.memory.upgrading = true;
                creep.memory.source = undefined;
                //creep.say('upgrade')
                return;
            }
            
            var source;
            if(creep.memory.source == undefined) {
                container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_CONTAINER
                });
                var distanceContainer = creep.pos.getRangeTo(container);
                if(distanceContainer < 10) {
                    source = container;
                }
                if(!source) {
                    source = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
                }
                if(!source) {
    	            source = creep.pos.findClosestByRange(FIND_SOURCES);
                }
                if(source) {
                    creep.memory.source = source.id;
                }
            } else {
                source = Game.getObjectById(creep.memory.source);
            }
            if(source == null || (source.structureType == 'container' && _.sum(source.store) == 0)) {
                creep.memory.source = undefined;
            } else {
                creep.memory.source = source.id;
            }
            if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
            } else if(creep.pickup(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
            } else if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};