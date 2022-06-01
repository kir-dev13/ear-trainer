export const createFilters = (wavesurferCurrent, filtersList) => {
    let filters = filtersList.map(function (band) {
        let filter = wavesurferCurrent.backend.ac.createBiquadFilter();
        filter.type = band.type;
        filter.gain.value = band.initialGain;
        filter.Q.value = 1;
        filter.frequency.value = band.f;
        return filter;
    });

    return filters;
};

export const createAndConnectFilters = (wavesurferCurrent, filtersList) => {
    const filters = createFilters(wavesurferCurrent, filtersList);
    wavesurferCurrent.backend.setFilters(filters); //connect
    wavesurferCurrent.filters = filters;
    return filters;
};
