var roleUpgrader = require('roleUpgrader');

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building) {
            // harvest if out of energy
            if(creep.carry.energy == 0) {
                creep.memory.building = false;
                creep.say('harvest');
                return;
	        }    
	        
	        // build up walls and ramparts if necessary
            var repairTargets = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_WALL 
                        || s.structureType == STRUCTURE_RAMPART)
                        && s.hits < 10000
            });
            if(repairTargets.length > 0) {
    	        if (creep.repair(repairTargets[0]) == ERR_NOT_IN_RANGE) {
                    // move towards the constructionSite
                    creep.moveTo(repairTargets[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                return;
            }
            
            // find closest constructionSite
            var constructionSite;
            if (creep.memory.myConstructionSite == undefined) {
                constructionSite = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_SPAWN});
                if (constructionSite == null) {
                    constructionSite = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_EXTENSION});
                }
                if (constructionSite == null) {
                    constructionSite = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_RAMPART});
                }
                if (constructionSite == null) {
                    constructionSite = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER});
                }
                if (constructionSite == null) {
                    constructionSite = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
                }
                if (constructionSite != null && constructionSite != undefined) {
                    creep.memory.myConstructionSite = constructionSite.id;
                }
            } else {
                constructionSite = Game.getObjectById(creep.memory.myConstructionSite);
                if (constructionSite == null) {
                    delete creep.memory.myConstructionSite;
                }
            }
            // if one is found
            if (constructionSite != undefined) {
                // try to build if the constructionSite is in range
                if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    // move towards the constructionSite
                    creep.moveTo(constructionSite, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            // if no constructionSite is found
            else {
                // go upgrading the controller
                if (creep.room.controller.level < 8) {
                    roleUpgrader.run(creep);
                }
            }
        } else {
            // build if full of energy
    	    if(creep.carry.energy == creep.carryCapacity) {
    	        creep.memory.building = true;
    	        creep.say('build');
    	        return;
    	    }

            // TODO: save to memory, prioritize collecting from container before source
	        var source = creep.pos.findClosestByRange(FIND_SOURCES);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }
	}
};