export function harvestEnergy(creep: Creep, structure: Structure) {
  const source = creep.pos.findClosestByPath(FIND_SOURCES);
  if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
    creep.harvest(source) == ERR_NOT_IN_RANGE ? creep.moveTo(source) : 0;
  } else {
    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(structure, { reusePath: 10 });
    }
  }
}
