import {
    useEffect,
    useLayoutEffect,
    useState,
    useRef,
    useContext,
} from "react";
import { dataContext, settingsContext } from "../../contexts/context";

import { Button as ButtonMUI } from "@mui/material/";

import { getQuestEq } from "../../logic/trainingEQ";

import "./AnswerArea.sass";

const AnswerArea = ({ wavesurfer }) => {
    const [selectedFreq, setSelectedFreq] = useState({
        state: false,
        value: null,
        num: null,
    });
    const [selectedDir, setSelectedDir] = useState({
        state: false,
        value: null,
    });

    const [state, dispatch] = useContext(dataContext);
    const settings = useContext(settingsContext)[0];
    // console.log("Список фильтров ", settings.filtersList);

    const timerListenFilter = useRef();

    //при изменении state.quest
    useLayoutEffect(() => {
        //если тренирока - обнуляем выбор кнопок с ответами
        if (state.training) {
            setSelectedFreq({
                state: false,
                value: null,
                num: null,
            });
            setSelectedDir({
                state: false,
                value: null,
            });
        }
        //если разминка и выбраны кнопки с ответами, проверяем ответ и обнуляем его и кнопки через время time, если обнулили - не даём сработать таймауту ещё раз
        if (!state.training && selectedDir.state && selectedFreq.state) {
            console.log("state.quest: ", state.quest);
            timerListenFilter.current = setTimeout(() => {
                console.log("timeOut");
                dispatch({
                    type: "nullQuest",
                });
                setSelectedFreq({
                    state: false,
                    value: null,
                    num: null,
                });
                setSelectedDir({
                    state: false,
                    value: null,
                });
            }, settings.timeQuestion);
            if (Object.keys(state.quest).length === 0) {
                clearTimeout(timerListenFilter.current);
            }
        }
    }, [state.quest]);

    //Проверить ответ, когда все кнопки выбраны
    useEffect(() => {
        if (selectedFreq.state && selectedDir.state) {
            state.training
                ? checkAnswer(selectedFreq, selectedDir)
                : listenFilter();
        }
    }, [selectedFreq.state, selectedDir.state]);

    const listenFilter = () => {
        dispatch({
            type: "getQuest",
            setQuest: getQuestEq(
                wavesurfer.filters,
                selectedDir.value,
                selectedFreq.num,
                settings.gain,
                settings.timeQuestion
            ),
            setStateApp: settings.timeQuestion / 1000,
        });
    };

    //запись выбранных ответов в state
    const handleAnswerFreq = (e) => {
        if ((selectedFreq.state && selectedDir.state) || !state.playing) {
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
            num: +e.target.dataset.num,
        });
    };

    const handleAnswerDir = (e) => {
        if ((selectedFreq.state && selectedDir.state) || !state.playing) {
            return;
        }
        setSelectedDir({
            state: true,
            value: +e.target.dataset.direction,
        });
    };

    const checkAnswer = (selectedFreq, selectedDir) => {
        if (
            selectedFreq?.value === state.quest.freq &&
            selectedDir?.value === state.quest.dir
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
        const buttonsList = settings.filtersList.map((item, i) => {
            const s = showAnswer(item.f, selectedFreq, state?.quest?.freq);
            return (
                <li key={i}>
                    <ButtonMUI
                        variant="outlined"
                        onClick={handleAnswerFreq}
                        color="secondary"
                        data-freq={item.f}
                        data-num={i}
                        className={`frequency ${s}`}
                        disabled={
                            (item.f === 0 && !state.training) || !state.playing
                        }
                    >
                        {item.f === 0 ? "none" : item.f}
                    </ButtonMUI>
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
                <ButtonMUI
                    variant="outlined"
                    key={i}
                    onClick={handleAnswerDir}
                    data-direction={i}
                    className={`direction ${s}`}
                    disabled={!state.playing}
                >
                    {i > 0 ? "усиление" : "ослабление"}
                </ButtonMUI>
            );
        }
        return <div className="directions">{directionButtons}</div>;
    };
    return (
        <div className={"answers"}>
            <AnswerDir /> <AnswerFreq />
        </div>
    );
};

export default AnswerArea;
