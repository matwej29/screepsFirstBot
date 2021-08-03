import _ = require("lodash");
global._ = _;

const uniSmall: [any[], string, object] = [
  [WORK, CARRY, MOVE],
  "uniSmall" + Game.time,
  {
    memory: {
      state: "free",
    },
  },
];
import roleHarvester = require("./role.harvester");
import roleUpgrader = require("./role.upgrader");
import Tasks = require("./taskManager");

const tasks = new Tasks();

module.exports.loop = function () {
  // memory clearing
  for (let creepName in Memory.creeps) {
    if (!Game.creeps[creepName]) {
      delete Memory.creeps[creepName];
      console.log("delete memory of", creepName);
    }
  }
  tasks.clearAssignedTask();
  // creating tasks
  for (let roomName in Game.rooms) {
    const room = Game.rooms[roomName];
    const structures: AnyStructure[] = room.find(FIND_MY_STRUCTURES, {
      filter: (structure: AnyStructure) => {
        return (
          (structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_TOWER ||
            structure.structureType == STRUCTURE_FACTORY) &&
          structure.store.getFreeCapacity() > 0
        );
      },
    });
    tasks.createTasks(room.controller, ...structures);
  }

  // spawning creeps section
  if (_.filter(Game.creeps, () => true).length <= 3) {
    Game.spawns["Spawn1"].spawnCreep(...uniSmall);
  }
  // assigning free creeps to tasks
  for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName];
    const taskToDo = tasks.getUnpocessedTask();
    if (taskToDo === undefined) continue;
    tasks.assignCreepToTask(creep, taskToDo);
    makeCreepToWorkOndiffirentTask(creep, taskToDo);
  }
};

function makeCreepToWorkOndiffirentTask(creep: Creep, task) {
  if (task.taskType == "harvest") {
    roleHarvester.harvestEnergy(creep, Game.structures[task.object]);
  }
  if (task.taskType == "upgrade") {
    roleUpgrader.upgrade(creep);
    if (creep.memory["upgrading"] == undefined)
      creep.memory["upgrading"] = true;
  }
}
