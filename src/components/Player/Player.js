import { WaveSurfer, WaveForm } from "wavesurfer-react";
import { useState, useEffect, useRef, useContext } from "react";
import { dataContext, settingsContext } from "../../contexts/context";

import { createFilters } from "../../logic/createFilters";

import Spinner from "../Spinner/Spinner";

import "./Player.sass";

const Player = ({ setWavesurfer, wavesurfer, track }) => {
    const [state, dispatch] = useContext(dataContext);
    const settings = useContext(settingsContext)[0];

    //loading file in wavesurfer
    useEffect(() => {
        if (track && wavesurfer) {
            wavesurfer.loadBlob(track);

            dispatch({ type: "loadingChange", payload: true });
            if (state.playing) {
                dispatch({ type: "playingOff" });
            }
            dispatch({ type: "trainingOff" });
            eventsSubscribe();
        }
    }, [track, wavesurfer]);

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
            const filters = createFilters(wavesurfer, settings.filtersList); //create filters
            wavesurfer.backend.setFilters(filters); //connect
            wavesurfer.filters = filters;
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
