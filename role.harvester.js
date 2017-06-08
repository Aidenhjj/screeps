var roleHarvester = {
    
    run: function(creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            creep.say('harvest');
            var sources = creep.room.find(FIND_SOURCES);
            var source = sources[0];
            if (creep.memory.sourceIndex)
                source = sources[creep.memory.sourceIndex];
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ([STRUCTURE_SPAWN, STRUCTURE_EXTENSION].indexOf(structure.structureType) != -1) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            var containers = _.filter(targets, (target) => target.structureType == STRUCTURE_CONTAINER);
            
            if (containers.length > 0) {
                creep.say('to container');
                var target = creep.pos.findClosestByPath(containers);
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else if (targets.length > 0) {
                creep.say('transfer');
                var target = creep.pos.findClosestByPath(targets);
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
    }
}

module.exports = roleHarvester;