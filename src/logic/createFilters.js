export const createFilters = (wavesurferCurrent, filtersList) => {
    let filters = filtersList.map(function (band) {
        let filter = wavesurferCurrent.backend.ac.createBiquadFilter();
        filter.type = band.type;
        filter.gain.value = 0;
        filter.Q.value = 1;
        filter.frequency.value = band.f;
        return filter;
    });

    return filters;
};
