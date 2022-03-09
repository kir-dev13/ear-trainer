import { useState, useEffect, useRef } from "react";

import { WaveSurfer, WaveForm } from "wavesurfer-react";
import { createFilters } from "../../logic/createFilters";

import Button from "../button/button";
import Spinner from "../spinner/spinner";

import "./Player.sass";

const Player = ({
    setWavesurferInState,
    setPlayingInState,
    setTrainingInState,
    wavesurfer,
    track,
    playing,
    handlePlayPauseTrack,
    setAppStateInState,
}) => {
    const [volume, setVolume] = useState(0.5);
    const [loading, setLoading] = useState(false);

    //loading file in wavesurfer
    useEffect(() => {
        if (track) {
            wavesurfer.loadBlob(track);
            setLoading(true);
            setPlayingInState(false);
            setTrainingInState(false);
            setAppStateInState("Нажмите play и затем начать тренировку");
            eventsSubscribe();
        }
    }, [track]);

    const wavesurferRef = useRef();
    //create wavesurfer instance once, when component Wavesurfer mount
    const handleWSMount = (waveSurfer) => {
        wavesurferRef.current = waveSurfer;
        setWavesurferInState(wavesurferRef.current);
    };

    const eventsSubscribe = () => {
        // wavesurfer.on("loading", (progress) => console.log(progress));

        wavesurfer.on("ready", () => {
            setLoading(false);
            wavesurfer.setVolume(volume);
            const filters = createFilters(wavesurfer); //create filters
            wavesurfer.backend.setFilters(filters); //connect
            wavesurfer.filters = filters;
        });

        wavesurfer.on("finish", () => {
            wavesurfer.stop();
            setAppStateInState("Нажмите play и затем начать тренировку");
            setPlayingInState(false);
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
                    {loading ? <Spinner /> : null}
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
                undisabled={!!track && !loading}
                handleAction={handlePlayPauseTrack}
            >
                {playing ? "Pause" : "Play"}
            </Button>
        </div>
    );
};

export default Player;
