import * as _ from "lodash";

interface task {
  objectId: Structure["id"] | Creep["id"] | string;
  creepClass: string;
  currentCreeps: any[];
  taskType: string;
}

interface uniTask extends task {
  objectId: Structure["id"] | Creep["id"] | string;
  creepClass: "uni";
  currentCreeps: any[];
  taskType: "harvest" | "build" | "repair" | "upgrade";
}

interface warTask extends task {
  objectId: Structure["id"] | Creep["id"] | string;
  creepClass: "war";
  currentCreeps: any[];
  taskType: "defend" | "attackRoom";
}

class Tasks {
  tasks: task[] = [];

  createTasks(room: Room) {
    this.createTask_upgradeController(room?.controller.id);
    let structures: AnyStructure[] = room.find(FIND_MY_STRUCTURES, {
      filter: (structure: AnyStructure) => {
        return (
          (structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_TOWER ||
            structure.structureType == STRUCTURE_FACTORY) &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        );
      },
    });
    for (let structure of structures) {
      this.createTask_harvestToStructure(structure);
    }
    structures = room.find(FIND_MY_STRUCTURES);
    for (let site of room.find(FIND_CONSTRUCTION_SITES)) {
      this.createTask_buildOnConstructionSite(site.id);
    }

    // const hostiles = room.find(FIND_HOSTILE_CREEPS);
    // if (hostiles != []) {
    //   _.forEach(hostiles, (hostile) => {
    //     this.createTask_defendRoom(hostile.id);
    //   });
    // }
  }

  pushTask(tasks: task[], task: task) {
    if (
      _.find(tasks, {
        objectId: task.objectId,
        taskType: task.taskType,
      }) === undefined
    ) {
      tasks.push(task);
    }
  }

  createTask_harvestToStructure(structure: AnyStructure) {
    const task_harvestToStructure: uniTask = {
      objectId: structure.id,
      creepClass: "uni",
      currentCreeps: [],
      taskType: "harvest",
    };
    this.pushTask(this.tasks, task_harvestToStructure);
  }

  createTask_upgradeController(controller: StructureController["id"]) {
    const task_upgradeController: uniTask = {
      objectId: controller,
      creepClass: "uni",
      currentCreeps: [],
      taskType: "upgrade",
    };
    this.pushTask(this.tasks, task_upgradeController);
  }

  // createTask_defendRoom(hostile: Creep["id"]) {
  //   const task_attackCreep: task = {
  //     objectId: hostile,
  //     maxCreeps: 1,
  //     currentCreeps: [],
  //     taskType: "defend",
  //   };
  //   this.pushTask(task_attackCreep);
  // }

  createTask_buildOnConstructionSite(site: ConstructionSite["id"]) {
    const task_buildStructure: uniTask = {
      objectId: site,
      creepClass: "uni",
      currentCreeps: [],
      taskType: "build",
    };
    this.pushTask(this.tasks, task_buildStructure);
  }

  getUnpocessedTask(creepClass: task["creepClass"]): task {
    const task = _(this.tasks)
      .filter((task) => task.creepClass == creepClass)
      .min((task) => task.currentCreeps.length);
    return task;
  }

  assignCreepToTask(creep: Creep, task: task) {
    const id = _.findIndex(this.tasks, task);
    this.tasks[id].currentCreeps.push(creep);
  }

  deleteTask(task: task) {
    this.tasks.splice(_.findIndex(this.tasks, task));
  }

  clearAssignedTask() {
    const tasksToDelele: task[] = [];
    _.forEach(this.tasks, (task, id) => {
      task.currentCreeps = [];
      if (
        task.taskType === "harvest" &&
        Game.structures[task.objectId].store.getFreeCapacity() == 0
      ) {
        tasksToDelele.push(task);
      }
      if (task.taskType === "build" && Game.structures[task.objectId])
        while (tasksToDelele.length > 0) {
          this.deleteTask(tasksToDelele[0]);
        }
    });
  }
}

export = Tasks;
