import "./AppState.sass";

const AppState = ({ children }) => {
    return (
        <div className="app_state">
            <p>{children}</p>
        </div>
    );
};

export default AppState;
