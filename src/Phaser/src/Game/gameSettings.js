export const GAMEMODES = {
  SOLO: {
    id: 0,
    scene: 'GamemodeSolo',
    text: 'Solo',
  },
  TWO_PLAYER: {
    id: 1,
    scene: 'GamemodeTwoPlayer',
    text: 'Two Player',
  },
  // RACE: {
  //   id: 2,
  //   scene: 'GamemodeRace',
  //   text: 'Race',
  // },
  // CHASE: {
  //   id: 3,
  //   scene: 'GamemodeChase',
  //   text: 'Chase',
  // },
  // ESCAPE: {
  //   id: 4,
  //   scene: 'GamemodeEscape',
  //   text: 'Escape',
  // },
};

export function getGamemodeInfo(id) {
  return (
    GAMEMODES[Object.keys(GAMEMODES).find(key => GAMEMODES[key].id === id)] ||
    {}
  );
}

export function getDimensions(game) {
  const screenLength = game.config.width;
  return {
    screenLength,
    screenSpaceUnit: screenLength / 20,
    screenCenter: screenLength / 2,
    textSize1: screenLength / 10,
    textSize2: screenLength / 15,
    textSize3: screenLength / 18,
    textSize4: screenLength / 22,
  };
}

export function initSettings() {
  return {
    maxGridSize: 40,
    minGridSize: 10,
    gridSize: 10,
    maxSideLength: 15,
    minSideLength: 10,
    sideLength: 10,
    gameMode: GAMEMODES.SOLO.id,
    level: 1,
    totalLevels: 5,
  };
}
