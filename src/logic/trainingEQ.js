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
    gain,
    timeQuestion
) => {
    filters[filterNumber].gain.value += gain * direction;
    delay(timeQuestion).then(() => {
        filters[filterNumber].gain.value -= gain * direction;
        console.log("finish");
    });
    return {
        freq: filters[filterNumber].frequency.value,
        dir: direction,
        num: filterNumber,
    };
};

function getQuestEq(filters, direction, filterNumber, gain, timeQuestion) {
    const currentAnswer = changeGain(
        filters,
        direction,
        filterNumber,
        gain,
        timeQuestion
    );
    console.log("currentAnswer: ", currentAnswer);
    return currentAnswer;
}

export { getQuestEq, changeGain };
