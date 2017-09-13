$(() => {
    function initHBTemplate(templateName, cssHook, context) {
        const theTemplateScript = $(templateName).html(); // Grab the template script
        const theTemplate = Handlebars.compile(theTemplateScript); // Compile the template
        const theCompiledHtml = theTemplate(context); // Pass data to the template

        return $(cssHook).html(theCompiledHtml); // Add the compiled html to the page
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
            const DEFAULT_CONTEXT = {
                date: toDateInputValue(new Date()),
                search_results: [],
            };
            const TEMPLATE_NAME = '#flight-search-template';
            let mergedContext = _.merge(context, DEFAULT_CONTEXT);
            const $el = initHBTemplate(TEMPLATE_NAME, cssHook, mergedContext);
            const $form = $(`${cssHook} form[name="search"]`);
            const proxyurl = "https://cors-anywhere.herokuapp.com/"; // Needed to get around CORS

            function resetSearchResults() {
                mergedContext.search_results = [];
                initHBTemplate(TEMPLATE_NAME, cssHook, mergedContext);

                console.log(`Search results were resetted`)
            }

            function setSearchResults(data) {
                mergedContext.search_results = [...mergedContext.search_results, ...data];
                initHBTemplate(TEMPLATE_NAME, cssHook, mergedContext);

                console.log(`Search results were updated`)
            }

            function search4Flights(settings, success, failure) {
                const url = proxyurl + 'http://node.locomote.com/code-task/flight_search/QF';
                const {from, to, when} = settings;
                const args = `date=${when}&from=${from}&to=${to}`;

                $.ajax({
                    url: encodeURI(`${url}?${args}`),
                    success: success,
                    failure: failure,
                });
            }

            function search4Airport(settings, success, failure) {
                const {name} = settings;
                const url = proxyurl + 'http://node.locomote.com/code-task/airports';

                $.ajax({
                    url: encodeURI(`${url}?q=${name}`),
                    success: success,
                    failure: failure,
                });
            }

            function searchAllFlights(settings) {
                const {startingAirportCodes, endingAirportCodes, when} = settings;

                resetSearchResults();

                for (let code0 of startingAirportCodes) {
                    for (let code1 of endingAirportCodes) {
                        search4Flights(
                            {from: code0, to: code1, when},
                            data => setSearchResults(data),
                            _ => logError(`Failed to find flights between ${code0} and ${code1}`),
                        )
                    }
                }

                console.log(startingAirportCodes, endingAirportCodes);
            }

            function onSubmit(e) {
                const from = $(`${cssHook} input[name="from"]`).val();
                const to = $(`${cssHook} input[name="toLoc"]`).val();
                const when = $(`${cssHook} input[name="travelDate"]`).val().toString();

                e.preventDefault();
                $form.css('cursor', 'progress');

                search4Airport(
                    {name: from},
                    startingAirports => search4Airport(
                        {name: to},
                        endingAirports => {
                            searchAllFlights({
                                startingAirportCodes: startingAirports.map(a => a.airportCode),
                                endingAirportCodes: endingAirports.map(a => a.airportCode),
                                when,
                            });
                        },
                        _ => logError(`Failed to search for ${to}`)
                    ),
                    _ => logError(`Failed to search for ${from}`)
                );
            }

            $form.on('submit', onSubmit);
        });
});
