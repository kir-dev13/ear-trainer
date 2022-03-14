import { WaveSurfer, WaveForm } from "wavesurfer-react";
import { useState, useEffect, useRef, useContext } from "react";
import { dataContext } from "../../context";

import { createFilters } from "../../logic/createFilters";

import Button from "../button/button";
import Spinner from "../spinner/spinner";

import "./Player.sass";

const Player = ({
    setWavesurfer,
    wavesurfer,
    track,
    handlePlayPauseTrack,
    setAppState,
}) => {
    const [volume, setVolume] = useState(0.5);
    const [state, dispatch] = useContext(dataContext);

    //loading file in wavesurfer
    useEffect(() => {
        if (track) {
            wavesurfer.loadBlob(track);
            dispatch({ type: "loadingChange", payload: true });
            if (state.playing) {
                dispatch({ type: "playingOff" });
            }
            dispatch({ type: "trainingOff" });
            eventsSubscribe();
        }
    }, [track]);

    const wavesurferRef = useRef();
    //create wavesurfer instance once, when component Wavesurfer mount
    const handleWSMount = (waveSurfer) => {
        wavesurferRef.current = waveSurfer;
        setWavesurfer(wavesurferRef.current);
    };

    const eventsSubscribe = () => {
        // wavesurfer.on("loading", (progress) => console.log(progress));

        wavesurfer.on("ready", () => {
            dispatch({ type: "loadingChange", payload: false });
            wavesurfer.setVolume(volume);
            const filters = createFilters(wavesurfer); //create filters
            wavesurfer.backend.setFilters(filters); //connect
            wavesurfer.filters = filters;
        });

        wavesurfer.on("finish", () => {
            wavesurfer.stop();
            setAppState("Нажмите play и затем начать тренировку");
            dispatch({ type: "playingOff" });
            dispatch({
                type: "stateAppChange",
                setStateApp: "трек закончен",
            });
        });
    };

    const handleChangeVolume = (e) => {
        wavesurfer.setVolume(+(e.target.value / 100).toFixed(2));
        setVolume(+(e.target.value / 100).toFixed(2));
    };

    return (
        <div className="player">
            <WaveSurfer onMount={handleWSMount}>
                <WaveForm
                    hideScrollbar={true}
                    responsive={true}
                    waveColor={"rgb(116, 60, 121)"}
                    progressColor={"#ffa70467"}
                    id="waveform"
                    style={{ position: "relative" }}
                >
                    {state.loading ? <Spinner /> : null}
                    {/* !! стили спинера.... !! */}
                </WaveForm>
            </WaveSurfer>

            {track ? (
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume * 100}
                    onChange={(e) => handleChangeVolume(e)}
                />
            ) : null}

            <Button
                undisabled={!!track && !state.loading}
                handleAction={handlePlayPauseTrack}
            >
                {state.playing ? "Pause" : "Play"}
            </Button>
        </div>
    );
};

export default Player;
