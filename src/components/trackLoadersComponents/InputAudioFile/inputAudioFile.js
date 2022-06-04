import { useContext } from "react";
import { dataContext } from "../../../contexts/context";

import "./inputAudioFile.sass";

const InputAudioFile = ({ loadAudioFiles }) => {
    const [state, dispatch] = useContext(dataContext);

    // const s = state?.track ? { height: "56px" } : {};

    return (
        <form action="">
            <input
                id="input"
                type="file"
                // multiple
                onChange={(e) => {
                    loadAudioFiles(e.target.files, e);
                }}
            />

            <label htmlFor="input">
                {state?.track ? (
                    <p>загрузить другой</p>
                ) : (
                    <p>
                        нажмите, чтобы загрузить аудио файл с вашего устройства
                    </p>
                )}
            </label>
        </form>
    );
};

export default InputAudioFile;
