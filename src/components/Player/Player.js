import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

import { createFilters } from "../../logic/createFilters";

import Button from "../button/button";
import Spinner from "../spinner/spinner";

import "./Player.sass";

// import EQ from "../../logic/EQ";

const Player = ({ selectedTrack, WavesurferCreate }) => {
    // const [selectedTrack, setSelectedTrack] = useState(props.selectedTrack);
    const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(false);

    const waveformRef = useRef(null);

    //TODO: wavesurfer иницируется в главном компонентe App и передаётся пропсами в компонент WaveForm для отображения формы волны. Все состояния и методы хранятся в главном компоненте App */

    const wavesurfer = useRef(null);

    useEffect(() => {
        wavesurfer.current = WaveSurfer.create({
            container: waveformRef.current,
            splitChannels: false,
            hideScrollbar: true,
            responsive: true,
        });

        // Removes events, elements and disconnects Web Audio nodes.
        // when component unmount
        return () => {
            wavesurfer.current.destroy();
        };
    }, [selectedTrack]);

    useEffect(() => {
        loadInWaveSurf();
        // document.querySelector("#equalizer").remove();
        if (document.querySelector("#equalizer")) {
            document.querySelector("#equalizer").remove();
        }
    }, [selectedTrack]);

    const loadInWaveSurf = () => {
        if (selectedTrack) {
            wavesurfer.current.loadBlob(selectedTrack);
            setLoading(true);

            wavesurfer.current.on("ready", function () {
                setPlaying(false);
                setLoading(false);
                let filters = createFilters(wavesurfer.current);
                // Connect filters to wavesurfer
                wavesurfer.current.backend.setFilters(filters);

                // Bind filters to vertical range sliders
                const equalizer = document.createElement("div");
                equalizer.id = "equalizer";
                document.querySelector("#player").append(equalizer);

                filters.forEach(function (filter) {
                    let input = document.createElement("input");

                    input.setAttribute("type", "range");
                    input.setAttribute("min", -12);
                    input.setAttribute("max", 12);
                    input.setAttribute("value", 0);
                    input.setAttribute("title", filter.frequency.value);

                    input.style.display = "inline-block";
                    input.setAttribute("orient", "vertical");

                    wavesurfer.current.drawer.style(input, {
                        webkitAppearance: "slider-vertical",
                        width: "50px",
                        height: "150px",
                    });

                    equalizer.appendChild(input);

                    let onChange = function (e) {
                        filter.gain.value = ~~e.target.value;
                    };

                    input.addEventListener("input", onChange);
                    input.addEventListener("change", onChange);
                });
                wavesurfer.current.filters = filters;
            });

            wavesurfer.current.on("finish", () => {
                setPlaying(false);
            });
        }
    };

    const handlePlay = () => {
        console.log(wavesurfer.current.backend.filters);
        wavesurfer.current.playPause();
        setPlaying(!playing);
    };

    return (
        <div id="player">
            {selectedTrack && loading ? <Spinner /> : null}
            <div
                style={{ position: "relative" }}
                id="waveform"
                ref={waveformRef}
            ></div>
            {/* <div id="equalizer" style={{ marginTop: "10px" }}></div> */}
            {wavesurfer.current ? (
                <Button handlePlay={handlePlay} playing={playing}></Button>
            ) : (
                <p>загрузи аудио файл</p>
            )}
        </div>
    );
};

export default Player;
