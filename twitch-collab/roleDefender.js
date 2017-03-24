module.exports = {

    run: function(creep) {
        
        var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);

        if(hostiles.length == 0) {
            creep.memory.maintain = true;
            creep.memory.defending = false;
            creep.say('maintain')
        }
        if(hostiles.length >= 1 && creep.hits > (creep.hitsMax * .40)) {
            creep.memory.maintain = false;
            creep.memory.defending = true;
            creep.memory.wounded = false;
            creep.say('For Glory!');
        }
        /*
        if(wounded) {
            creep.memory.maintain = true;
            creep.memory.defending = false;
            creep.memory.wounded = true;
            creep.say('Falling Back!');
        }
        */
        if(hostiles.length > 0) {
            var username = hostiles[0].owner.username;
            var rampart = creep.room.find(STRUCTURE_RAMPART)
            var dtt = creep.pos.getRangeTo(hostiles);
            Game.notify('This Bitch ${username} is in ${roomName}');
            if(creep.memory.defending) {
                creep.moveTo(rampart[0])
            }
            if(dtt <= 3) {
                creep.attack(hostiles)
            }
        }
    }
};