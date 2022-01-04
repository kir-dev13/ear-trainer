// import { useState } from "react";

import "./inputAudioFile.sass";

const InputAudioFile = (props) => {
    return (
        <form action="">
            <input
                id="input"
                type="file"
                multiple
                onChange={(e) => {
                    props.loadAudioFiles(e);
                }}
            />
            <label htmlFor="input">label</label>
        </form>
    );
};

export default InputAudioFile;
