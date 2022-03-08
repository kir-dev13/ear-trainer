import { useState, useEffect } from "react";

import { getQuestEq } from "./logic/trainingEQ";
import { delay } from "./logic/sideFunctions";

import InputAudioFile from "./components/inputAudioFile/inputAudioFile";
import Player from "./components/Player/Player";
import Button from "./components/button/button";
import AnswerArea from "./components/AnswerArea/AnswerArea";
import AppState from "./components/AppState/AppState";
import Statistic from "./components/statistic/statstic";

import "./App.sass";

function App() {
    const [wavesurfer, setWavesurfer] = useState(null);
    const [track, setTracks] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [training, setTraining] = useState(false);
    const [answer, setAnswer] = useState({});
    const [answersArray, setAnswersArray] = useState([]);
    const [appState, setAppState] = useState("load audio file");

    const setWavesurferInState = (ws) => {
        setWavesurfer(ws);
    };
    const setPlayingInState = (state) => {
        setPlaying(state);
    };
    const setTrainingInState = (state) => {
        setTraining(state);
    };
    const setAppStateInState = (state) => {
        setAppState(state);
    };

    useEffect(() => {
        if (
            typeof appState === "number" &&
            appState > 0 &&
            wavesurfer.isPlaying()
        ) {
            setTimeout(() => {
                setAppState(appState - 1);
            }, 1000);
        } else if (appState === 0) {
            setAppState("your answer?");
        }
    }, [appState]);

    useEffect(() => {
        if (training) {
            answersArray.length === 0
                ? setAppState("get ready")
                : setAppState(answersArray[answersArray.length - 1].status);
            delay(3000).then(() => {
                startQuestion();
            });
            // setAnswer(getQuestEq(wavesurfer.filters));
        }
    }, [training, answersArray]);

    const startQuestion = () => {
        if (wavesurfer.isPlaying()) {
            setAppState(3);
            setAnswer(getQuestEq(wavesurfer.filters));
        }
    };

    const checkAnswer = (selectedFreq, selectedDir) => {
        if (
            selectedFreq.value === answer.freq &&
            selectedDir.value === answer.dir
        ) {
            setAnswersArray([...answersArray, { ...answer, status: "right" }]);
            setAppState("right");
        } else {
            setAnswersArray([...answersArray, { ...answer, status: "wrong" }]);
            setAppState("wrong");
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

    //upload files and save first in state
    function loadAudioFiles(audioFiles, e) {
        if (audioFiles.length > 0) {
            setTracks(audioFiles[0]);
        } else {
            setAppState("ни одного аудио файла не было загружено");
        }
        e.target.value = "";
    }

    //play pause button
    const handlePlayPauseTrack = () => {
        if (wavesurfer) {
            wavesurfer.playPause();
            if (!wavesurfer.isPlaying()) {
                setAppState("paused");
            } else if (training) {
                setAppState("give you answer or press repeat question");
            } else {
                setAppState("press Start training");
            }
            setPlaying(!playing);
        }
    };

    //training start
    const handleTrainingStart = () => {
        setTraining(!training);
    };

    const handleTrainingRepeat = () => {
        setAppState("get ready");
        delay(3000).then(() => {
            startQuestion();
        });
    };

    return (
        <main className="App">
            <InputAudioFile
                trackName={track?.name}
                loadAudioFiles={loadAudioFiles}
            />

            <Player
                setWavesurferInState={setWavesurferInState}
                setPlayingInState={setPlayingInState}
                setTrainingInState={setTrainingInState}
                setAppStateInState={setAppStateInState}
                wavesurfer={wavesurfer}
                track={track}
                playing={playing}
                handlePlayPauseTrack={handlePlayPauseTrack}
            />

            <AppState playing={playing}>{appState}</AppState>

            <Button
                handleAction={
                    training ? handleTrainingRepeat : handleTrainingStart
                }
                undisabled={playing}
            >
                {training ? "Repeat question" : "Start training"}
            </Button>

            <AnswerArea
                playing={playing}
                training={training}
                answer={answer}
                checkAnswer={checkAnswer}
            />
            <Statistic answersArray={answersArray} />
        </main>
    );
}

export default App;
