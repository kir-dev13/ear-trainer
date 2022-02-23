import { useState, useEffect, useRef, useCallback } from "react";
import { WaveSurfer, WaveForm } from "wavesurfer-react";

import Player from "./components/Player/Player";
import Button from "./components/button/button";

import { createFilters } from "./logic/createFilters";

import InputAudioFile from "./components/inputAudioFile/inputAudioFile";
import "./App.css";
import "./App.sass";

function App() {
    const [track, setTracks] = useState(null);
    const [wavesurfer, setWavesurfer] = useState(null);
    const [playing, setPlaying] = useState(false);

    const wavesurferRef = useRef();
    //create wavesurfer instance once, when component Wavesurfer mount
    const handleWSMount = (waveSurfer) => {
        wavesurferRef.current = waveSurfer;
        setWavesurfer(wavesurferRef.current);
    };

    //loading file in wavesurfer
    useEffect(() => {
        if (track) {
            wavesurfer.loadBlob(track);
            setPlaying(false);
            eventsSubscribe();
        }
    }, [track]);

    const eventsSubscribe = () => {
        wavesurfer.on("loading", (progress) => console.log(progress));

        wavesurfer.on("ready", () => {
            const filters = createFilters(wavesurfer); //create
            wavesurfer.backend.setFilters(filters); //connect
            console.log("filters ready: ", filters);

            // Create vertical range sliders and bind filter to them
            function createEQSliders() {
                if (document.querySelector("#equalizer")) {
                    console.log("check");

                    document.querySelector("#equalizer").remove();
                }
                const equalizer = document.createElement("div");
                equalizer.id = "equalizer";
                document.querySelector(".App").append(equalizer);

                filters.forEach(function (filter) {
                    let input = document.createElement("input");

                    input.setAttribute("type", "range");
                    input.setAttribute("min", -12);
                    input.setAttribute("max", 12);
                    input.setAttribute("value", 0);
                    input.setAttribute("title", filter.frequency.value);

                    input.style.display = "inline-block";
                    input.setAttribute("orient", "vertical");

                    wavesurfer.drawer.style(input, {
                        webkitAppearance: "slider-vertical",
                        width: "50px",
                        height: "150px",
                    });

                    equalizer.appendChild(input);

                    let onChange = function (e) {
                        filter.gain.value = ~~e.target.value;
                    };

                    input.addEventListener("input", onChange);
                    input.addEventListener("change", onChange);
                });
                wavesurfer.filters = filters;
            }
            createEQSliders();
        });

        wavesurfer.on("finish", () => {
            wavesurfer.stop();
            setPlaying(false);
        });
    };

    //upload files and save first in state
    function loadAudioFiles(audioFiles, e) {
        if (audioFiles.length > 0) {
            setTracks(audioFiles[0]);
        } else {
            console.log("ни одного аудио файла не было загружено");
        }
        e.target.value = "";
    }

    //play pause button
    const handlePlayPauseTrack = () => {
        if (wavesurfer) {
            wavesurfer.playPause();
            setPlaying(!playing);
        }
    };

    return (
        <div className="App">
            <InputAudioFile
                trackName={track?.name}
                loadAudioFiles={loadAudioFiles}
            />

            {/* <Player selectedTrack={tracks} /> */}
            <WaveSurfer onMount={handleWSMount}>
                <WaveForm
                    hideScrollbar={true}
                    responsive={true}
                    waveColor={"green"}
                    progressColor={"black"}
                    id="waveform"
                ></WaveForm>
            </WaveSurfer>

            <Button undisabled={!!track} handleAction={handlePlayPauseTrack}>
                {playing ? "Pause" : "Play"}
            </Button>
        </div>
    );
}

export default App;
