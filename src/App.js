import { useState } from "react";
import InputAudioFile from "./components/inputAudioFile/inputAudioFile";
import "./App.css";
import "./App.sass";

function App() {
    const [tracks, setTracks] = useState([]);

    function loadAudioFiles(audioFiles) {
        audioFiles.length > 0
            ? setTracks([...audioFiles])
            : console.log("ни одного аудио файла не было загружено");
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
