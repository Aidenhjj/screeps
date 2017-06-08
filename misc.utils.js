var miscUtils = {

    expandArr: function(arr, repeat) {
        newArr = [];
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < repeat[i]; j++) {
                newArr.push(arr[i])
            }
        }
        return newArr;
    },

    /** @param {Creep} creep **/
    createCreep: function(spawn, type, rank, startingRole) {
        var creepTypes = {
            worker: [WORK, CARRY, MOVE],
            soldier: [MOVE, ATTACK, ATTACK],
        }
        if (creepTypes[type]) {
            var bodyParts = this.expandArr(creepTypes[type], [rank, rank, rank]);
            if (spawn.canCreateCreep(bodyParts) == 0) {
                var newName = spawn.createCreep(bodyParts, undefined, {role: startingRole});
                Game.creeps[newName].memory.sourceIndex = Math.floor(Math.random() + 0.5);
                //this.assignEnergySource(Game.creeps[newName]);
                console.log('Spawning new ' + type + ': ' + newName + " (" + startingRole + ")");
            }
        }
    },

    assignEnergySource: function(creep) {
        var sources = creep.room.find(FIND_SOURCES);
        for (var source in sources) {
            if (source.memory.maxMiners == undefined)
                source.memory.maxMiners = 3;

            if (source.memory.miners == undefined) {
                source.memory.miners = [];
            }
            if (source.memory.miners.length < source.memory.maxMiners) {
                source.memory.miners.push(creep.name);
                console.log("Assigning " + creep.name + " to " + source);
                return source;
            }
        }
    },

    getAssignedEnergySource: function(creep) {
        var sources = creep.room.find(FIND_SOURCES);
        for (var source in sources) {
            if (source.memory.miners == undefined)
                source.memory.miners = [];

            if (source.memory.miners.indexOf(creep.name) != -1) {
                return source;
            }
        }
    },

    testHere: function() {
        console.log(Game.spawns["Hive_A"]);
    }
}

module.exports = miscUtils;