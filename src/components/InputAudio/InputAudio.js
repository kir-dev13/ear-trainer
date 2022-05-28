import { useContext } from "react";
import { dataContext } from "../../contexts/context";

export const InputAudio = (WrappedComponent, loadTrack) => {
    // const [state, dispatch] = useContext(dataContext);

    return <WrappedComponent loadTrack={loadTrack} />;
};
