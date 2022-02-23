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
            const filters = createFilters(wavesurfer);
            wavesurfer.backend.setFilters(filters);
            console.log("filters ready: ", filters);
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
