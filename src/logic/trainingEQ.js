import { timeQuestionDefault } from "./defaultSettings";
import { delay } from "./sideFunctions";

function randomFilter(filters) {
    return Math.floor(Math.random() * filters.length);
}

function randomDirection() {
    let result = Math.floor(Math.random() * 3) - 1;
    return result === 0 ? randomDirection() : result;
}

const changeGain = (
    filters,
    direction = randomDirection(),
    filterNumber = randomFilter(filters),
    gain
) => {
    filters[filterNumber].gain.value += gain * direction;
    delay(timeQuestionDefault).then(() => {
        filters[filterNumber].gain.value -= gain * direction;
        console.log("finish");
    });
    return {
        freq: filters[filterNumber].frequency.value,
        dir: direction,
        num: filterNumber,
    };
};

function getQuestEq(filters, direction, filterNumber, gain) {
    const currentAnswer = changeGain(filters, direction, filterNumber, gain);
    console.log("currentAnswer: ", currentAnswer);
    return currentAnswer;
}

export { getQuestEq, changeGain };
