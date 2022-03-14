function reducer(state, action) {
    switch (action.type) {
        case "playingToggle":
            return {
                ...state,
                stateApp: action.setStateApp,
                // stateApp: "режим разминки",
                playing: !state.playing,
            };
        case "trainingToggle":
            return {
                ...state,
                stateApp: action.setStateApp,

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
                stateApp: ["внимание вопрос", state.stateApp[1]],
                quest: action.payload,
            };

        case "checkAnswer":
            return { ...state, stateApp: ["checkAnswer", state.stateApp[1]] };
        default:
            throw new Error();
    }
}

export default reducer;
