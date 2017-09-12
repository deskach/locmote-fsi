$(() => {
    const {initFlightSearchTemplate} = window.locmoteFSI.api;

    initFlightSearchTemplate('.flight-to-form', {title: 'Starting point'});
    initFlightSearchTemplate('.flight-from-form', {title: 'Destination'});
});
