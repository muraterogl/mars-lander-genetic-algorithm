import { Point } from "./point.js";
import { Vector } from "./vector.js";
import { GRAVITY, ANGLE_TO_RADIAN, FPS, PATH_LENGTH } from "./consts.js";

export class Lander {
    constructor(surface, initX, initY, initVx, initVy, initA, initPath) {
        this.surface = surface;
        this.position = new Vector(initX, initY);
        this.prevPosition = null;
        this.prevAngle = 0;
        this.velocity = new Vector(initVx, initVy);
        this.acceleration = new Vector(0, -GRAVITY / FPS);
        this.angle = initA;
        this.power = 0;
        this.fuelUsed = 0;
        this.tick = 0;
        this.path = initPath ? initPath : [];
        this.crashed = false;
        this.landed = false;
        this.simulationPoints = null;
        this.simulationLastVelocity = null;
        this.simulationLastAngle = null;
        this.simulationTicks = null;
        this.simulationCrashed = null;
        this.simulationLanded = null;
        this.simulationFuelUsed = 0;
    }

    nextState = (debug) => {
        if (!this.crashed && !this.landed) {
            if (this.tick % FPS == 0) {
                this.applyPath();
                this.fuelUsed += this.power;
            }
            this.surface.isLanded(this, debug);
            this.prevPosition = this.position;
            this.prevAngle = this.angle;
            this.acceleration = this.powerToForce().add(
                new Vector(0, -GRAVITY)
            );
            this.velocity = this.velocity.add(this.acceleration.scale(1 / FPS));
            this.position = this.position.add(this.velocity.scale(1 / FPS));
        }
        this.tick++;
    };

    nextSecondState = () => {
        if (!this.crashed && !this.landed) {
            this.applyPath();
            this.surface.isLanded(this);
            this.prevPosition = this.position;
            this.prevAngle = this.angle;
            this.fuelUsed += this.power;
            this.acceleration = this.powerToForce().add(
                new Vector(0, -GRAVITY)
            );
            this.velocity = this.velocity.add(this.acceleration);
            this.position = this.position.add(this.velocity);
        }
        this.tick += FPS;
    };

    powerToForce = () => {
        const x = -this.power * Math.sin(this.angle * ANGLE_TO_RADIAN);
        const y = this.power * Math.cos(this.angle * ANGLE_TO_RADIAN);
        return new Vector(x, y);
    };

    applyPath = () => {
        const pathIndex = Math.floor(this.tick / FPS);
        this.pathIndex = pathIndex;
        if (pathIndex < PATH_LENGTH && this.path.length > 0) {
            this.angle += this.path[pathIndex][0];
            this.power += this.path[pathIndex][1];
            this.angle = Math.max(-90, Math.min(90, this.angle));
            this.power = Math.max(0, Math.min(4, this.power));
        }
    };

    stopLander = () => {
        this.simulationLastVelocity = new Vector(
            this.velocity.x,
            this.velocity.y
        );
        this.acceleration = new Vector(0, 0);
        this.velocity = new Vector(0, 0);
        this.power = 0;
    };

    copyLander = () => {
        const cLander = new Lander();
        cLander.surface = this.surface;
        cLander.position = this.position;
        cLander.velocity = this.velocity;
        cLander.acceleration = this.acceleration;
        cLander.angle = this.angle;
        cLander.power = this.power;
        cLander.tick = this.tick;
        cLander.path = this.path;
        cLander.crashed = this.crashed;
        cLander.landed = this.landed;
        return cLander;
    };

    simulate = () => {
        const vLander = this.copyLander();
        const positions = [new Point(vLander.position.x, vLander.position.y)];
        let pathIndex = Math.floor(vLander.tick / FPS);
        while (!vLander.crashed && !vLander.landed && pathIndex < PATH_LENGTH) {
            vLander.nextSecondState();
            //vLander.nextState();
            positions.push(new Point(vLander.position.x, vLander.position.y));
            pathIndex = Math.floor(vLander.tick / FPS);
        }
        this.simulationPoints = positions;
        this.simulationLastVelocity = vLander.simulationLastVelocity;
        this.simulationTicks = vLander.tick;
        this.simulationCrashed = vLander.crashed;
        this.simulationLanded = vLander.landed;
        this.simulationLastAngle = vLander.angle;
        this.simulationFuelUsed = vLander.fuelUsed;
    };
}
