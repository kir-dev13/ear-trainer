import EQ from "./EQ";

function randomFilter() {
    return Math.floor(Math.random() * EQ.length);
}

const delay = (ms) => {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
};

// const timer = (arrayCount) {

// }

const changeGain = (filters) => {
    const filterNumber = randomFilter();
    delay(2000)
        .then(() => {
            filters[filterNumber].gain.value += 12;
            console.log("start: ", filters[filterNumber].frequency.value);
        })
        .then(() =>
            delay(3000).then(() => {
                filters[filterNumber].gain.value -= 12;
                console.log("finish");
            })
        );
    return filters[filterNumber].frequency.value;
};

function training(filters) {
    const currentFrequency = changeGain(filters);
    console.log("currentFrequency: ", currentFrequency);
    return currentFrequency;
}

export { training };
