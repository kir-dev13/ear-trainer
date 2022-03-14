import "./AppState.sass";

const AppState = ({ state, track, loading }) => {
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
    console.log("message: ", message);
    // function status(stateApp) {
    //     switch (stateApp) {
    //         case "load":
    //             return "load";
    //             break;
    //         default:
    //             return "default";
    //     }
    // }
    return (
        <div className="app_state">
            <h6>{message.title}</h6>
            <span>{message.description}</span>
            {/* <p>{status(stateApp)}</p> */}
        </div>
    );
};

// const AppState = ({ children, playing, training }) => {
//     let state = children;

//     if ((!playing && training) || (!playing && typeof state === "number")) {
//         state = "пауза";
//     }
//     return (
//         <div className="app_state">
//             <p>{state}</p>
//         </div>
//     );
// };

export default AppState;
