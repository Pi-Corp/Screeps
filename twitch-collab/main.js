var roleBuilder = require('roleBuilder');
var roleDefender = require('roleDefender');
var roleHarvester = require('roleHarvester');
var roleHauler = require('roleHauler');
var roleUpgrader = require('roleUpgrader');
var towerControl = require('towerControl');
var CreepDesigner = require('creepDesigner');

module.exports.loop = function () {
    
    for(var name in Memory.creeps){
        if(!Game.creeps[name]){
          console.log('Clearing creep memory: ' + name + ' (' + Memory.creeps[name].role + ')');
          delete Memory.creeps[name];
        }
    }
  
    for(var rm in Game.rooms){
        //console.log('Current room: ' + rm);
        
        for(var spawnName in Game.spawns) {
          var spawn = Game.spawns[spawnName];
          if(Object(spawn.room, rm)) {
            if(spawn.room.name == rm) {
                var spawnName = spawnName;
            }
          }
        }
        
        towerControl.run(rm);
        
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
        var newName;
        
        var sources = Game.rooms[rm].find(FIND_SOURCES);
        var droppedSources = Game.rooms[rm].find(FIND_DROPPED_ENERGY);
        
        /*
        if(defenders.length < 1) {
            newName = Game.spawns['Spawn1'].createCreep([TOUGH,TOUGH,RANGED_ATTACK,ATTACK,HEAL,MOVE], {role: 'defender'});
            if(_.isString(newName)) {
                console.log('New Defender: ' + newName);
            }
        }
        */
        
        // harvesters
        if(harvesters.length < sources.length && !_.isString(newName)) {
            //console.log('Need another harvester');
            if(harvesters.length === 0 && Game.rooms[rm].energyAvailable < Game.rooms[rm].energyCapacityAvailable) {
                // emergency harvester made with current energy
                var creep = CreepDesigner.createCreep({
                  base: CreepDesigner.baseDesign.harvester,
                  room: Game.rooms[rm],
                  cap: CreepDesigner.caps.harvester,
                  canAffordOnly: true
                })
            } else {
                // best harvester with current max energy
                var creep = CreepDesigner.createCreep({
                  base: CreepDesigner.baseDesign.harvester,
                  room: Game.rooms[rm],
                  cap: CreepDesigner.caps.harvester
                })
            }
            
            newName = Game.spawns[spawnName].createCreep(creep, undefined, {role: 'harvester'});
            if(_.isString(newName)) {
                console.log('New Harvester: ' + newName);
            }
        }
        // haulers
        if(haulers.length < sources.length * 2 && !_.isString(newName)) {
            if(haulers.length < harvesters.length && Game.rooms[rm].energyAvailable < Game.rooms[rm].energyCapacityAvailable) {
                // emergency hauler made with current energy
                var creep = CreepDesigner.createCreep({
                  base: CreepDesigner.baseDesign.hauler,
                  room: Game.rooms[rm],
                  cap: CreepDesigner.caps.hauler,
                  canAffordOnly: true
                })
            } else {
                // best hauler with current max energy
                var creep = CreepDesigner.createCreep({
                  base: CreepDesigner.baseDesign.hauler,
                  room: Game.rooms[rm],
                  cap: CreepDesigner.caps.hauler
                })
            }
            
            newName = Game.spawns[spawnName].createCreep(creep, undefined, {role: 'hauler'});
            if(_.isString(newName)) {
                console.log('New Hauler: ' + newName);
            }
        }
        // upgraders
        if(upgraders.length < 1 && !_.isString(newName)) {
            if(Game.rooms[rm].controller.ticksToDowngrade < 1000 && Game.rooms[rm].energyAvailable < Game.rooms[rm].energyCapacityAvailable) {
                // emergency upgrader made with current energy
                var creep = CreepDesigner.createCreep({
                  base: CreepDesigner.baseDesign.upgrader,
                  room: Game.rooms[rm],
                  cap: CreepDesigner.caps.upgrader,
                  canAffordOnly: true
                })
            } else {
                // best upgrader with current max energy
                var creep = CreepDesigner.createCreep({
                  base: CreepDesigner.baseDesign.upgrader,
                  room: Game.rooms[rm],
                  cap: CreepDesigner.caps.upgrader
                })
            }
            
            newName = Game.spawns[spawnName].createCreep(creep, undefined, {role: 'upgrader'});
            if(_.isString(newName)) {
                console.log('New Upgrader: ' + newName);
            }
        }
        
        // builders
        if(builders.length < 2 && !_.isString(newName)) {
            // 1 builder per 5 construction sites
            if(builders.length === 0 && Game.rooms[rm].energyAvailable < Game.rooms[rm].energyCapacityAvailable) {
                // emergency builder made with current energy
                var creep = CreepDesigner.createCreep({
                  base: CreepDesigner.baseDesign.builder,
                  room: Game.rooms[rm],
                  cap: CreepDesigner.caps.builder,
                  canAffordOnly: true
                })
            } else {
                // best builder with current max energy
                var sites = Game.rooms[rm].find(FIND_MY_CONSTRUCTION_SITES)
                if(builders.length < sites.length / 5) {
                    var creep = CreepDesigner.createCreep({
                      base: CreepDesigner.baseDesign.builder,
                      room: Game.rooms[rm],
                      cap: CreepDesigner.caps.builder,
                    })
                }
            }
            
            newName = Game.spawns[spawnName].createCreep(creep, undefined, {role: 'builder'});
            if(_.isString(newName)) {
                console.log('New Builder: ' + newName);
            }
        }
        
        
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == 'builder') {
                roleBuilder.run(creep)
            }
            if(creep.memory.role == 'defender') {
                roleDefender.run(creep)
            }
            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }
            if(creep.memory.role == 'hauler') {
                roleHauler.run(creep);
            }
            if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
        }
    }
}
