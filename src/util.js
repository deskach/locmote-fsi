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

    _.set(window, 'locmoteFSI.api.initFlightSearchTemplate',
        (cssHook, context) => {
            const DEFAULT_CONTEXT = {date: toDateInputValue(new Date()),};
            const mergedContext = _.merge(context, DEFAULT_CONTEXT);
            const $el = initHBTemplate('#flight-search-template', cssHook, mergedContext);

            $(`${cssHook} input[type="date"]`).val(mergedContext.date);
            $(`${cssHook} form[name="search"]`).on('submit', e => {
                const proxyurl = "https://cors-anywhere.herokuapp.com/"; // Needed to get around CORS
                const url = proxyurl + 'http://node.locomote.com/code-task/flight_search/QF';
                const args = 'date=2018-09-02&from=SYD&to=JFK';

                e.preventDefault();

                $.ajax({
                    url: `${url}?${args}`,
                    success: (data) => console.log(JSON.stringify(data)),
                });
                // console.log(`Search was clicked on ${cssHook}`)
            });

            return $el;
        });
});
