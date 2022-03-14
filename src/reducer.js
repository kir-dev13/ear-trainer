function reducer(state, action) {
    switch (action.type) {
        case "stateAppChange":
            return {
                ...state,
                stateApp: action.setStateApp,
            };
        case "loadingChange":
            return {
                ...state,
                loading: action.payload,
            };

        case "playingToggle":
            return {
                ...state,
                // stateApp: "режим разминки",
                playing: !state.playing,
            };
        case "trainingToggle":
            return {
                ...state,

                // stateApp: "режим тренировки",
                training: !state.training,
            };
        case "playingOff":
            return { ...state, playing: false };
        case "trainingOff":
            return { ...state, training: false };
        case "getQuest":
            return {
                ...state,
                stateApp: "внимание вопрос!",
                quest: action.payload,
            };

        case "checkAnswer":
            return { ...state, stateApp: "checkAnswer" };
        default:
            throw new Error();
    }
}

export default reducer;
