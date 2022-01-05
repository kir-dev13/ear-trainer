import { useEffect, useRef } from "react";

import WaveSurfer from "wavesurfer.js";

const WaveForm = ({ selectedTrack }) => {
    const waveformRef = useRef(null);

    useEffect(() => {
        // let player = document.querySelector(".player");
        WaveSurfer.create({ container: waveformRef.current });
    }, []);

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
                // wavesurfer.current.play();
            });
        }
    };

    const handlePlay = () => {
        if (wavesurfer) {
            wavesurfer.current.play();
        }
    };

    return (
        <div>
            <div id="waveform" ref={waveformRef} />
            <button onClick={handlePlay}>Play</button>
        </div>
    );
};

export default WaveForm;
