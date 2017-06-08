var roleBuilder = {
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('building');
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
                filter: (structure) => {
                    if (creep.memory.buildPreference) {
                        return (structure.structureType == creep.memory.buildPreference);
                    }
                    else
                        return true;
                }
            });
            if(targets.length) {
                var target = creep.pos.findClosestByPath(targets);
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
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
            //     creep.say("E: cont");
            //     sources = sourcesCont;
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

module.exports = roleBuilder;