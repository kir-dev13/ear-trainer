import { EQ } from "./EQ";

export const createFilters = (wavesurferCurrent) => {
    // Create filters
    let filters = EQ.map(function (band) {
        // var filter = wavesurfer.current.backend.ac.createBiquadFilter();
        let filter = wavesurferCurrent.backend.ac.createBiquadFilter();
        filter.type = band.type;
        filter.gain.value = 0;
        filter.Q.value = 1;
        filter.frequency.value = band.f;
        return filter;
    });

    return filters;
};
