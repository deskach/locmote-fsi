$(() => {
    const {initFlightSearchTemplate} = window.locmoteFSI.api;

    initFlightSearchTemplate('.flight-to-form', {title: 'Departure'});
    initFlightSearchTemplate('.flight-from-form', {title: 'Return'});
});
