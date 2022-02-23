import { useState, useEffect, useRef, useCallback } from "react";
import { WaveSurfer, WaveForm } from "wavesurfer-react";

import Player from "./components/Player/Player";

import InputAudioFile from "./components/inputAudioFile/inputAudioFile";
import "./App.css";
import "./App.sass";

function App() {
    const [tracks, setTracks] = useState([]);

    const wavesurferRef = useRef();

    const loadInWaveSurf = (wavesurfer) => {
        if (wavesurfer) {
            console.log(wavesurfer);
            if (tracks[0]) {
                console.log(tracks[0]);
                wavesurfer.loadBlob(tracks[0]);
            }
            // else {
            //     wavesurfer.load("/dance2bass.mp3");
            // }

            wavesurfer.on("ready", () => {
                console.log("WaveSurfer is ready");
                wavesurfer.playPause();
            });
        }
    };

    const handleWSMount = (waveSurfer) => {
        console.log("rerender");

        wavesurferRef.current = waveSurfer;

        loadInWaveSurf(wavesurferRef.current);
    };

    function loadAudioFiles(audioFiles, e) {
        if (audioFiles.length > 0) {
            console.log(audioFiles);
            setTracks([...audioFiles]);
        } else {
            console.log("ни одного аудио файла не было загружено");
        }
        e.target.value = "";
    }

    return (
        <div className="App">
            <InputAudioFile
                trackName={tracks[0]?.name}
                loadAudioFiles={loadAudioFiles}
            />

            {/* <Player selectedTrack={tracks[0]} /> */}
            <WaveSurfer onMount={handleWSMount}>
                <WaveForm id="waveform"></WaveForm>
                <div id="timeline" />
            </WaveSurfer>
        </div>
    );
}

export default App;
