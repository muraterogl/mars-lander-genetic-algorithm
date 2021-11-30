import { Lander } from "./lander.js";
import { Painter } from "./painter.js";
import { Environment } from "./environment.js";
import { TEST, HISTORY_SIZE } from "./consts.js";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.font = "15px Arial";
let level = 1;
let [x, y, xs, ys, a, surface] = new Environment().createEnvironment(level);
let myWorker = new Worker("myWorker.js", { type: "module" });
const painter = new Painter(ctx, canvas);
let myLander = new Lander(surface, x, y, xs, ys, a, null);
let currentGeneration = 0;
let currentFitness = -99999999;
document.getElementById("lvlbtn1").onclick = () => handleLevelChange(1);
document.getElementById("lvlbtn2").onclick = () => handleLevelChange(2);
document.getElementById("lvlbtn3").onclick = () => handleLevelChange(3);
document.getElementById("lvlbtn4").onclick = () => handleLevelChange(4);
document.getElementById("lvlbtn5").onclick = () => handleLevelChange(5);

const handleLevelChange = (l) => {
    myWorker.terminate();
    [x, y, xs, ys, a, surface] = new Environment().createEnvironment(l);
    myWorker = new Worker("myWorker.js", { type: "module" });
    myLander = new Lander(surface, x, y, xs, ys, a, null);
    myWorker.postMessage(l);
    myWorker.onmessage = function (e) {
        const { messageType, data } = e.data;
        if (messageType == "Points") {
            currentGeneration = data[1];
            currentFitness = data[2];
            drawFinding(data[0]);
        } else if (messageType == "Final") {
            myLander.path = data;
            myLander.simulate();
            window.requestAnimationFrame(drawLanding);
        }
    };
};

let i = 0;
const drawLanding = () => {
    ctx.clearRect(0, 0, canvas.scrollWidth, canvas.scrollHeight);
    myLander.nextState(true);
    painter.drawLander(myLander);
    painter.drawSurface(surface.points);
    painter.drawLanderPath(myLander.simulationPoints.map((p) => [p.x, p.y]));
    painter.drawInfo(currentGeneration, currentFitness, myLander);
    if (!myLander.crashed && !myLander.landed)
        window.requestAnimationFrame(drawLanding);
    i++;
};
const drawFinding = (p) => {
    ctx.clearRect(0, 0, canvas.scrollWidth, canvas.scrollHeight);
    painter.drawLander(myLander);
    painter.drawSurface(surface.points);
    for (let i = HISTORY_SIZE - 1; i >= 0; i--) {
        painter.drawLanderPath(p[i], i == 0 ? "#0000FF" : "#00FF00");
    }
    painter.drawInfo(currentGeneration, currentFitness);
};

handleLevelChange(level);
