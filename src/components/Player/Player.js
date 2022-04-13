import { WaveSurfer, WaveForm } from "wavesurfer-react";
import { useState, useEffect, useRef, useContext } from "react";
import { dataContext, settingsContext } from "../../contexts/context";

import { createFilters } from "../../logic/createFilters";

import { Button as ButtonMUI } from "@mui/material/";
import Slider from "@mui/material/Slider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

import VolumeDown from "@mui/icons-material/VolumeDown";

import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";

import Spinner from "../spinner/spinner";

import "./Player.sass";

const Player = ({
    setWavesurfer,
    wavesurfer,
    track,
    handlePlayPauseTrack,
    handleTrainingStart,
}) => {
    const [volume, setVolume] = useState(0.5);
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

            if (wavesurfer?.backend?.source?.context) {
                // wavesurfer.backend.audioContext =
                //     wavesurfer.backend.getAudioContext();
                let osc = wavesurfer.backend.audioContext.createOscillator();
                osc.frequency.value = 110.0;
                osc.type = "sawtooth";
                osc.connect(wavesurfer.backend.gainNode);
                // wavesurfer.backend.buffer = osc;
                // osc.start();
            }
            console.log(wavesurfer.playPause);
            console.log(wavesurfer);
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
            dispatch({
                type: "stateAppChange",
                setStateApp: "аудио файл загружен",
            });
            wavesurfer.setVolume(volume);
            const filters = createFilters(wavesurfer, settings.filtersList); //create filters
            wavesurfer.backend.setFilters(filters); //connect
            wavesurfer.filters = filters;
            dispatch({ type: "loadingChange", payload: false });
        });

        wavesurfer.on("finish", () => {
            wavesurfer.play(0);
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
                >
                    <div className="spinner">
                        {state.loading ? <Spinner /> : null}
                    </div>
                    {/* !! стили спинера.... !! */}
                </WaveForm>
            </WaveSurfer>

            <div className="panel">
                {track ? (
                    <Stack
                        className="volume-slider"
                        spacing={2}
                        direction="row"
                        // sx={{ mb: 1 }}
                        alignItems="center"
                    >
                        <VolumeDown />
                        <Slider
                            className="volume"
                            color="secondary"
                            // style={{ color: "#743C79" }}
                            // #743C79
                            value={volume * 100}
                            onChange={handleChangeVolume}
                        />
                    </Stack>
                ) : null}

                <div className="panel_transport">
                    <IconButton
                        disabled={state.loading}
                        color="primary"
                        onClick={handlePlayPauseTrack}
                    >
                        {state.playing ? (
                            <PauseCircleOutlineIcon
                                style={{
                                    fontSize: "50px",
                                }}
                            />
                        ) : (
                            <PlayCircleOutlineIcon
                                style={{
                                    fontSize: "50px",
                                }}
                            />
                        )}
                    </IconButton>
                    <ButtonMUI
                        className="btn"
                        onClick={handleTrainingStart}
                        disabled={!state.playing}
                        sx={{
                            maxWidth: "100px",
                            minHeight: "70px",
                            padding: "0px 15px ",
                        }}
                    >
                        {state.training
                            ? "Остановить тренировку"
                            : "Начать \n тренировку"}
                    </ButtonMUI>
                </div>
            </div>
        </div>
    );
};

export default Player;
