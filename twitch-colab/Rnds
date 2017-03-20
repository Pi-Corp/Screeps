var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
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
                creep.say('upgrade')
                return;
            }
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleUpgrader;
