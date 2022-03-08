import "./AppState.sass";

const AppState = ({ children, playing, training }) => {
    let state = children;

    if ((!playing && training) || (!playing && typeof state === "number")) {
        state = "paused";
    }
    return (
        <div className="app_state">
            <p>{state}</p>
        </div>
    );
};

export default AppState;
