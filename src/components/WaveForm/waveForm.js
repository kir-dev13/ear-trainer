import { useEffect, useRef } from "react";

import WaveSurfer from "wavesurfer.js";
import Button from "../button/button";

const WaveForm = ({ selectedTrack }) => {
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

        // Removes events, elements and disconnects Web Audio nodes.
        // when component unmount
        return () => wavesurfer.current.destroy();
    }, [selectedTrack]);

    useEffect(() => {
        loadInWaveSurf();
    });

    const loadInWaveSurf = () => {
        if (selectedTrack) {
            wavesurfer.current.loadBlob(selectedTrack);

            wavesurfer.current.on("ready", function () {
                // https://wavesurfer-js.org/docs/methods.html
                wavesurfer.current.setVolume(0.5);
                //TODO: здесь меняется состояние игры (останавливается)
            });
        }
    };

    const handlePlay = () => {
        if (wavesurfer && !wavesurfer.current.isPlaying()) {
            wavesurfer.current.play();
        } else if (wavesurfer && wavesurfer.current.isPlaying()) {
            wavesurfer.current.pause();
        }
    };

    return (
        <div>
            <div id="waveform" ref={waveformRef} />
            {/* <button onClick={handlePlay}>Play</button>
             */}
            {wavesurfer.current ? (
                <Button handlePlay={handlePlay} />
            ) : (
                <p>загрузи аудио файл</p>
            )}
        </div>
    );
};

export default WaveForm;
