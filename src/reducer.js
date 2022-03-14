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
                playing: !state.playing,
            };
        case "trainingToggle":
            return {
                ...state,
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
                quest: action.getQuest,
            };
        case "addAnswerInArray":
            return {
                ...state,
                answersArray: [
                    ...state.answersArray,
                    { ...state.quest, status: action.payload },
                ],
            };

        case "checkAnswer":
            return { ...state, stateApp: "checkAnswer" };
        default:
            throw new Error();
    }
}

export default reducer;
