import { useEffect, useRef } from "react";

import WaveSurfer from "wavesurfer.js";

import Button from "../button/button";

const Player = ({ selectedTrack }) => {
    const waveformRef = useRef(null);

    //TODO: wavesurfer иницируется в главном компонентe App и передаётся пропсами в компонент WaveForm для отображения формы волны. Все состояния и методы хранятся в главном компоненте App */

    // useEffect(() => {
    //     // let player = document.querySelector(".player");
    //     WaveSurfer.create({ container: waveformRef.current });
    // }, []);

    const wavesurfer = useRef(null);

    useEffect(() => {
        wavesurfer.current = WaveSurfer.create({
            container: waveformRef.current,
            splitChannels: false,
        });

        console.log("track in player: ", !!selectedTrack);
        console.log(wavesurfer.current);

        // Removes events, elements and disconnects Web Audio nodes.
        // when component unmount
        return () => wavesurfer.current.destroy();
    }, [selectedTrack]);

    useEffect(() => {
        loadInWaveSurf();
    });

    const loadInWaveSurf = () => {
        console.log("useEffect-2");
        if (selectedTrack) {
            wavesurfer.current.loadBlob(selectedTrack);

            wavesurfer.current.on("ready", function () {
                // https://wavesurfer-js.org/docs/methods.html

                // wavesurfer.current.setVolume(0.5);
                var EQ = [
                    {
                        f: 64,
                        type: "peaking",
                    },
                    {
                        f: 125,
                        type: "peaking",
                    },
                    {
                        f: 250,
                        type: "peaking",
                    },
                    {
                        f: 500,
                        type: "peaking",
                    },
                    {
                        f: 1000,
                        type: "peaking",
                    },
                    {
                        f: 2000,
                        type: "peaking",
                    },
                    {
                        f: 4000,
                        type: "peaking",
                    },
                    {
                        f: 8000,
                        type: "peaking",
                    },
                    {
                        f: 16000,
                        type: "highshelf",
                    },
                ];

                // Create filters
                var filters = EQ.map(function (band) {
                    var filter =
                        wavesurfer.current.backend.ac.createBiquadFilter();
                    filter.type = band.type;
                    filter.gain.value = 0;
                    filter.Q.value = 1;
                    filter.frequency.value = band.f;
                    return filter;
                });

                // Connect filters to wavesurfer
                wavesurfer.current.backend.setFilters(filters);

                // Bind filters to vertical range sliders
                var container = document.querySelector("#equalizer");
                filters.forEach(function (filter) {
                    console.log(filter);
                    var input = document.createElement("input");
                    console.log(input);
                    // wavesurfer.current.util.extend(input, {
                    //     type: "range",
                    //     min: -40,
                    //     max: 40,
                    //     value: 0,
                    //     title: filter.frequency.value,
                    // });
                    input.setAttribute("type", "range");
                    input.setAttribute("min", -40);
                    input.setAttribute("max", 40);
                    input.setAttribute("value", 0);
                    input.setAttribute("title", filter.frequency.value);
                    console.log(input);
                    input.style.display = "inline-block";
                    input.setAttribute("orient", "vertical");
                    console.log(input);
                    wavesurfer.current.drawer.style(input, {
                        webkitAppearance: "slider-vertical",
                        width: "50px",
                        height: "150px",
                    });
                    console.log(input);
                    container.appendChild(input);

                    var onChange = function (e) {
                        filter.gain.value = ~~e.target.value;
                    };

                    input.addEventListener("input", onChange);
                    input.addEventListener("change", onChange);
                });
                wavesurfer.current.filters = filters;
            });
        }
    };

    const handlePlay = () => {
        // if (wavesurfer && !wavesurfer.current.isPlaying()) {
        //     wavesurfer.current.play();
        // } else if (wavesurfer && wavesurfer.current.isPlaying()) {
        //     wavesurfer.current.pause();
        // }
        wavesurfer.current.playPause();
    };

    return (
        <div>
            <div id="waveform" ref={waveformRef}>
                {/* {wavesurfer.current ? null : <p>загрузи!!</p>} */}
            </div>
            <div id="equalizer" style={{ marginTop: "10px" }}></div>
            {wavesurfer.current ? (
                <Button handlePlay={handlePlay} />
            ) : (
                <p>загрузи аудио файл</p>
            )}
        </div>
    );
};

export default Player;
