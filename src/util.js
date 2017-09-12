$(function () {
    function initHBTemplate(templateName, cssHook, context) {
        // Grab the template script
        const theTemplateScript = $(templateName).html();

        // Compile the template
        const theTemplate = Handlebars.compile(theTemplateScript);

        // Pass our data to the template
        const theCompiledHtml = theTemplate(context);

        // Add the compiled html to the page
        return $(cssHook).html(theCompiledHtml);
    }

    _.set(window, 'locmoteFSI.initFlightSearchTemplate', function (cssHook, context) {
        const $el = initHBTemplate('#flight-search-template', cssHook, context);

        $(`${cssHook} button[name="search"]`).on('click', function () {
            console.log(`Search was clicked on ${cssHook}`)
        });

        return $el;
    });

});
