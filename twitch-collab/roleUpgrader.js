module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.upgrading === undefined) {
            creep.memory.upgrading = false;   
        }
        
	    if(creep.memory.upgrading) {
	        if(creep.carry.energy == 0) {
	            creep.memory.upgrading = false;
	            creep.say('harvest')
	            return;
}
	        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            if(creep.carry.energy == creep.carryCapacity) {
                creep.memory.upgrading = true;
                creep.memory.source = undefined;
                creep.say('upgrade')
                return;
            }
            
            
            var source;
            var sourceType = 'dropped';
            if(creep.memory.source == undefined) {
                source = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
                if (!source) {
    	            source = creep.pos.findClosestByRange(FIND_SOURCES);
    	            sourceType = '';
                }
                if(source) {
                    creep.memory.source = source.id;
                }
            } else {
                source = Game.getObjectById(creep.memory.source);
            }
            if(source == null) {
                creep.memory.source = undefined;
            }
            if(sourceType == 'dropped') {
                if(creep.pickup(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};