import "./AppState.sass";

const AppState = ({ state }) => {
    const { stateApp } = state;
    console.log(stateApp);
    function status(stateApp) {
        switch (stateApp) {
            case "load":
                return "load";
                break;
            default:
                return "default";
        }
    }
    return (
        <div className="app_state">
            <p>{status(stateApp)}</p>
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
