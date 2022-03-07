import { WaveSurfer, WaveForm } from "wavesurfer-react";

import Button from "../button/button";
import Spinner from "../spinner/spinner";

const Player = ({
    handleWSMount,
    wavesurfer,
    track,
    playing,
    loading,
    volume,
    handlePlayPauseTrack,
    handleChangeVolume,
}) => {
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
