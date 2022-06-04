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

function checkInputFiles(
    files,
    dataType = /audio\/mpeg|audio\/flac|audio\/mp3|audio\/mp4|audio\/ogg|audio\/x+|wav/,
    e = null
) {
    const resultFiles = [];

    for (let file of files) {
        if (resultFiles.length < 5) {
            if (dataType.test(file.type)) {
                resultFiles.push(file);
            } else {
                console.log("не аудио!");
            }
        } else {
            console.log("попытались загрузить больше файлов");
            return resultFiles;
        }
    }

    return resultFiles;
}

export { delay, returnState, checkInputFiles };
