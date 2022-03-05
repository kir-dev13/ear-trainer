import { useState, useEffect, useRef } from "react";
import { WaveSurfer, WaveForm } from "wavesurfer-react";

import { createFilters } from "./logic/createFilters";
import { getQuestEq } from "./logic/trainingEQ";
import { delay } from "./logic/sideFunctions";

import Button from "./components/button/button";
import Spinner from "./components/spinner/spinner";
import AnswerArea from "./components/AnswerArea/AnswerArea";

import InputAudioFile from "./components/inputAudioFile/inputAudioFile";
import "./App.sass";

function App() {
    const [wavesurfer, setWavesurfer] = useState(null);
    const [track, setTracks] = useState(null);
    const [loading, setLoading] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [playing, setPlaying] = useState(false);
    const [training, setTraining] = useState(false);
    const [answer, setAnswer] = useState({});
    const [answersArray, setAnswersArray] = useState([]);

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
            setLoading(true);
            setPlaying(false);
            setTraining(false);
            eventsSubscribe();
        }
    }, [track]);

    useEffect(() => {
        if (training) {
            delay(2000).then(() => setAnswer(getQuestEq(wavesurfer.filters)));
        }
    }, [training, answersArray]);

    const checkAnswer = (selectedFreq, selectedDir) => {
        if (
            selectedFreq.value === answer.freq &&
            selectedDir.value === answer.dir
        ) {
            setAnswersArray([...answersArray, true]);
        } else {
            setAnswersArray([...answersArray, false]);
        }
    };

    // Create vertical range sliders and bind filter to them
    function createEQSliders(filters) {
        if (document.querySelector("#equalizer")) {
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

    const eventsSubscribe = () => {
        // wavesurfer.on("loading", (progress) => console.log(progress));

        wavesurfer.on("ready", () => {
            setLoading(false);
            wavesurfer.setVolume(volume);
            const filters = createFilters(wavesurfer); //create filters
            wavesurfer.backend.setFilters(filters); //connect
            wavesurfer.filters = filters;
            // createEQSliders(filters);
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

    const handleChangeVolume = (e) => {
        wavesurfer.setVolume(+(e.target.value / 100).toFixed(2));
        setVolume(+(e.target.value / 100).toFixed(2));
    };

    //training start
    const handleTrainingStart = () => {
        setTraining(!training);
    };

    const handleTrainingRepeat = () => {
        console.log("repeat");
        setAnswer(getQuestEq(wavesurfer.filters, answer.dir, answer.num));
    };

    return (
        <main className="App">
            <InputAudioFile
                trackName={track?.name}
                loadAudioFiles={loadAudioFiles}
            />

            {/* <Player selectedTrack={tracks} /> */}
            <WaveSurfer onMount={handleWSMount}>
                <WaveForm
                    hideScrollbar={true}
                    responsive={true}
                    waveColor={"rgb(116, 60, 121)"}
                    progressColor={"#ffa70467"}
                    id="waveform"
                    style={{ position: "relative" }}
                >
                    {loading ? <Spinner /> : null}
                    {/* !! стили спинера.... !! */}
                </WaveForm>
            </WaveSurfer>

            {track ? (
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume * 100}
                    onChange={(e) => handleChangeVolume(e)}
                />
            ) : null}

            <Button
                undisabled={!!track && !loading}
                handleAction={handlePlayPauseTrack}
            >
                {playing ? "Pause" : "Play"}
            </Button>

            <Button
                handleAction={
                    training ? handleTrainingRepeat : handleTrainingStart
                }
                undisabled={playing}
            >
                {training ? "Repeat question" : "Start"} training
            </Button>

            <AnswerArea
                playing={playing}
                training={training}
                answer={answer}
                checkAnswer={checkAnswer}
            />
        </main>
    );
}

export default App;
