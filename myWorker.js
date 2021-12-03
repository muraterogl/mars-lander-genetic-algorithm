import { Environment } from "./environment.js";
import { Genetic } from "./genetic.js";
import { TEST, HISTORY_SIZE } from "./consts.js";

onmessage = function (e) {
    const level = e.data;
    const [x, y, xs, ys, a, surface] = new Environment().createEnvironment(
        level
    );
    const genetic = new Genetic(surface, x, y, xs, ys, a);
    genetic.createInitialPopulation();

    let j = 0;
    let k = 0;
    while (j < 50 && k < 1000) {
        //for (let i = 0; i < 300; i++) {
        genetic.reproduction();
        try {
            const data = Array(HISTORY_SIZE);
            for (let i = 0; i < HISTORY_SIZE; i++) {
                data[i] = genetic.population[i].simulationPoints.map((p) => [
                    p.x,
                    p.y,
                ]);
            }
            postMessage({
                messageType: "Points",
                data: [data, genetic.generation, genetic.population[0].fitness],
            });
        } catch (error) {
            console.error(error);
        }
        if (genetic.population[0].fitness > 0) j++;
        k++;
    }

    postMessage({
        messageType: "Final",
        data: genetic.population[0].path,
    });
};
