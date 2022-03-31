import { WaveSurfer, WaveForm } from "wavesurfer-react";
import { useState, useEffect, useRef, useContext } from "react";
import { dataContext } from "../../context";

import { createFilters } from "../../logic/createFilters";

import { Button as ButtonMUI } from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";

import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";

import Button from "../button/button";
import Spinner from "../spinner/spinner";

import "./Player.sass";

const Player = ({ setWavesurfer, wavesurfer, track, handlePlayPauseTrack }) => {
    const [volume, setVolume] = useState(0.5);
    const [state, dispatch] = useContext(dataContext);

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
        // wavesurfer.on("loading", (progress) => console.log(progress));

        wavesurfer.on("ready", () => {
            dispatch({ type: "loadingChange", payload: false });
            dispatch({
                type: "stateAppChange",
                setStateApp: "аудио файл загружен",
            });
            wavesurfer.setVolume(volume);
            const filters = createFilters(wavesurfer); //create filters
            wavesurfer.backend.setFilters(filters); //connect
            wavesurfer.filters = filters;
        });

        wavesurfer.on("finish", () => {
            wavesurfer.play(0);
        });
    };

    const handleChangeVolume = (e) => {
        console.log(e.target.value);
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
                    // style={{ position: "relative" }}
                >
                    <div className="spinner">
                        {state.loading ? <Spinner /> : null}
                    </div>
                    {/* !! стили спинера.... !! */}
                </WaveForm>
            </WaveSurfer>

            <div className="panel">
                {track ? (
                    // <input
                    //     type="range"
                    //     className="volume-slider"
                    // min={0}
                    // max={100}
                    //     value={volume * 100}
                    //     onChange={(e) => handleChangeVolume(e)}
                    // />
                    <Stack
                        className="volume-slider"
                        spacing={2}
                        direction="row"
                        // sx={{ mb: 1 }}
                        alignItems="center"
                    >
                        <VolumeDown />
                        <Slider
                            color="secondary"
                            // min={0}
                            // max={100}
                            // aria-label="Volume"
                            value={volume * 100}
                            onChange={handleChangeVolume}
                        />
                        <VolumeUp />
                    </Stack>
                ) : null}

                <IconButton
                    // type="link"
                    // undisabled={!!track && !state.loading}
                    disabled={state.loading}
                    color="primary"
                    onClick={handlePlayPauseTrack}
                    // style={{
                    //     height: "40px",
                    //     width: "50px",
                    //     position: "relative",
                    // }}
                >
                    {state.playing ? (
                        <PauseCircleOutlineIcon
                            style={{
                                fontSize: "40px",
                            }}
                        />
                    ) : (
                        <PlayCircleOutlineIcon
                            style={{
                                fontSize: "40px",
                            }}
                        />
                    )}
                </IconButton>
            </div>
        </div>
    );
};

export default Player;
