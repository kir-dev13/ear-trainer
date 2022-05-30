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
    // const [eqSlidersGain, setEqSlidersGain] = useState({});

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

    const EQSliders = ({ filtersList }) => {
        const [eqSlidersGain, setEqSlidersGain] = useState({});

        useEffect(() => {
            const eqSlidersArray = filtersList.map(
                (filter) => filter.frequency.value
            );
            const eqSliders = {};
            eqSlidersArray.forEach((slider) => (eqSliders[slider] = 0));
            console.log("айнанаэ");

            setEqSlidersGain(eqSliders);
        }, [filtersList]);

        const [throwaway, ...filters] = filtersList;

        // console.log(eqSlidersGain);
        const onHandleChange = (e, filter) => {
            console.log(eqSlidersGain);

            filter.gain.value = ~~e.target.value;
            setEqSlidersGain({
                ...eqSlidersGain,
                [filter.frequency.value]: ~~e.target.value,
            });
        };
        return (
            <div className="eq-container">
                {filters.map((filter, i) => {
                    // console.log(filter);

                    const input = (
                        <div className="eq-slider" key={i}>
                            <input
                                onChange={(e) => onHandleChange(e, filter)}
                                style={{ display: "inlineBlock" }}
                                type="range"
                                min="-12"
                                max="12"
                                name={filter.frequency.value}
                                // value="0"
                                value={eqSlidersGain[filter.frequency.value]}
                                orient="vertical"
                            />
                            <label htmlFor={filter.frequency.value}>
                                {filter.frequency.value}
                            </label>
                        </div>
                    );
                    return input;
                })}
            </div>
        );
    };

    // console.log(eqSlidersGain);

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
                    <EQSliders filtersList={wavesurfer.filters} />
                ) : null}
            </div>
        </>
    );
};

export default Player;
