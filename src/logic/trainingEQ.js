import {
    defaultFiltersList,
    defaultGain,
    timeQuestionDefault,
} from "./defaultSettings";
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
    filterNumber = randomFilter(filters)
) => {
    filters[filterNumber].gain.value += defaultGain * direction;
    delay(timeQuestionDefault).then(() => {
        filters[filterNumber].gain.value -= defaultGain * direction;
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
