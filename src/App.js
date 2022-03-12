import { useState, useEffect, useRef, useReducer } from "react";
import { dataContext } from "./context";

import { getQuestEq } from "./logic/trainingEQ";
import { delay } from "./logic/sideFunctions";

import InputAudioFile from "./components/inputAudioFile/inputAudioFile";
import Player from "./components/Player/Player";
import Button from "./components/button/button";
import AnswerArea from "./components/AnswerArea/AnswerArea";
import AppState from "./components/AppState/AppState";
import Statistic from "./components/statistic/statstic";

import "./App.sass";

//TODO при ответе, если поставить на паузу - приложение останавливается
//TODO повтор вопроса при нажатии play и активированной тренировке
//TODO состояние текущего ответа!!

function reducer(state, action) {
    switch (action.type) {
        case "playing":
            return { stateApp: "playing" };
        case "ready":
            return { stateApp: "ready" };
        case "questStart":
            return { stateApp: "questStart" };
        case "waitingAnswer":
            return { stateApp: "waitingAnswer" };
        case "checkAnswer":
            return { stateApp: "checkAnswer" };
        default:
            throw new Error();
    }
}

function App() {
    const [wavesurfer, setWavesurfer] = useState(null);
    const [track, setTracks] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [training, setTraining] = useState(false);
    const [quest, setQuest] = useState({});
    const [answersArray, setAnswersArray] = useState([]);
    const [appState, setAppState] = useState("Загрузите аудио файл");

    const [state, dispatch] = useReducer(reducer, { stateApp: "load" });

    const { Provider } = dataContext;

    // let timerQuest = useRef();
    let timerReverse = useRef();

    useEffect(() => {
        if (
            typeof appState === "number" &&
            appState > 0 &&
            wavesurfer.isPlaying()
        ) {
            timerReverse.current = setTimeout(setAppState, 1000, appState - 1);
        } else if (appState === 0) {
            setAppState("Ваш ответ?");
        } else if (appState === "верно" || appState === "неверно") {
            console.log("YEP");
            // clearTimeout(timerQuest.current);
            clearTimeout(timerReverse.current);
        }
    }, [appState]);

    useEffect(() => {
        if (training) {
            if (answersArray.length === 0) {
                setAppState("приготовьтесь");
            } else {
                //!! то что ниже срабатывает после включения тренировки

                answersArray[answersArray.length - 1].status
                    ? setAppState("верно")
                    : setAppState("неверно");
            }
            setTimeout(startQuestion, 3000);
            // setAnswer(getQuestEq(wavesurfer.filters));
        }
    }, [training, answersArray]);

    const startQuestion = (quest = undefined) => {
        if (wavesurfer.isPlaying()) {
            setAppState(3);
            setQuest(getQuestEq(wavesurfer.filters, quest?.dir, quest?.num));
        }
    };

    const checkAnswer = (selectedFreq, selectedDir) => {
        if (
            selectedFreq.value === quest.freq &&
            selectedDir.value === quest.dir
        ) {
            setAnswersArray([...answersArray, { ...quest, status: true }]);
        } else {
            setAnswersArray([...answersArray, { ...quest, status: false }]);
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

    //play pause button
    const handlePlayPauseTrack = () => {
        if (wavesurfer) {
            wavesurfer.playPause();
            if (!wavesurfer.isPlaying()) {
                clearInterval(timerReverse);
                setAppState("пауза");
            } else if (training) {
                trainingRepeat();
            } else {
                setAppState("Нажмите Начать тренировку");
            }
            setPlaying(!playing);
        }
    };

    //training start
    const handleTrainingStart = () => {
        if (training) {
            //!! clearTimeout(timerReverse.current);
            setAppState("тренировка остановлена");
        }
        setTraining(!training);
    };

    const trainingRepeat = () => {
        setAppState("сейчас будет повтор вопроса");
        delay(3000).then(() => {
            startQuestion(quest);
        });
    };

    return (
        <main className="App">
            <Provider value={[playing, training, setPlaying, setTraining]}>
                <InputAudioFile
                    trackName={track?.name}
                    setAppState={setAppState}
                    setTracks={setTracks}
                />

                <Player
                    setWavesurfer={setWavesurfer}
                    wavesurfer={wavesurfer}
                    track={track}
                    handlePlayPauseTrack={handlePlayPauseTrack}
                    setAppState={setAppState}
                    // setAppStateInState={setAppStateInState}
                    // setTrainingInState={setTrainingInState}
                />

                <AppState state={state}></AppState>
                {/* <AppState  playing={playing}>
                    {appState}
                </AppState> */}

                <Button handleAction={handleTrainingStart} undisabled={playing}>
                    {training ? "Остановить тренировку" : "Начать тренировку"}
                </Button>

                <AnswerArea
                    playing={playing}
                    training={training}
                    quest={quest}
                    checkAnswer={checkAnswer}
                />
                <Statistic answersArray={answersArray} />
            </Provider>
        </main>
    );
}

export default App;
