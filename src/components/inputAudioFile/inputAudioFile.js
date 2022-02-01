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
            return resultFiles;
        }
    }
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
                            /audio\/mpeg|audio\/flac|audio\/mp3|audio\/mp4|audio\/ogg|audio\/x+|wav/,
                            e
                        ),
                        e
                    );
                }}
            />
            <label htmlFor="input">label</label>
        </form>
    );
};

export default InputAudioFile;
