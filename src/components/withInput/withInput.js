import { useContext } from "react";
import { dataContext } from "../../contexts/context";
import { checkInputFiles } from "../../logic/sideFunctions";

const withInput = (WrappedComponent) => {
    return (props) => {
        const [state, dispatch] = useContext(dataContext);
        const loadAudioFiles = (trackFiles, e) => {
            if (trackFiles.length > 0) {
                dispatch({ type: "reducerSetTrack", payload: trackFiles[0] });
            } else {
                dispatch({
                    type: "stateAppChange",
                    setStateApp: "файл не загружен",
                });
            }
            e.target.value = "";
        };
        return <WrappedComponent loadAudioFiles={loadAudioFiles} {...props} />;
    };
};

export default withInput;
