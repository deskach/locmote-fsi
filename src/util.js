$(() => {
    function initHBTemplate(templateName, cssHook, context, callback) {
        const templateScript = $(templateName).html(); // Grab the template script
        const template = Handlebars.compile(templateScript); // Compile the template
        const compiledHtml = template(context); // Pass data to the template

        const result = $(cssHook).html(compiledHtml); // Add the compiled html to the page

        callback();

        return result;
    }

    function toDateInputValue(date) {
        let local = new Date(date);

        local.setMinutes(date.getMinutes() - date.getTimezoneOffset());

        return local.toJSON().slice(0, 10);
    }

    function logError(msg) {
        console.log(msg);
    }

    _.set(window, 'locmoteFSI.api.initFlightSearchTemplate',
        (cssHook, context) => {
            const PROXYURL = "https://cors-anywhere.herokuapp.com/"; // Needed to get around CORS
            const localhostOrigin = window.location.protocol + '//' + window.location.host;
            const locmoteOrigin = PROXYURL + 'http://node.locomote.com';
            const origin = window.location.hostname === "localhost" ? localhostOrigin : locmoteOrigin;
            const apiName = window.location.hostname === "localhost" ? "localhost" : "locmote";
            const GLOBAL_SETTINGS = {
                locmote: {
                    airportsUrl: `${origin}/code-task/airports`,
                    flightsUrl: `${origin}/code-task/flight_search/QF`,
                },
                localhost: {
                    airportsUrl: `${origin}/api/airports`,
                    flightsUrl: `${origin}/api/flights`,
                }
            };
            const DEFAULT_CONTEXT = {
                search_results: [],
                from: "",
                to: "",
                when: toDateInputValue(new Date()),
                disabled: null,
                formStyle: "style='cursor: default'",
            };
            const TEMPLATE_NAME = '#flight-search-template';

            const {airportsUrl, flightsUrl} = GLOBAL_SETTINGS[apiName];
            let mergedContext = _.merge(context, DEFAULT_CONTEXT);
            const $el = initHBTemplate(
                TEMPLATE_NAME, cssHook, mergedContext, _ => bindEventHandlers()
            );
            let flights2beLoaded = 0;

            function toggleDisabled() {
                if (flights2beLoaded > 0) {
                    mergedContext.formStyle = "style='cursor: wait'";
                    mergedContext.disabled = "disabled";
                } else {
                    mergedContext.disabled = null;
                    mergedContext.formStyle = "style='cursor: default'";
                }

                initHBTemplate(TEMPLATE_NAME, cssHook, mergedContext, _ => bindEventHandlers());
            }

            function resetSearchResults() {
                mergedContext.search_results = [];
                initHBTemplate(TEMPLATE_NAME, cssHook, mergedContext, _ => bindEventHandlers());

                console.log(`Search results were resetted`)
            }

            function setSearchResults(data) {
                mergedContext.search_results = [...mergedContext.search_results, ...data];
                initHBTemplate(TEMPLATE_NAME, cssHook, mergedContext, _ => bindEventHandlers());

                console.log(`Search results were updated`)
            }

            function search4Flights(settings, success, failure) {
                const {from, to, when, url} = settings;
                const args = `date=${when}&from=${from}&to=${to}`;

                $.ajax({
                    url: encodeURI(`${url}?${args}`),
                    success: success,
                    failure: failure,
                });
            }

            function search4Airport(settings, success, failure) {
                const {name, url} = settings;

                $.ajax({
                    url: encodeURI(`${url}?q=${name}`),
                    success: success,
                    failure: failure,
                });
            }

            function searchAllFlights(settings) {
                const {startingAirportCodes, endingAirportCodes, when, url} = settings;

                flights2beLoaded = startingAirportCodes.length * endingAirportCodes.length;

                if (flights2beLoaded > 0) {
                    resetSearchResults();
                    toggleDisabled();
                }

                for (let code0 of startingAirportCodes) {
                    for (let code1 of endingAirportCodes) {
                        search4Flights(
                            {from: code0, to: code1, when, url},
                            data => {
                                flights2beLoaded -= 1;

                                setSearchResults(data);
                                toggleDisabled();
                            },
                            _ => logError(`Failed to find flights between ${code0} and ${code1}`),
                        )
                    }
                }

                console.log(startingAirportCodes, endingAirportCodes);
            }

            function onSubmit(e) {
                e.preventDefault();

                const from = $(`${cssHook} input[name="from"]`).val();
                const to = $(`${cssHook} input[name="toLoc"]`).val();
                const when = $(`${cssHook} input[name="travelDate"]`).val().toString();

                mergedContext = _.assign(mergedContext, {from, to, when});

                search4Airport(
                    {name: from, url: airportsUrl},
                    startingAirports => search4Airport(
                        {name: to, url: airportsUrl},
                        endingAirports => {
                            searchAllFlights({
                                startingAirportCodes: startingAirports.map(a => a.airportCode),
                                endingAirportCodes: endingAirports.map(a => a.airportCode),
                                url: flightsUrl,
                                when,
                            });
                        },
                        _ => logError(`Failed to search for ${to}`)
                    ),
                    _ => logError(`Failed to search for ${from}`)
                );
            }

            function bindEventHandlers() {
                const $form = $(`${cssHook} form[name="search"]`);

                $form.on('submit', onSubmit);
            }
        });
});
