var roleUpgrader = require('roleUpgrader');

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.building === undefined) {
            creep.memory.building = false;
        }

        if(creep.memory.building) {
            var delivering = _.filter(Game.creeps, (c) => c.memory.role == 'hauler'
                            && c.memory.target == creep.id
            );
            // get energy if empty and nobody is bringing energy
            if(creep.carry.energy == 0 && delivering.length == 0) {
                creep.memory.building = false;
                //creep.say('refill');
                return;
	        }
                
            // repair walls and ramparts if necessary
            var repairTargets = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_WALL 
                        || s.structureType == STRUCTURE_RAMPART)
                        && s.hits < 10000
            });
            // repair roads
            if(repairTargets.length == 0) {
                repairTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_ROAD
                        && s.hits / s.hitsMax < 0.50
                });
            }

            if(repairTargets.length > 0) {
    	        if (creep.repair(repairTargets[0]) == ERR_NOT_IN_RANGE) {
                    // move towards the constructionSite
                    creep.moveTo(repairTargets[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                return;
            }
            
            // find closest constructionSite
            var constructionSite;
            if (creep.memory.constructionSite == undefined) {
                constructionSite = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_SPAWN});
                if (!constructionSite) {
                    constructionSite = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_EXTENSION});
                }
                if (!constructionSite) {
                    constructionSite = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_RAMPART});
                }
                if (!constructionSite) {
                    constructionSite = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_WALL});
                }
                if (!constructionSite) {
                    constructionSite = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER});
                }
                if (!constructionSite) {
                    constructionSite = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
                }
                if (constructionSite) {
                    creep.memory.constructionSite = constructionSite.id;
                }
            } else {
                constructionSite = Game.getObjectById(creep.memory.constructionSite);
                if (constructionSite == null) {
                    creep.memory.constructionSite = undefined;
                }
            }
            // if one is found
            if (constructionSite) {
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
    	        creep.memory.upgrading = undefined;
    	        creep.memory.source = undefined;
    	        //creep.say('build');
    	        return;
    	    }
            
            var source = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
            if(!source) {
                source = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_CONTAINER
                        && _.sum(s.store) > 0
                });
            }
            if(!source) {
	            source = creep.pos.findClosestByRange(FIND_SOURCES);
            }
            if(source == null) { return; }
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