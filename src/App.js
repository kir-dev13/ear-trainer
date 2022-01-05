import { useState, useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

import InputAudioFile from "./components/inputAudioFile/inputAudioFile";
import "./App.css";
import "./App.sass";

function App() {
    const [tracks, setTracks] = useState([]);

    const waveformRef = useRef(null);

    useEffect(() => {
        // let player = document.querySelector(".player");
        WaveSurfer.create({ container: waveformRef.current });
    }, []);

    const wavesurfer = useRef(null);

    useEffect(() => {
        wavesurfer.current = WaveSurfer.create({
            container: waveformRef.current,
            splitChannels: false,
        });

        // Removes events, elements and disconnects Web Audio nodes.
        // when component unmount
        return () => wavesurfer.current.destroy();
    }, [tracks]);

    useEffect(() => {
        loadInWaveSurf();
    });

    const loadInWaveSurf = () => {
        if (tracks[0]) {
            wavesurfer.current.loadBlob(tracks[0]);

            wavesurfer.current.on("ready", function () {
                // https://wavesurfer-js.org/docs/methods.html
                wavesurfer.current.setVolume(0.5);
                // wavesurfer.current.play();
            });
        }
    };

    function loadAudioFiles(audioFiles) {
        if (audioFiles.length > 0) {
            setTracks([...audioFiles]);
        } else {
            console.log("ни одного аудио файла не было загружено");
        }
    }

    return (
        <>
            <InputAudioFile loadAudioFiles={loadAudioFiles} />
            <button
                onClick={() => {
                    console.log(tracks[0]);
                    console.log(tracks.length);
                }}
            >
                Console
            </button>
            <button
                onClick={() => {
                    // playMusic();
                    wavesurfer.current.play();
                }}
            >
                Play
            </button>
            <div className="player"></div>
            <div ref={waveformRef} />
        </>
    );
}

export default App;
