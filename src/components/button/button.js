const Button = (props) => {
    return (
        <button
            disabled={!props.undisabled}
            onClick={() => {
                props.handleAction();
            }}
        >
            {props.children}
        </button>
    );
};

export default Button;
