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
            const mergedContext = _.merge(context, DEFAULT_CONTEXT);
            const $el = initHBTemplate(TEMPLATE_NAME, cssHook, mergedContext);
            const $form = $(`${cssHook} form[name="search"]`);
            const proxyurl = "https://cors-anywhere.herokuapp.com/"; // Needed to get around CORS

            function setSearchResults(data) {
                _.assign(mergedContext, {search_results: data});
                initHBTemplate(TEMPLATE_NAME, cssHook, mergedContext);
                $form.css('cursor', 'default');

                console.log(`Search succeeded for ${cssHook}`)
            }

            function search4Flights(success, failure, e) {
                const url = proxyurl + 'http://node.locomote.com/code-task/flight_search/QF';
                const from = $(`${cssHook} input[name="from"]`).val();
                const to = $(`${cssHook} input[name="toLoc"]`).val();
                const when = $(`${cssHook} input[name="travelDate"]`).val().toString();
                const args = `date=${when}&from=${from}&to=${to}`;

                e.preventDefault();

                $form.css('cursor', 'progress');
                $.ajax({
                    url: `${url}?${args}`,
                    success: success,
                    failure: failure,
                });
            }

            $form.on(
                'submit',
                search4Flights.bind(
                    null,
                    setSearchResults,
                    logError.bind(null, "Failed to search for a flight")
                )
            );

            return $el;
        });
});
