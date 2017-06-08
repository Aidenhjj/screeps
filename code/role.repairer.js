var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('harvesting');
        }
        if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
            creep.say('repairing');
        }

        if(creep.memory.repairing) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ([STRUCTURE_WALL, STRUCTURE_RAMPART].indexOf(structure.structureType) != -1) && structure.hits < 1000;
                    }
            });
            targets = targets.concat(_.filter(creep.room.find(FIND_STRUCTURES), (structure) => structure.structureType == STRUCTURE_CONTAINER));
            
            // if (targets.length == 0) {
            //     targets = _.filter(creep.room.find(FIND_STRUCTURES), (structure) => structure.structureType == STRUCTURE_ROAD);
            // }
            
            // console.log(targets);
            // console.log(_.filter(creep.room.find(FIND_STRUCTURES), (structure) => structure.structureType == STRUCTURE_CONTAINER));

            if(targets.length > 0) {
                var target = creep.pos.findClosestByPath(targets);
                if (target.structureType != STRUCTURE_CONTAINER) {
                    if (creep.repair(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else {
                    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            }
            else {
                creep.say('!TOWER!');
                var target = creep.pos.findClosestByPath(creep.room.find(FIND_CONSTRUCTION_SITES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER);
                    }
                }));
                if(creep.transfer(target) == ERR_NOT_IN_RANGE) {
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
            //     sources = sourcesCont;
            //     creep.say("E: cont");
            // }
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
    }
};

module.exports = roleRepairer;