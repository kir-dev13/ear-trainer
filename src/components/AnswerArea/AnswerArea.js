import { useEffect, useLayoutEffect, useState, useContext } from "react";
import { dataContext } from "../../context";

import EQ from "../../logic/EQ";

import Button from "../button/button";

import "./AnswerArea.sass";

const AnswerArea = () => {
    //TODO добавить state training в App, отключить нажатия кнопок (убрать кнопки) когда training === false. Переименовать EQ в userSettings.
    const [selectedFreq, setSelectedFreq] = useState({
        state: false,
        value: null,
    });
    const [selectedDir, setSelectedDir] = useState({
        state: false,
        value: null,
    });

    const [state, dispatch] = useContext(dataContext);

    useLayoutEffect(() => {
        if (state.training && state.quest) {
            setSelectedFreq({
                state: false,
                value: null,
            });
            setSelectedDir({
                state: false,
                value: null,
            });
        }
    }, [state.quest]);

    //Проверить ответ, когда все кнопки выбраны
    useEffect(() => {
        if (selectedFreq.state && selectedDir.state && state.training) {
            checkAnswer(selectedFreq, selectedDir);
        }
    }, [selectedFreq.state, selectedDir.state]);

    //запись выбранных ответов в state
    const handleAnswerFreq = (e) => {
        if (
            (selectedFreq.state && selectedDir.state) ||
            !state.training ||
            !state.playing ||
            Object.keys(state?.quest).length === 0
        ) {
            return;
        }
        //исключаем direction, если freq === 0
        if (state.quest.freq === 0 || +e.target.dataset.freq === 0) {
            setSelectedDir({
                state: true,
                value: state.quest.dir,
            });
        }
        setSelectedFreq({
            state: true,
            value: +e.target.dataset.freq,
        });
    };

    const handleAnswerDir = (e) => {
        if (
            (selectedFreq.state && selectedDir.state) ||
            !state.training ||
            !state.playing ||
            Object.keys(state?.quest).length === 0
        ) {
            return;
        }
        setSelectedDir({
            state: true,
            value: +e.target.dataset.direction,
        });
    };

    const checkAnswer = (selectedFreq, selectedDir) => {
        if (
            selectedFreq.value === state.quest.freq &&
            selectedDir.value === state.quest.dir
        ) {
            dispatch({ type: "addAnswerInArray", payload: true });
        } else {
            dispatch({ type: "addAnswerInArray", payload: false });
        }
    };

    const showAnswer = (target, selected, answer) => {
        let s = "";
        if (selectedFreq.state && selectedDir.state) {
            if (target === answer) {
                s = "green";
            } else if (selected.value === target) {
                s = "red";
            }
        } else if (selected.state) {
            target === selected.value ? (s = "select") : (s = "");
        }
        return s;
    };

    const AnswerFreq = () => {
        const buttonsList = EQ.map((item, i) => {
            const s = showAnswer(item.f, selectedFreq, state?.quest?.freq);
            return (
                <li key={i}>
                    <button
                        onClick={handleAnswerFreq}
                        data-freq={item.f}
                        className={`frequency ${s}`}
                    >
                        {i === 0 ? "none" : item.f}
                    </button>
                </li>
            );
        });
        return <ul className="frequencies">{buttonsList}</ul>;
    };

    const AnswerDir = () => {
        const directionButtons = [];
        for (let i = 1; i > -2; i -= 2) {
            let s = showAnswer(i, selectedDir, state?.quest?.dir);

            if (state?.quest?.freq === 0 && selectedFreq.state) {
                s = "";
            }

            directionButtons.push(
                <button
                    key={i}
                    onClick={handleAnswerDir}
                    data-direction={i}
                    className={`direction ${s}`}
                >
                    {i > 0 ? "+" : "-"}
                </button>
            );
        }
        return <div className="directions">{directionButtons}</div>;
    };

    return (
        <div className={"answers"}>
            <div>
                <AnswerDir />
                <AnswerFreq />
            </div>
        </div>
    );
};

export default AnswerArea;
