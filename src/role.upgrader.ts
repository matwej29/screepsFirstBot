// it need to think about using creep to controller assigning
export function upgrade(creep: Creep, controller?: StructureController) {
  if (creep.memory["upgrading"] && creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory["upgrading"] = false;
  }
  if (!creep.memory["upgrading"] && creep.store.getFreeCapacity() == 0) {
    creep.memory["upgrading"] = true;
  }

  if (creep.memory["upgrading"]) {
    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller, { reusePath: 25 });
    }
  } else {
    var source = creep.pos.findClosestByPath(FIND_SOURCES);
    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source, { reusePath: 20 });
    }
  }
}
