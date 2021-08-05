export function build(creep: Creep, constructionSite: ConstructionSite) {
  if (creep.memory["work"] && creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory["work"] = false;
  }
  if (!creep.memory["work"] && creep.store.getFreeCapacity() == 0) {
    creep.memory["work"] = true;
  }

  if (creep.memory["work"]) {
    if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
      creep.moveTo(constructionSite, { reusePath: 10 });
    }
  } else {
    var source = creep.pos.findClosestByPath(FIND_SOURCES);
    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source, { reusePath: 20 });
    }
  }
}
