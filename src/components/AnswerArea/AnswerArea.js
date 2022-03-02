import { useState } from "react";

import EQ from "../../logic/EQ";
import Button from "../button/button";

import { training } from "../../logic/trainingEQ";

import "./AnswerArea.sass";

const AnswerArea = ({ playing, wavesurfer }) => {
    // const [trainingStatus, setTrainingStatus] = useState("");
    const [answer, setAnswer] = useState({});
    const [answerFreq, setAnswerFreq] = useState({
        state: false,
        value: null,
    });
    const [answerDir, setAnswerDir] = useState({
        state: false,
        value: null,
    });

    const handleTrainingStart = () => {
        setAnswerFreq({
            state: false,
            value: null,
        });
        if (playing) {
            setAnswer(training(wavesurfer.filters));
        }
    };

    // const handleCheckAnswer = (e) => {
    //     const buttons = document.querySelectorAll(".frequency");
    //     buttons.forEach((item) => item.setAttribute("disabled", true));
    //     if (+e.target.dataset.freq === answer[0]) {
    //         e.target.classList.add("green");
    //     } else {
    //         e.target.classList.add("red");
    //         buttons.forEach((item) => {
    //             if (+item.dataset.freq === answer[0]) {
    //                 item.classList.add("green");
    //             }
    //         });
    //     }
    //     setTimeout(() => {
    //         document
    //             .querySelectorAll(".frequency")
    //             .forEach((item) => item.classList.remove("red", "green"));
    //         handleTrainingStart();
    //     }, 2000);
    // };

    const handleAnswerFreq = (e) => {
        setAnswerFreq({
            state: true,
            value: +e.target.dataset.freq,
        });
    };
    const handleAnswerDir = (e) => {
        setAnswerDir({
            state: true,
            value: e.target.dataset.direction,
        });
    };

    const AnswerFreq = () => {
        const buttonsList = EQ.map((item, i) => {
            //checking function !!!!!!
            let s = "";
            if (answerFreq.state) {
                if (item.f === answer.freq) {
                    s = "green";
                } else if (answerFreq.value === item.f) {
                    s = "red";
                }
            }
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
        console.log("render");
        return <ul>{buttonsList}</ul>;
    };

    const AnswerDir = () => {
        // checking function !!!!
        let s = "";
        const directionButtons = [];
        for (let i = 1; i > -2; i -= 2) {
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
