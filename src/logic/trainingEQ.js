import EQ from "./EQ";
import { delay } from "./sideFunctions";

function randomFilter() {
    return Math.floor(Math.random() * EQ.length);
}

function randomDirection() {
    let result = Math.floor(Math.random() * 3) - 1;
    return result === 0 ? randomDirection() : result;
}

const changeGain = (filters) => {
    const filterNumber = randomFilter();
    const direction = randomDirection();
    delay(2000)
        .then(() => {
            filters[filterNumber].gain.value += 12 * direction;
            console.log("start");
        })
        .then(() =>
            delay(3000).then(() => {
                filters[filterNumber].gain.value -= 12 * direction;
                console.log("finish");
            })
        );
    return {
        freq: filters[filterNumber].frequency.value,
        dir: direction,
    };
};

function getQuest(filters) {
    const currentAnswer = changeGain(filters);
    console.log("currentAnswer: ", currentAnswer);
    return currentAnswer;
}

export { getQuest };
