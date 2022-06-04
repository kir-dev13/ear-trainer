import { useContext } from "react";
import { dataContext } from "../../../contexts/context";
import { checkInputFiles } from "../../../logic/sideFunctions";

const withLoader = (WrappedComponent) => (props) => {
    const [state, dispatch] = useContext(dataContext);
    const loadAudioFiles = (incommingFiles, e = null) => {
        const trackFiles = checkInputFiles(incommingFiles);
        if (trackFiles.length > 0) {
            dispatch({ type: "reducerSetTrack", payload: trackFiles[0] });
        } else {
            dispatch({
                type: "stateAppChange",
                setStateApp: "файл не загружен",
            });
        }
        if (e) {
            e.target.value = "";
        }
    };
    return <WrappedComponent loadAudioFiles={loadAudioFiles} {...props} />;
};

export default withLoader;
