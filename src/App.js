import { useState, useEffect, useRef } from "react";
import WaveForm from "./components/WaveForm/waveForm";

import InputAudioFile from "./components/inputAudioFile/inputAudioFile";
import "./App.css";
import "./App.sass";

function App() {
    const [tracks, setTracks] = useState([]);

    function loadAudioFiles(audioFiles, e) {
        if (audioFiles.length > 0) {
            setTracks([...audioFiles]);
        } else {
            console.log("ни одного аудио файла не было загружено");
        }
        e.target.value = "";
    }

    return (
        <div className="App">
            <InputAudioFile loadAudioFiles={loadAudioFiles} />
            <button
                onClick={() => {
                    console.log(tracks[0]);
                    console.log(tracks.length);
                }}
            >
                Console
            </button>
            {/* <button
                onClick={() => {
                    // playMusic();
                    wavesurfer.current.play();
                }}
            >
                Play
            </button> */}
            <WaveForm selectedTrack={tracks[0]} />
        </div>
    );
}

export default App;
