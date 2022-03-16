import { EQ, gain, time } from "./EQ";
import { delay } from "./sideFunctions";

function randomFilter() {
    return Math.floor(Math.random() * EQ.length);
}

function randomDirection() {
    let result = Math.floor(Math.random() * 3) - 1;
    return result === 0 ? randomDirection() : result;
}

const changeGain = (
    filters,
    direction = randomDirection(),
    filterNumber = randomFilter()
) => {
    filters[filterNumber].gain.value += gain * direction;
    console.log("start");
    delay(time).then(() => {
        filters[filterNumber].gain.value -= gain * direction;
        console.log("finish");
    });
    return {
        freq: filters[filterNumber].frequency.value,
        dir: direction,
        num: filterNumber,
    };
};

function getQuestEq(filters, direction, filterNumber) {
    const currentAnswer = changeGain(filters, direction, filterNumber);
    console.log("currentAnswer: ", currentAnswer);
    return currentAnswer;
}

export { getQuestEq, changeGain };
