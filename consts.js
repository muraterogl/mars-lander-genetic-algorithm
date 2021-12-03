//select levels by adjusting TEST argument, 1 - 2 - 3 - 4 or 5
export const TEST = 1;
export const WIDTH = 7000;
export const HEIGHT = 3000;
export const LANDER_WIDTH = 27;
export const LANDER_HEIGHT = 26;
export const GRAVITY = 3.711;
export const ANGLE_TO_RADIAN = 0.017453292519943295;
export const FPS = 30;
export const PATH_LENGTH = 200;
export const POPULATION_SIZE = 1000;
export const ELITE_PERC = 0.1;
export const MUTATION_PERC = 5;
export const HISTORY_SIZE = 50;
export const gameToCanvasCoordinate = (x, y, canvas) => {
    const widthRatio = WIDTH / canvas.scrollWidth;
    return [x / widthRatio, (HEIGHT - y) / widthRatio];
};
