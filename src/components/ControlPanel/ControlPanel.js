import { useContext } from "react";
import { dataContext } from "../../contexts/context";

import { Button as ButtonMUI } from "@mui/material/";
import Slider from "@mui/material/Slider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

import VolumeDown from "@mui/icons-material/VolumeDown";

import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";

import "./controlPanel.sass";

const ControlPanel = ({
    wavesurfer,
    handlePlayPauseTrack,
    handleTrainingStart,
}) => {
    const [state, dispatch] = useContext(dataContext);

    const handleChangeVolume = (e) => {
        wavesurfer.setVolume(+(e.target.value / 100).toFixed(2));
        // setVolume(+(e.target.value / 100).toFixed(2));
        dispatch({
            type: "setVolume",
            payload: +(e.target.value / 100).toFixed(2),
        });
    };

    return (
        <div className="panel">
            {state.track ? (
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
                        value={state.volume * 100}
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
                    variant="outlined"
                    className="btn"
                    onClick={handleTrainingStart}
                    disabled={!state.playing}
                    sx={{
                        maxWidth: "150px",
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
    );
};

export default ControlPanel;
