import { WaveSurfer, WaveForm } from "wavesurfer-react";
import { useState, useEffect, useRef, useContext } from "react";
import { dataContext, settingsContext } from "../../contexts/context";

import { defaultFiltersList } from "../../logic/defaultSettings";

import { createFilters } from "../../logic/createFilters";

import Spinner from "../Spinner/spinner";

import "./Player.sass";

const Player = ({ setWavesurfer, wavesurfer }) => {
    //!!
    const [eqSlidersView, setEqSlidersView] = useState(false);

    const [state, dispatch] = useContext(dataContext);
    const settings = useContext(settingsContext)[0];

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
            const filters = createFilters(wavesurfer, settings.filtersList); //create filters

            wavesurfer.backend.setFilters(filters); //connect
            wavesurfer.filters = filters;
            setEqSlidersView(true);
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

    const EQSliders = ({ filters }) => {
        const onHandleChange = (e, filter) => {
            console.log(filter.gain.value);
            filter.gain.value = ~~e.target.value;
        };

        // if (document.querySelector("#equalizer")) {
        //     document.querySelector("#equalizer").remove();
        // }

        // const equalizer = document.createElement("div");
        return (
            <>
                {filters.map((filter, i) => {
                    const input = (
                        <div key={i}>
                            <input
                                onChange={(e) => onHandleChange(e, filter)}
                                style={{ display: "inlineBlock" }}
                                type="range"
                                min="-12"
                                max="12"
                                name={filter.frequency.value}
                                value={filter.gain.value}
                                orient="vertical"
                            />
                            <label htmlFor={filter.frequency.value}>
                                {filter.frequency.value}
                            </label>
                        </div>
                    );

                    // wavesurfer.drawer.style(input, {
                    //     webkitAppearance: "slider-vertical",
                    //     width: "50px",
                    //     height: "150px",
                    // });
                    return input;
                })}
            </>
        );
        // equalizer.id = "equalizer";
        // document.querySelector(".App").append(equalizer);

        // filters.forEach((filter) => {
        //     let input = document.createElement("input");

        //     input.setAttribute("type", "range");
        //     input.innerText = filter.frequency.value;
        //     input.setAttribute("min", -12);
        //     input.setAttribute("max", 12);
        //     input.setAttribute("value", 0);
        //     // console.log(filter.frequency.value);
        //     input.setAttribute("title", filter.frequency.value);

        //     input.style.display = "inline-block";
        //     input.setAttribute("orient", "vertical");

        // wavesurfer.drawer.style(input, {
        //     webkitAppearance: "slider-vertical",
        //     width: "50px",
        //     height: "150px",
        // });

        //     console.log(input);

        //     equalizer.appendChild(input);

        // let onChange = function (e) {
        //     filter.gain.value = ~~e.target.value;
        // };

        // input.addEventListener("input", onChange);
        // input.addEventListener("change", onChange);
        // });
        // // wavesurfer.filters = filters;
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
                {eqSlidersView ? (
                    <EQSliders filters={wavesurfer.filters} />
                ) : null}
            </div>
        </>
    );
};

export default Player;
