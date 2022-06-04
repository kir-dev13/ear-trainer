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

import withLoader from "../trackLoadersComponents/withLoader/withLoader";
import InputAudioFile from "../trackLoadersComponents/InputAudioFile/inputAudioFile";
import LoadAudioFile from "../trackLoadersComponents/LoadAudioFile/LoadAudioFile";
import Player from "../Player/Player";
import ControlPanel from "../ControlPanel/ControlPanel";
import AnswerArea from "../AnswerArea/AnswerArea";
import AppState from "../AppState/AppState";
import Statistic from "../Statistic/Statstic";
import ModalSettings from "../modalsComponents/ModalSettings/modalSettings";
import Review from "../Review/Review";

import "./App.sass";
import ModalEq from "../modalsComponents/ModalEq/ModalEq";

function App() {
    const [wavesurfer, setWavesurfer] = useState(null);
    const [settings, setSettings] = useState({
        filtersList: defaultFiltersList.filter(
            (filter) => filter.difficult === "common"
        ),
        difficult: "common",
        gain: defaultGain,
        timeQuestion: timeQuestionDefault,
        timeBeforeQuestion: timeBeforeQuestionDefault,
    });

    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        stateApp: "загрузите аудио файл",
        volume: 0.5,
        answersArray: [],
        quest: {},
        track: null,
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
            }, settings.timeBeforeQuestion);
        }
    };

    const repeatQuestion = () => {
        dispatch({
            type: "stateAppChange",
            setStateApp: "сейчас будет повтор вопроса",
        });
        startQuestion(state.quest);
    };

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

    const InputComponentFromDevice = withLoader(InputAudioFile);
    const InputComponentFromServer = withLoader(LoadAudioFile);

    return (
        <div className="App">
            <settingsContext.Provider value={[settings, setSettings]}>
                <aside className="aside-menu">
                    <menu className="options">
                        <ModalEq wavesurfer={wavesurfer} />

                        <ModalSettings />
                    </menu>
                </aside>
                <main className="main">
                    <dataContext.Provider value={[state, dispatch]}>
                        <div className="inputWrapper">
                            <InputComponentFromDevice />
                            <InputComponentFromServer />
                        </div>

                        {state.track ? (
                            <>
                                <Player
                                    setWavesurfer={setWavesurfer}
                                    wavesurfer={wavesurfer}
                                />
                                <ControlPanel
                                    wavesurfer={wavesurfer}
                                    handlePlayPauseTrack={handlePlayPauseTrack}
                                    handleTrainingStart={handleTrainingStart}
                                />
                            </>
                        ) : null}

                        <AppState wavesurfer={wavesurfer}></AppState>

                        {state.loading || wavesurfer?.filters ? (
                            <AnswerArea wavesurfer={wavesurfer} />
                        ) : (
                            <Review />
                        )}

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
