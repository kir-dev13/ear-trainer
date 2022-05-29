import { useState, useEffect, useReducer } from "react";
import { settingsContext, dataContext } from "../../contexts/context";
import reducer from "../../reducer/reducer";

import { getQuestEq } from "../../logic/trainingEQ";
import { returnState } from "../../logic/sideFunctions";
import {
    defaultFiltersList,
    defaultGain,
    timeQuestionDefault,
    timeBeforeQuestionDefault,
} from "../../logic/defaultSettings";

import withInput from "../withInput/withInput";
import InputAudioFile from "../InputAudioFile/inputAudioFile";
import Player from "../Player/Player";
import ControlPanel from "../ControlPanel/ControlPanel";
import AnswerArea from "../AnswerArea/AnswerArea";
import AppState from "../AppState/AppState";
import Statistic from "../Statistic/Statstic";
import ModalSettings from "../ModalSettings/modalSettings";

import "./App.sass";

//TODO если нажать начать тренировку а потом остановить, то таймер будет работать.
//TODO при остановке тренировки или начале надо обнулить все фильтры

function App() {
    const [wavesurfer, setWavesurfer] = useState(null);
    // const [track, setTracks] = useState(null);
    const [settings, setSettings] = useState({
        filtersList: defaultFiltersList.filter(
            (filter) => filter.difficult === "common"
        ),
        difficult: "common",
        gain: defaultGain,
        timeQuestion: timeQuestionDefault,
        timeBeforeQustion: timeBeforeQuestionDefault,
    });

    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        stateApp: "тренажёр для восприятия частот на слух",
        volume: 0.5,
        answersArray: [],
        quest: {},
        track: null,

        //!!
        //?? handleTrainingStart: handleTrainingStart,
        //?? handlePlayPauseTrack: handlePlayPauseTrack,
        //!!
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
                        quest?.num,
                        settings.gain,
                        settings.timeQuestion
                    ),
                    setStateApp: settings.timeQuestion / 1000,
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
    function handlePlayPauseTrack() {
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
    }

    //training start
    function handleTrainingStart() {
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
    }

    const InputComponent =
        // <InputAudioFile
        //     trackName={state?.track?.name}
        //     // setTracks={setTracks}
        // />
        withInput(InputAudioFile);
    const playerComponent = state.track ? (
        <>
            <Player
                setWavesurfer={setWavesurfer}
                // track={track}
                wavesurfer={wavesurfer}
            />
            <ControlPanel
                wavesurfer={wavesurfer}
                // track={track}
                handlePlayPauseTrack={handlePlayPauseTrack}
                handleTrainingStart={handleTrainingStart}
            />
        </>
    ) : null;
    return (
        <div className="App">
            <settingsContext.Provider value={[settings, setSettings]}>
                <aside className="aside-menu">
                    <menu className="options">
                        <ModalSettings />
                    </menu>
                </aside>
                <main className="main">
                    <dataContext.Provider value={[state, dispatch]}>
                        <div className="inputWrapper">
                            <InputComponent />
                            <InputComponent />
                        </div>

                        {playerComponent}

                        <AppState wavesurfer={wavesurfer}></AppState>

                        <AnswerArea wavesurfer={wavesurfer} />
                        {state.track ? (
                            <Statistic answersArray={state.answersArray} />
                        ) : null}
                    </dataContext.Provider>
                </main>
                <footer></footer>
            </settingsContext.Provider>
        </div>
    );
}

export default App;
