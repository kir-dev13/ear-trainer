// import { useState } from "react";

import "./inputAudioFile.sass";

function checkInputFiles(data, dataType, e = null) {
    const resultFiles = [];
    for (let file of data) {
        if (resultFiles.length < 5) {
            if (dataType.test(file.type)) {
                resultFiles.push(file);
            } else {
                console.log("не аудио!");
            }
        } else {
            console.log("попытались загрузить больше файлов");
            e ? (e.target.value = "") : console.log(" объекта события нет");
            return resultFiles;
        }
    }
    e ? (e.target.value = "") : console.log(" объекта события нет");
    return resultFiles;
}

const InputAudioFile = (props) => {
    return (
        <form action="">
            <input
                id="input"
                type="file"
                multiple
                onChange={(e) => {
                    props.loadAudioFiles(
                        checkInputFiles(
                            e.target.files,
                            /audio\/mpeg|audio\/mp3|audio\/mp4|audio\/ogg|audio\/x+|wav/,
                            e
                        )
                    );
                }}
            />
            <label htmlFor="input">label</label>
        </form>
    );
};

export default InputAudioFile;
