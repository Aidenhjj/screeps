var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var miscUtils = require('misc.utils');

module.exports.loop = function () {

    //miscUtils.testHere();
    
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');

    var mainSpawn = Game.spawns["Hive_A"];
    
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var towers = mainSpawn.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER);
            }
        });
    
    for (var tower in towers) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    if (mainSpawn.canCreateCreep([WORK,WORK, CARRY, CARRY, MOVE, MOVE]) == 0) {
        //console.log("can create!", mainSpawn.canCreateCreep([WORK,CARRY,MOVE]));
        console.log('Harvesters: ' + harvesters.length);
        console.log('Upgraders: ' + upgraders.length);
        console.log('Builders: ' + builders.length);
        console.log('Repairers: ' + repairers.length);
        // for(var name in Game.rooms) {
        //     console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
        // }
        
        if (harvesters.length < 6) {
            miscUtils.createCreep(mainSpawn, "worker", 2, "harvester");
        }
        else if (upgraders.length < 4) {
            miscUtils.createCreep(mainSpawn, "worker", 2, "upgrader");
        }
        else if (builders.length < 4) {
            miscUtils.createCreep(mainSpawn, "worker", 2, "builder");
        }
        else if (repairers.length < 2) {
            miscUtils.createCreep(mainSpawn, "worker", 2, "repairer");
        }
        // for(var name in Game.rooms) {
        //     console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
        // }
    }
    
    
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        else if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
    }
};