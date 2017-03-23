var roleHarvester = require('Workers');
var roleUpgrader = require('Rnds');
var roleBuilder = require('Dans');
var roleDefender = require('MyBads');

module.exports.loop = function () {
  
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
    var newName;
    
    if(defenders.length < 1) {
        newName = Game.spawns['HQ'].createCreep([TOUGH,TOUGH,RANGED_ATTACK,ATTACK,HEAL,MOVE], {role: 'defender'});
        if(_.isString(newName)) {
            console.log('New Defender: ' + newName);
        }
    }
    if(harvesters.length < 2 && !_.isString(newName)) {
        newName = Game.spawns['HQ'].createCreep([WORK,CARRY,CARRY,MOVE], {role: 'harvester'});
        if(_.isString(newName)) {
            console.log('New Harvester: ' + newName);
        }
    }
    if(upgraders.length < 3  && !_.isString(newName)) {
        newName = Game.spawns['HQ'].createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], {role: 'upgrader'});
        if(_.isString(newName)) {
        console.log('New Upgrader: ' + newName);
        }
    }
    if(builders.length < 1 && !_.isString(newName)) {
        newName = Game.spawns['HQ'].createCreep([WORK,WORK,CARRY,MOVE], {role: 'builder'});
        if(_.isString(newName)) {
        console.log('New Builder: ' + newName);
        }
    }
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep)
        }
        if(creep.memory.role == 'defender') {
            roleDefender.run(creep)
        }
    }
}
