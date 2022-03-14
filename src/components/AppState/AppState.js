import { useContext } from "react";

import { dataContext } from "../../context";
import "./AppState.sass";

const AppState = ({ track }) => {
    const [state] = useContext(dataContext);

    const { stateApp, playing } = state;
    const message = {
        title: stateApp,
        description: "",
    };

    switch (playing) {
        case false:
            message.title = "пауза";
            break;
        case true:
            break;
        default:
            message.title =
                track && !state.loading
                    ? "аудиофайл загружен"
                    : "загрузите аудио файл";
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
