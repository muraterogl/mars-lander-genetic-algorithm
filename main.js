import { Lander } from "./lander.js";
import { Painter } from "./painter.js";
import { Environment } from "./environment.js";
import { TEST, HISTORY_SIZE } from "./consts.js";

const [x, y, xs, ys, a, surface] = new Environment().createEnvironment(TEST);

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.font = "15px Arial";

let i = 0;
const draw = () => {
    ctx.clearRect(0, 0, canvas.scrollWidth, canvas.scrollHeight);
    myLander.nextState(true);
    painter.drawLander(myLander);
    painter.drawSurface(surface.points);
    painter.drawLanderPath(myLander.simulationPoints.map((p) => [p.x, p.y]));
    ctx.fillText(`Generation: ${currentGeneration}`, 50, 40);
    ctx.fillText(`Fitness: ${currentFitness.toFixed(2)}`, 50, 60);
    ctx.fillText(`Altitude: ${Math.round(myLander.position.y)} m`, 50, 80);
    ctx.fillText(`Position: ${Math.round(myLander.position.x)} m`, 50, 100);
    ctx.fillText(`H.Velocity: ${Math.round(myLander.velocity.x)} m/s`, 900, 40);
    ctx.fillText(`V.Velocity: ${Math.round(myLander.velocity.y)} m/s`, 900, 60);
    ctx.fillText(`Angle: ${myLander.angle} degree`, 900, 80);
    ctx.fillText(`Power: ${myLander.power} m/s^2`, 900, 100);
    ctx.fillText(`Fuel Used: ${myLander.fuelUsed} lt`, 900, 120);
    if (!myLander.crashed && !myLander.landed)
        window.requestAnimationFrame(draw);
    i++;
};
const drawFirst = (p) => {
    ctx.clearRect(0, 0, canvas.scrollWidth, canvas.scrollHeight);
    painter.drawLander(myLander);
    painter.drawSurface(surface.points);
    for (let i = HISTORY_SIZE - 1; i >= 0; i--) {
        painter.drawLanderPath(p[i], i == 0 ? "#0000FF" : "#00FF00");
    }
    ctx.fillStyle = "white";
    ctx.fillText(`Generation: ${currentGeneration}`, 50, 40);
    ctx.fillText(`Fitness: ${currentFitness.toFixed(2)}`, 50, 60);
};

const painter = new Painter(ctx, canvas);
let myLander = new Lander(surface, x, y, xs, ys, a, null);
let myWorker = new Worker("myWorker.js", { type: "module" });
let currentGeneration = 0;
let currentFitness = -99999999;

myWorker.onmessage = function (e) {
    const { messageType, data } = e.data;
    if (messageType == "Points") {
        currentGeneration = data[1];
        currentFitness = data[2];
        drawFirst(data[0]);
    } else if (messageType == "Final") {
        myLander.path = data;
        myLander.simulate();
        window.requestAnimationFrame(draw);
    }
};

//console.log(genetic.randomInterval(0, 100) / 100);
