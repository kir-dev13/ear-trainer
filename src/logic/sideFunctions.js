function returnState(trueState, falseState, parameter) {
    return parameter ? trueState : falseState;
}

const delay = (ms) => {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
};

const delayWithInterval = (ms, func) => {
    return new Promise((resolve) => {
        let timerId = setInterval(() => {
            func(ms);
            ms = ms - 1000;
        }, 1000);
        delay(ms)
            .then(() => clearInterval(timerId))
            .then(() => delay(1000).then(() => resolve()));
    });
};

export { delay, returnState };
// const delayWithInterval = (ms, func) => {//     let timerId = setInterval(() => {//         func(ms);//         ms = ms - 1000;//     }, 1000);//     delay(ms).then(() => clearInterval(timerId));// };\r
