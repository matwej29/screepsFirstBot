import _ = require("lodash");
global._ = _;

import roleHarvester = require("./role.harvester");
import roleUpgrader = require("./role.upgrader");
import roleBuilder = require("./role.builder");
import roleWarriorClass = require("./role.warrior");
const roleWarrior = new roleWarriorClass();
import Tasks = require("./taskManager");
import StageController = require("./stages");

const tasks = new Tasks();
const stages = new StageController();

module.exports.loop = function () {
  // memory clearing
  for (let creepName in Memory.creeps) {
    if (!Game.creeps[creepName]) {
      delete Memory.creeps[creepName];
    }
  }
  tasks.clearAssignedTask();

  // creating tasks
  for (let roomName in Game.rooms) {
    const room = Game.rooms[roomName];
    tasks.createTasks(room);
  }

  // stage staff
  stages.run();

  // assigning free creeps to tasks
  for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName];
    let taskToDo;
    if (creepName.startsWith("uni")) taskToDo = tasks.getUnpocessedTask("uni");
    if (creepName.startsWith("war")) taskToDo = tasks.getUnpocessedTask("war");
    if (taskToDo === undefined) continue;
    tasks.assignCreepToTask(creep, taskToDo);
    makeCreepToWorkOndiffirentTask(creep, taskToDo);
  }
};

function makeCreepToWorkOndiffirentTask(creep: Creep, task) {
  if (creep.name.startsWith("uni")) {
    if (task.taskType == "harvest") {
      roleHarvester.harvestEnergy(creep, Game.structures[task.objectId]);
    }
    if (task.taskType == "upgrade") {
      roleUpgrader.upgrade(creep);
      if (creep.memory["work"] == undefined) creep.memory["work"] = false;
    }
    if (task.taskType == "build") {
      roleBuilder.build(creep, Game.constructionSites[task.objectId]);
      if (creep.memory["work"] == undefined) creep.memory["work"] = false;
    }
  }
  if (creep.name.startsWith("war")) {
    if (task.taskType == "defend") roleWarrior.defend(creep);
  }
}
