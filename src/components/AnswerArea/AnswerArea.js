import { useEffect, useState } from "react";

import EQ from "../../logic/EQ";
import Button from "../button/button";

import { training } from "../../logic/trainingEQ";

import "./AnswerArea.sass";

const AnswerArea = ({ playing, wavesurfer }) => {
    // const [trainingStatus, setTrainingStatus] = useState("");
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
        console.log(answersArray);
    }, [answersArray]);

    const handleTrainingStart = () => {
        checkAnswer();

        setSelectedFreq({
            state: false,
            value: null,
        });
        setSelectedDir({
            state: false,
            value: null,
        });

        if (playing) {
            setAnswer(training(wavesurfer.filters));
        }
    };

    const handleAnswerFreq = (e) => {
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
        setSelectedDir({
            state: true,
            value: +e.target.dataset.direction,
        });
    };

    const checkAnswer = () => {
        if (selectedFreq.state && selectedDir.state) {
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
            <Button handleAction={handleTrainingStart} undisabled={playing}>
                Start training!
            </Button>
            <div>
                <AnswerDir />
                <AnswerFreq />
            </div>
        </div>
    );
};

export default AnswerArea;
