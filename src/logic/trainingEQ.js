import EQ from "./EQ";

function randomFilter() {
    return Math.floor(Math.random() * EQ.length);
}

const delay = (ms) => {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
};

function randomDirection() {
    let result = Math.floor(Math.random() * 3) - 1;
    return result === 0 ? randomDirection() : result;
}

const changeGain = (filters) => {
    const filterNumber = 0;
    // const filterNumber = randomFilter();
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

function training(filters) {
    const currentAnswer = changeGain(filters);
    console.log("currentAnswer: ", currentAnswer);
    return currentAnswer;
}

export { training };
