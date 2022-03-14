import { useState, useEffect, useRef, useReducer } from "react";
import { dataContext } from "./context";
import reducer from "./reducer";

import { getQuestEq } from "./logic/trainingEQ";
import { delay, returnState } from "./logic/sideFunctions";
import { time } from "./logic/EQ";

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

//** */ сейчас два режима training - разминка (false) и тренировка (true) - будет как минимум 3

function App() {
    const [wavesurfer, setWavesurfer] = useState(null);
    const [track, setTracks] = useState(null);
    // const [playing, setPlaying] = useState(false);
    // const [training, setTraining] = useState(false);
    // const [quest, setQuest] = useState({});
    const [answersArray, setAnswersArray] = useState([]);
    const [appState, setAppState] = useState("Загрузите аудио файл");

    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        stateApp: "режим разминки",
    });

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
        if (state.training) {
            if (answersArray.length === 0) {
                setAppState("приготовьтесь");
            } else {
                //!! то что ниже срабатывает после включения тренировки

                answersArray[answersArray.length - 1].status
                    ? setAppState("верно")
                    : setAppState("неверно");
            }
            setTimeout(startQuestion, time);
            // setAnswer(getQuestEq(wavesurfer.filters));
        }
    }, [state.training, answersArray]);

    const startQuestion = (quest = undefined) => {
        if (wavesurfer.isPlaying()) {
            setAppState(3);
            // setQuest(
            //     getQuestEq(wavesurfer.filters, state.quest?.dir, state?.num)
            // );
            dispatch({
                type: "getQuest",
                payload: getQuestEq(
                    wavesurfer.filters,
                    state.quest?.dir,
                    state?.num
                ),
            });
        }
    };

    const checkAnswer = (selectedFreq, selectedDir) => {
        if (
            selectedFreq.value === state.quest.freq &&
            selectedDir.value === state.quest.dir
        ) {
            setAnswersArray([
                ...answersArray,
                { ...state.quest, status: true },
            ]);
        } else {
            setAnswersArray([
                ...answersArray,
                { ...state.quest, status: false },
            ]);
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
            } else if (state.training) {
                trainingRepeat();
            }
            dispatch({
                type: "playingToggle",
            });
            // setPlaying(!playing)
        }
    };

    //training start
    const handleTrainingStart = () => {
        if (state.training) {
            //!! clearTimeout(timerReverse.current);
            setAppState("тренировка остановлена");
        }
        dispatch({
            type: "trainingToggle",
        });
        dispatch({
            type: "stateAppChange",
            setStateApp: returnState(
                "режим разминки",
                "режим тренировки",
                state.training
            ),
        });
    };

    const trainingRepeat = () => {
        setAppState("сейчас будет повтор вопроса");
        delay(time).then(() => {
            startQuestion(state.quest);
        });
    };
    console.log(state.playing);

    return (
        <main className="App">
            <Provider value={[state, dispatch]}>
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

                <AppState state={state} track={track}></AppState>
                {/* <AppState  playing={playing}>
                    {appState}
                </AppState> */}

                <Button
                    handleAction={handleTrainingStart}
                    undisabled={state.playing}
                >
                    {state.training
                        ? "Остановить тренировку"
                        : "Начать тренировку"}
                </Button>

                <AnswerArea
                    // playing={playing}
                    checkAnswer={checkAnswer}
                />
                <Statistic answersArray={answersArray} />
            </Provider>
        </main>
    );
}

export default App;
