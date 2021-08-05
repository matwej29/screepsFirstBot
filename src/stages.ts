interface simpleCreep {
  body: BodyPartConstant[];
  name: string;
  opts: {};
}

class StageController {
  /**
   * Stage determining, creeps creating, buildings
   */
  run() {
    _.forEach(Game.rooms, (room) => {
      const currentCreepsAmount = [...room.find(FIND_MY_CREEPS)].length;
      let stage: Stage1 | Stage2;
      if (room.controller.level == 1) {
        stage = new Stage1();
      } else if (room.controller.level == 2) {
        stage = new Stage2();
      }
      let settings = stage.spawnSettings();
      stage.createCreepsIfNeeded(room, settings);
      // stage.buildingsCreate(room);
    });
  }
}

interface stage {
  createCreepsIfNeeded(
    room: Room,
    [uni, war, uniAmount, warAmount]: [simpleCreep, simpleCreep, number, number]
  ): void;
  buildingsCreate(room: Room, buidings: building[]): void;

  spawnSettings?(): [
    uni: simpleCreep,
    war: simpleCreep,
    uniAmount: number,
    warAmount: number
  ];
}

interface building {
  x: number;
  y: number;
  type: BuildableStructureConstant;
}

class Stage implements stage {
  createCreepsIfNeeded(
    room: Room,
    [uni, war, uniAmount, warAmount]: [simpleCreep, simpleCreep, number, number]
  ) {
    let currentWarAmount = 0;
    let currentUniAmount = 0;
    _.forEach(room.find(FIND_MY_CREEPS), (creep) => {
      if (creep.name.startsWith("uniSmall")) currentUniAmount++;
      if (creep.name.startsWith("warSmall")) currentWarAmount++;
    });
    if (currentUniAmount < uniAmount) {
      room.find(FIND_MY_SPAWNS)[0].spawnCreep(uni.body, uni.name, uni.opts);
    }

    if (currentWarAmount < warAmount) {
      room.find(FIND_MY_SPAWNS)[0].spawnCreep(war.body, war.name, war.opts);
    }
  }
  buildingsCreate(room: Room, buidings: building[]) {
    if (buidings == []) return;
    for (let b of buidings) {
      room.createConstructionSite(b.x, b.y, b.type);
    }
  }
}

class Stage1 extends Stage {
  // harvest, build, upgrade
  _uniSmall: simpleCreep = {
    body: [WORK, WORK, CARRY, MOVE],
    name: "uniSmall" + Game.time,
    opts: {
      memory: {
        state: "free",
      },
    },
  };

  spawnSettings(): [simpleCreep, simpleCreep, number, number] {
    return [this._uniSmall, this._uniSmall, 3, 0];
  }

  buildingsSetting(room: Room) {
    const spawn = room.find(FIND_MY_SPAWNS)[0];
    const roads = _(spawn.pos.findPathTo(room.find(FIND_SOURCES)[0])).reduce(
      (res, pos) => {
        res.push({ x: pos.x, y: pos.y, type: "test" });
        return res;
      },
      []
    );
    return roads;
  }
}

class Stage2 extends Stage {
  // harvest, build, upgrade
  _uniMedium: simpleCreep = {
    body: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
    name: "uniSmall" + Game.time,
    opts: {
      memory: {
        state: "free",
      },
    },
  };
  _warriorMedium: simpleCreep = {
    body: [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE],
    name: "warSmall" + Game.time,
    opts: {
      memory: {
        state: "free",
      },
    },
  };
  spawnSettings(): [simpleCreep, simpleCreep, number, number] {
    return [this._uniMedium, this._warriorMedium, 6, 4];
  }
  buildingsSetting(room: Room) {
    const spawn = room.find(FIND_MY_SPAWNS)[0];
    const buidings: building[] = [
      { x: spawn.pos.x - 1, y: spawn.pos.y - 1, type: STRUCTURE_EXTENSION },
      { x: spawn.pos.x + 1, y: spawn.pos.y - 1, type: STRUCTURE_EXTENSION },
      { x: spawn.pos.x - 1, y: spawn.pos.y + 1, type: STRUCTURE_EXTENSION },
      { x: spawn.pos.x + 1, y: spawn.pos.y + 1, type: STRUCTURE_EXTENSION },
    ];
    return buidings;
  }
}

export = StageController;
