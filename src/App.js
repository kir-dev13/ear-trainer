import { useState, useEffect, useRef, useReducer } from "react";
// import { dataContext } from "./dataContext";
import { settingsContext, dataContext } from "./contexts/context";
import reducer from "./reducer";

import { getQuestEq } from "./logic/trainingEQ";
import { returnState } from "./logic/sideFunctions";
import {
    defaultFiltersList,
    defaultGain,
    timeQuestionDefault,
    timeBeforeQuestionDefault,
} from "./logic/defaultSettings";

import InputAudioFile from "./components/inputAudioFile/inputAudioFile";
import Player from "./components/Player/Player";
import Button from "./components/button/button";
import AnswerArea from "./components/AnswerArea/AnswerArea";
import AppState from "./components/AppState/AppState";
import Statistic from "./components/statistic/statstic";
import ModalSettings from "./components/modalSettings/modalSettings";

import "./App.sass";

//TODO если нажать начать тренировку а потом остановить, то таймер будет работать.
//TODO при остановке тренировки или начале надо обнулить все фильтры

function App() {
    const [wavesurfer, setWavesurfer] = useState(null);
    const [track, setTracks] = useState(null);
    const [settings, setSettings] = useState({
        filtersList: defaultFiltersList,
        gain: defaultGain,
        timeQuestion: timeQuestionDefault,
        timeBeforeQustion: timeBeforeQuestionDefault,
    });

    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        stateApp: "тренажёр для восприятия частот на слух",
        answersArray: [],
        quest: {},
    });

    //запускаем таймаут с получением нового вопроса после того, как массив с оответами поменялся
    // prettier-ignore
    useEffect(() => {
        if (state.playing && state.training) {
            state.answersArray[state.answersArray.length - 1]?.status
                ? dispatch({
                    type: "stateAppChange",                           
                    setStateApp: "верно",
                })
                : dispatch({
                    type: "stateAppChange",
                    setStateApp: "неверно",
                });
            startQuestion()
        }
    }, [state.answersArray]);

    const startQuestion = (quest = undefined) => {
        if (wavesurfer.isPlaying()) {
            setTimeout(() => {
                dispatch({
                    type: "getQuest",
                    setQuest: getQuestEq(
                        wavesurfer.filters,
                        quest?.dir,
                        quest?.num
                    ),
                    setStateApp: timeQuestionDefault / 1000,
                });
            }, timeBeforeQuestionDefault);
        }
    };

    const repeatQuestion = () => {
        dispatch({
            type: "stateAppChange",
            setStateApp: "сейчас будет повтор вопроса",
        });
        startQuestion(state.quest);
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

    //play pause button
    const handlePlayPauseTrack = () => {
        if (wavesurfer) {
            wavesurfer.playPause();
            if (!state.playing && state.training) {
                dispatch({
                    type: "stateAppChange",
                    setStateApp: "режим тренировки",
                });
                state.stateApp !== "верно" && state.stateApp !== "неверно"
                    ? repeatQuestion()
                    : startQuestion();
            } else if (!state.playing && !state.training) {
                dispatch({
                    type: "stateAppChange",
                    setStateApp: "режим разминки",
                });
            }
            dispatch({
                type: "playingToggle",
            });
        }
    };

    //training start
    const handleTrainingStart = () => {
        if (state.training) {
            // clearTimeout(timerReverse.current) !!!
        } else {
            startQuestion();
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

    const inputComponent = (
        <InputAudioFile trackName={track?.name} setTracks={setTracks} />
    );

    const playerComponent = track ? (
        <Player
            setWavesurfer={setWavesurfer}
            track={track}
            wavesurfer={wavesurfer}
            handlePlayPauseTrack={handlePlayPauseTrack}
            handleTrainingStart={handleTrainingStart}
        />
    ) : null;
    return (
        <div className="App">
            <settingsContext.Provider value={[settings, setSettings]}>
                <aside>
                    <menu className="options">
                        <ModalSettings />
                    </menu>
                </aside>
                <main className="main">
                    <dataContext.Provider value={[state, dispatch]}>
                        {inputComponent}
                        {playerComponent}

                        <AppState
                            wavesurfer={wavesurfer}
                            track={track}
                        ></AppState>

                        <AnswerArea wavesurfer={wavesurfer} />
                        <Statistic answersArray={state.answersArray} />
                    </dataContext.Provider>
                </main>
            </settingsContext.Provider>
        </div>
    );
}

export default App;
