import { useState } from "react";
import InputAudioFile from "./components/inputAudioFile/inputAudioFile";
import "./App.css";
import "./App.sass";

function App() {
    const [tracks, setTracks] = useState([]);

    function checkInputFiles(data, dataType) {
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

    function loadAudioFiles(e) {
        const audioFiles = checkInputFiles(
            e.target.files,
            /audio\/mpeg|audio\/mp3|audio\/mp4|audio\/ogg|audio\/x+|wav/
        );

        audioFiles.length > 0
            ? setTracks([...audioFiles])
            : console.log("ни одного аудио файла не было загружено");

        e.target.value = "";
    }

    return (
        <>
            <InputAudioFile loadAudioFiles={loadAudioFiles} />
            <button
                onClick={() => {
                    console.log(tracks);
                    console.log(tracks.length);
                }}
            >
                Console
            </button>
            <button
                onClick={() => {
                    // playMusic();
                }}
            >
                Play
            </button>
        </>
    );
}

export default App;
