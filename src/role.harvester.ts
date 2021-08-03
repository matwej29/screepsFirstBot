export function harvestEnergy(creep: Creep, structure: Structure) {
  const sources = creep.room.find(FIND_SOURCES);
  if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
    creep.harvest(sources[0]) == ERR_NOT_IN_RANGE
      ? creep.moveTo(sources[0])
      : 0;
  } else {
    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(structure);
    }
  }
}
