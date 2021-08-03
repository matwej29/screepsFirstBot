import * as _ from "lodash";

interface task {
  object: Structure["id"];
  maxCreeps: number;
  currentCreeps: any[];
  taskType: string;
}

class Tasks {
  tasks: task[] = [];

  createTasks(controller: StructureController, ...structures: AnyStructure[]) {
    for (let structure of structures) {
      this.createTask_harvestToStructure(structure);
    }
    this.createTask_upgradeController(controller);
  }

  createTask_harvestToStructure(structure: AnyStructure) {
    const task_harvestToStructure: task = {
      object: structure.id,
      maxCreeps: 2,
      currentCreeps: [],
      taskType: "harvest",
    };
    if (
      _.find(this.tasks, { object: structure.id, taskType: "harvest" }) ===
      undefined
    ) {
      this.tasks.push(task_harvestToStructure);
    }
  }

  createTask_upgradeController(controller: StructureController) {
    const task_upgradeController: task = {
      object: controller.id,
      maxCreeps: 1,
      currentCreeps: [],
      taskType: "upgrade",
    };
    if (
      _.find(this.tasks, { object: controller.id, taskType: "upgrade" }) ===
      undefined
    ) {
      this.tasks.push(task_upgradeController);
    }
  }

  getUnpocessedTask(): task {
    let min = 10000;
    let id = 0;
    for (let i = 0; i++; i < this.tasks.length) {
      let task = this.tasks[i];
      if (task.currentCreeps.length < min) {
        min = task.currentCreeps.length;
        id = i;
      }
    }
    return this.tasks[id];
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
      const object = Game.getObjectById(task.object);
      if (task.taskType === "harvest" && object.store.getFreeCapacity() == 0) {
        tasksToDelele.push(task);
      }
      while (tasksToDelele.length > 0) {
        this.deleteTask(tasksToDelele[0]);
      }
    });
  }
}

export = Tasks;
