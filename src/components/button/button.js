import { useState } from "react";

const Button = (props) => {
    const [playing, setPlaying] = useState(false);
    //TODO: ТЕКСТ КНОПКИ ДОЛЖЕН ЗАВИСЕТЬ ОТ ГЛОБАЛЬНОГО СОСТОЯНИЯ ПРИЛОЖЕНИЯ */
    //TODO: МЕНЯТЬ ОНА ДОЛЖНА СОСТОЯНИЕ ВСЕГО ПРИЛОЖЕНИЯ */
    return (
        <button
            onClick={() => {
                setPlaying(!playing);
                props.handlePlay();
            }}
        >
            {playing ? "Stop" : "Play"}
            {/* {playbuttonText} */}
            {/* {props.children} */}
        </button>
    );
};

export default Button;
