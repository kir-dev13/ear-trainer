import { useState } from "react";

import EQ from "../../logic/EQ";
import Button from "../button/button";

import { training } from "../../logic/trainingEQ";

import "./AnswerArea.sass";

const AnswerArea = ({ playing, wavesurfer }) => {
    // const [trainingStatus, setTrainingStatus] = useState("");
    const [answer, setAnswer] = useState(null);

    const handleTrainingStart = () => {
        if (playing) {
            setAnswer(training(wavesurfer.filters));
        }
    };

    const handleCheckAnswer = (e) => {
        const buttons = document.querySelectorAll(".answer");
        buttons.forEach((item) => item.setAttribute("disabled", true));
        if (+e.target.dataset.freq === answer) {
            e.target.classList.add("green");
        } else {
            e.target.classList.add("red");
            console.log(e.target);
            buttons.forEach((item) => {
                if (+item.dataset.freq === answer) {
                    item.classList.add("green");
                }
            });
        }
        setTimeout(() => {
            document
                .querySelectorAll(".answer")
                .forEach((item) => item.classList.remove("red", "green"));
            handleTrainingStart();
        }, 2000);
    };

    const AnswerList = () => {
        const buttonsList = EQ.map((item, i) => {
            return (
                <li key={i}>
                    <button
                        onClick={handleCheckAnswer}
                        data-freq={item.f}
                        className="answer"
                    >
                        {i === 0 ? "none" : item.f}
                    </button>
                </li>
            );
        });
        console.log("render");
        return <ul>{buttonsList}</ul>;
    };

    return (
        <div className={"answers"}>
            <Button handleAction={handleTrainingStart} undisabled={playing}>
                Start training!
            </Button>
            <div>
                <AnswerList />
            </div>
        </div>
    );
};

export default AnswerArea;
