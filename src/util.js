$(() => {
    function initHBTemplate(templateName, cssHook, context) {
        const theTemplateScript = $(templateName).html(); // Grab the template script
        const theTemplate = Handlebars.compile(theTemplateScript); // Compile the template
        const theCompiledHtml = theTemplate(context); // Pass data to the template

        return $(cssHook).html(theCompiledHtml); // Add the compiled html to the page
    }

    _.set(window, 'locmoteFSI.api.initFlightSearchTemplate', (cssHook, context = {}) => {
        const $el = initHBTemplate('#flight-search-template', cssHook, context);

        $(`${cssHook} button[name="search"]`).on('click', () => {
            console.log(`Search was clicked on ${cssHook}`)
        });

        return $el;
    });
});
