class Warrior {
  defend(creep: Creep) {
    const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
    console.log("attacking");
    if (creep.attack(hostiles[0]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(hostiles[0]);
    }
    if (hostiles == []) {
      creep.moveTo(creep.room.controller, { reusePath: 20 });
    }
  }
}

export = Warrior;
