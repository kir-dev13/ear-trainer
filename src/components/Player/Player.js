import { WaveSurfer, WaveForm } from "wavesurfer-react";
import { useState, useEffect, useRef, useContext } from "react";
import { dataContext, settingsContext } from "../../contexts/context";

import { defaultFiltersList } from "../../logic/defaultSettings";

import { createAndConnectFilters } from "../../logic/createFilters";

import Spinner from "../Spinner/spinner";

import "./Player.sass";

const Player = ({ setWavesurfer, wavesurfer }) => {
    const [state, dispatch] = useContext(dataContext);
    const [settings, setSettings] = useContext(settingsContext);

    //loading file in wavesurfer
    useEffect(() => {
        if (state.track && wavesurfer) {
            wavesurfer.loadBlob(state?.track);

            dispatch({ type: "loadingChange", payload: true });
            if (state.playing) {
                dispatch({ type: "playingOff" });
            }
            dispatch({ type: "trainingOff" });
            eventsSubscribe();
        }
    }, [state.track, wavesurfer]);

    useEffect(() => {
        if (wavesurfer) {
            const filters = createAndConnectFilters(
                wavesurfer,
                settings.filtersList
            );
            setSettings({ ...settings, filters });
        }
    }, [settings.difficult, wavesurfer]);

    const wavesurferRef = useRef();
    //create wavesurfer instance once, when component Wavesurfer mount
    const handleWSMount = (waveSurfer) => {
        wavesurferRef.current = waveSurfer;
        setWavesurfer(wavesurferRef.current);
    };

    const eventsSubscribe = () => {
        wavesurfer.on("ready", () => {
            dispatch({
                type: "stateAppChange",
                setStateApp: "аудио файл загружен",
            });
            wavesurfer.setVolume(state.volume);
            // const filters = createFilters(
            //     wavesurfer,
            //     settings.difficult === "common"
            //         ? defaultFiltersList.filter(
            //               (filter) => filter.difficult === "common"
            //           )
            //         : defaultFiltersList
            // ); //create filters
            // wavesurfer.backend.setFilters(filters); //connect
            // wavesurfer.filters = filters;
            dispatch({ type: "loadingChange", payload: false });
        });

        wavesurfer.on("finish", () => {
            wavesurfer.play(0);
        });
    };

    return (
        <>
            <div className="player">
                <WaveSurfer onMount={handleWSMount}>
                    <WaveForm
                        hideScrollbar={true}
                        responsive={true}
                        waveColor={"rgb(116, 60, 121)"}
                        progressColor={"#ffa70467"}
                        id="waveform"
                    >
                        <div className="spinner">
                            {state.loading ? <Spinner /> : null}
                        </div>
                        {/* !! стили спинера.... !! */}
                    </WaveForm>
                </WaveSurfer>
            </div>
        </>
    );
};

export default Player;
