import { useContext } from "react";
import { dataContext } from "../../contexts/context";
import "./inputAudioFile.sass";

const InputAudioFile = ({ setTracks, trackName }) => {
    const [state, dispatch] = useContext(dataContext);

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

    const s = trackName ? {} : { height: "128px" };

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
                        <p>или перетащите его сюда</p>
                    </>
                )}
            </label>
        </form>
    );
};

export default InputAudioFile;
