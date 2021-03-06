import { Lander } from "./lander.js";
import {
    PATH_LENGTH,
    POPULATION_SIZE,
    ELITE_PERC,
    MUTATION_PERC,
} from "./consts.js";

export class Genetic {
    constructor(surface, initX, initY, initVx, initVy, initA) {
        this.population = [];
        this.surface = surface;
        this.initX = initX;
        this.initY = initY;
        this.initVx = initVx;
        this.initVy = initVy;
        this.initA = initA;
        this.generation = 0;
    }
    createRandomPath = () => {
        const path = Array(PATH_LENGTH);
        for (let i = 0; i < PATH_LENGTH; i++) {
            let angle = this.randomInterval(-15, 15);
            let power = this.randomInterval(-1, 1);

            path[i] = [angle, power];
        }
        return path;
    };
    randomInterval = (min, max) => {
        // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    createInitialPopulation = () => {
        // this.population = Array(POPULATION_SIZE).map(
        //     (_) =>
        //         new Lander(
        //             this.surface,
        //             this.initX,
        //             this.initY,
        //             this.initVx,
        //             this.initVy,
        //             this.initA,
        //             this.createRandomPath(this.initA)
        //         )
        // );
        // this.population.forEach((individual) => individual.simulate());
        this.population = Array(POPULATION_SIZE);
        for (let i = 0; i < POPULATION_SIZE; i++) {
            this.population[i] = new Lander(
                this.surface,
                this.initX,
                this.initY,
                this.initVx,
                this.initVy,
                this.initA,
                this.createRandomPath(this.initA)
            );
            this.population[i].simulate();
            this.population[i].fitness = this.fitness(this.population[i]);
        }
    };

    fitness = (individual) => {
        const lastPosition =
            individual.simulationPoints[individual.simulationPoints.length - 1];
        const [flatx, flatX] = individual.surface.landingSurface;
        let score = 0;
        if (!individual.simulationCrashed && !individual.simulationLanded) {
            return -1e9;
        } else if (individual.simulationCrashed) {
            if (lastPosition.x < flatx) {
                score -= 1000 * (flatx - lastPosition.x);
            } else if (lastPosition.x > flatX) {
                score -= 1000 * (lastPosition.x - flatX);
            }
            score -= 100 * Math.abs(individual.simulationLastAngle);
            score -= 5 * Math.abs(individual.simulationLastVelocity.x);
            score -= 5 * Math.abs(individual.simulationLastVelocity.y);
        } else {
            score += 300000 / individual.simulationFuelUsed;
        }

        return score;
    };

    crossover = (parent1, parent2) => {
        let rand = 0;
        const childPath = Array(PATH_LENGTH);
        const child2Path = Array(PATH_LENGTH);
        for (let i = 0; i < PATH_LENGTH; i++) {
            rand = this.randomInterval(0, 100) / 100;
            let angle = Math.round(
                rand * parent1.path[i][0] + (1 - rand) * parent2.path[i][0]
            );
            let power = Math.round(
                rand * parent1.path[i][1] + (1 - rand) * parent2.path[i][1]
            );
            if (this.randomInterval(0, 100) <= MUTATION_PERC) {
                angle = this.randomInterval(-15, 15);
                power = this.randomInterval(-1, 1);
            }
            let angle2 = Math.round(
                (1 - rand) * parent1.path[i][0] + rand * parent2.path[i][0]
            );
            let power2 = Math.round(
                (1 - rand) * parent1.path[i][1] + rand * parent2.path[i][1]
            );
            if (this.randomInterval(0, 100) <= MUTATION_PERC) {
                angle2 = this.randomInterval(-15, 15);
                power2 = this.randomInterval(-1, 1);
            }
            childPath[i] = [angle, power];
            child2Path[i] = [angle2, power2];
        }
        return [childPath, child2Path];
    };

    reproduction = () => {
        this.population = this.population.sort(
            (ind1, ind2) => ind2.fitness - ind1.fitness
        );
        let newPopulation = Array(POPULATION_SIZE);
        for (let i = 0; i < POPULATION_SIZE; i += 2) {
            if (i < ELITE_PERC * POPULATION_SIZE) {
                newPopulation[i] = this.population[i];
                newPopulation[i + 1] = this.population[i + 1];
            } else {
                const rand = this.randomInterval(
                    0,
                    ELITE_PERC * POPULATION_SIZE - 1
                );
                const rand2 = this.randomInterval(
                    0,
                    ELITE_PERC * POPULATION_SIZE - 1
                );
                const [path1, path2] = this.crossover(
                    this.population[rand],
                    this.population[rand2]
                );
                newPopulation[i] = new Lander(
                    this.surface,
                    this.initX,
                    this.initY,
                    this.initVx,
                    this.initVy,
                    this.initA,
                    path1
                );
                newPopulation[i + 1] = new Lander(
                    this.surface,
                    this.initX,
                    this.initY,
                    this.initVx,
                    this.initVy,
                    this.initA,
                    path2
                );
                newPopulation[i].simulate();
                newPopulation[i].fitness = this.fitness(newPopulation[i]);
                newPopulation[i + 1].simulate();
                newPopulation[i + 1].fitness = this.fitness(
                    newPopulation[i + 1]
                );
            }
        }
        this.population = newPopulation;
        newPopulation = null;
        this.generation++;
    };
}
