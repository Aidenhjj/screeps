var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvest');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('upgrade');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            var sourcesCont = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ([STRUCTURE_CONTAINER].indexOf(structure.structureType) != -1) &&
                            structure.store.energy > 0;
                    }
            });
            // if (sourcesCont.length > 0) {
            //     sources = sourcesCont;
            //     creep.say("E: cont");
            // }
            var source = sources[0];
            if (creep.memory.sourceIndex)
                source = sources[creep.memory.sourceIndex];
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
};

module.exports = roleUpgrader;