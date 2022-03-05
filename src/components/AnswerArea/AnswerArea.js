import { useEffect, useState } from "react";

import { getQuest } from "../../logic/trainingEQ";
import { delay, delayWithInterval } from "../../logic/sideFunctions";
import EQ from "../../logic/EQ";

import Button from "../button/button";

import "./AnswerArea.sass";

const AnswerArea = ({ playing, wavesurfer, training }) => {
    // const [trainingStatus, setTrainingStatus] = useState("");
    //TODO добавить state training в App, отключить нажатия кнопок (убрать кнопки) когда training === false. Переименовать EQ в userSettings.
    const [answer, setAnswer] = useState({});
    const [selectedFreq, setSelectedFreq] = useState({
        state: false,
        value: null,
    });
    const [selectedDir, setSelectedDir] = useState({
        state: false,
        value: null,
    });
    const [answersArray, setAnswersArray] = useState([]);

    useEffect(() => {
        if (training) {
            doTraining();
        }
    }, [training]);

    useEffect(() => {
        console.log(answersArray);
        delay(2000).then(() => doTraining());
    }, [answersArray]);

    useEffect(() => {
        checkAnswer();
    }, [selectedFreq.state, selectedDir.state]);

    function log(a) {
        console.log(a / 1000);
    }

    const doTraining = () => {
        console.log("GO!!");
        // delayWithInterval(5000, log).then(() => console.log("поехали!"));

        setSelectedFreq({
            state: false,
            value: null,
        });
        setSelectedDir({
            state: false,
            value: null,
        });

        if (playing && training) {
            setAnswer(getQuest(wavesurfer.filters));
        }
    };

    const handleAnswerFreq = (e) => {
        if ((selectedFreq.state && selectedDir.state) || !training) {
            return;
        }
        //исключаем direction, если freq === 0
        if (answer.freq === 0 || +e.target.dataset.freq === 0) {
            setSelectedDir({
                state: true,
                value: answer.dir,
            });
        }
        setSelectedFreq({
            state: true,
            value: +e.target.dataset.freq,
        });
    };
    const handleAnswerDir = (e) => {
        if ((selectedFreq.state && selectedDir.state) || !training) {
            return;
        }
        setSelectedDir({
            state: true,
            value: +e.target.dataset.direction,
        });
    };

    const checkAnswer = () => {
        console.log("check Answer");

        if (selectedFreq.state && selectedDir.state && training) {
            if (
                selectedFreq.value === answer.freq &&
                selectedDir.value === answer.dir
            ) {
                setAnswersArray([...answersArray, true]);
            } else {
                setAnswersArray([...answersArray, false]);
            }
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
            const s = showAnswer(item.f, selectedFreq, answer.freq);
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
            let s = showAnswer(i, selectedDir, answer.dir);

            if (answer.freq === 0 && selectedFreq.state) {
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
