import { useEffect, useRef, useContext } from "react";

import { dataContext } from "../../context";

import { time } from "../../logic/EQ";
import "./AppState.sass";

const AppState = ({ track, wavesurfer }) => {
    const [state, dispatch] = useContext(dataContext);

    const { stateApp } = state;
    const message = {
        title: stateApp,
        description: "",
    };

    let timerReverse = useRef();

    function countTime(count) {
        dispatch({ type: "stateAppChange", setStateApp: count });
    }

    //обратный отсчёт вопроса
    //**возможно стоит его добавить в локальный state компонента */
    useEffect(() => {
        if (!state.playing || !state.training) {
            clearTimeout(timerReverse.current);
        }
        if (
            typeof stateApp === "number" &&
            stateApp > 0 &&
            wavesurfer.isPlaying()
        ) {
            timerReverse.current = setTimeout(countTime, 1000, stateApp - 1);
        } else if (stateApp === 0) {
            dispatch({ type: "stateAppChange", setStateApp: "ваш ответ?" });
        } else if (
            stateApp === "верно" ||
            stateApp === "неверно" ||
            !state.training
        ) {
            // clearTimeout(timerQuest.current);
            clearTimeout(timerReverse.current);
        }
    }, [stateApp, state.playing, state.training]);

    switch (true) {
        case message.title === "тренажёр для восприятия частот на слух":
            message.description = "";
            break;
        case message.title === "аудиофайл загружен":
            message.description = "нажмите Play";
            break;
        // case message.title === "файл не загружен":
        //     if (!track) {
        //         message.description = "файл не загружен";
        //     }

        //     break;
        case typeof message.title === "number":
            message.description = "вопрос";
            break;
        default:
            break;
    }

    switch (state.playing) {
        case false:
            message.title = "пауза";
            break;
        case true:
            break;
        default:
            message.title =
                track && !state.loading
                    ? "аудиофайл загружен"
                    : "тренажёр для восприятия частот на слух";
            break;
    }

    return (
        <div className="app_state">
            <h6>{message.title}</h6>
            <span>{message.description}</span>
        </div>
    );
};

export default AppState;
