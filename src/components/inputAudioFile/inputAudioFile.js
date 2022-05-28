import { useContext } from "react";
import { dataContext } from "../../contexts/context";
import { checkInputFiles } from "../../logic/sideFunctions";

import "./inputAudioFile.sass";

const InputAudioFile = ({ setTracks, trackName }) => {
    const [state, dispatch] = useContext(dataContext);

    //upload files and save first in state
    function loadAudioFiles(audioFiles, e) {
        if (audioFiles.length > 0) {
            console.log(audioFiles);
            setTracks(audioFiles[0]);
        } else {
            dispatch({
                type: "stateAppChange",
                setStateApp: "файл не загружен",
            });
        }
        e.target.value = "";
    }

    const s = trackName ? { height: "56px" } : { height: "128px" };

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
                {trackName || (
                    <>
                        <p>нажмите, чтобы загрузить аудио файл</p>
                    </>
                )}
            </label>
        </form>
    );
};

export default InputAudioFile;
