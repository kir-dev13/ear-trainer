import { useContext } from "react";
import { dataContext } from "../../contexts/context";
import { checkInputFiles } from "../../logic/sideFunctions";

import "./inputAudioFile.sass";

const InputAudioFile = ({ loadAudioFiles }) => {
    const [state, dispatch] = useContext(dataContext);

    const s = state?.track ? { height: "56px" } : { height: "128px" };

    return (
        <form action="">
            <input
                id="input"
                type="file"
                // multiple
                onChange={(e) => {
                    loadAudioFiles(
                        checkInputFiles(
                            e.target.files,
                            /audio\/mpeg|audio\/flac|audio\/mp3|audio\/mp4|audio\/ogg|audio\/x+|wav/,
                            e
                        ),
                        e
                    );
                }}
            />

            <label htmlFor="input" style={s}>
                {state?.track ? (
                    <p>загр</p>
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
