import { useState, useEffect, useRef, useCallback } from "react";
import { WaveSurfer, WaveForm } from "wavesurfer-react";

import Player from "./components/Player/Player";

import InputAudioFile from "./components/inputAudioFile/inputAudioFile";
import "./App.css";
import "./App.sass";

function App() {
    const [track, setTracks] = useState(null);
    const [wave, setWave] = useState(null);

    const wavesurferRef = useRef();

    // console.log("tadaa", track);

    // const loadInWaveSurf = (wavesurfer) => {
    //     if (wavesurfer) {
    //         if (track) {
    //             console.log("трэк: ", track);
    //             console.log(wavesurfer);
    //             wavesurfer.loadBlob(track);
    //         }
    //         // else {
    //         // wavesurfer.load("/dance2bass.mp3");
    //         // }
    //         console.log(wavesurfer);

    //         wavesurfer.on("ready", () => {
    //             console.log("WaveSurfer is ready");
    //             // wavesurfer.playPause();
    //         });
    //     }
    // };

    const handleWSMount = (waveSurfer) => {
        console.log("render");

        wavesurferRef.current = waveSurfer;
        setWave(wavesurferRef.current);

        // loadInWaveSurf(wavesurferRef.current);
    };

    function loadAudioFiles(audioFiles, e) {
        if (audioFiles.length > 0) {
            setTracks(audioFiles[0]);
        } else {
            console.log("ни одного аудио файла не было загружено");
        }
        e.target.value = "";
    }
    console.log("мы увидели");

    useEffect(() => {
        if (track) {
            wave.loadBlob(track);
        }
    }, [track]);

    return (
        <div className="App">
            <InputAudioFile
                trackName={track?.name}
                loadAudioFiles={loadAudioFiles}
            />

            {/* <Player selectedTrack={tracks} /> */}
            <WaveSurfer onMount={handleWSMount}>
                <WaveForm id="waveform"></WaveForm>
                <div id="timeline" />
            </WaveSurfer>
        </div>
    );
}

export default App;
