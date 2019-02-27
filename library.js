const Publisher = {
    getWidgets(widgets, callback) {
        widgets.push({
            name: "Publisher",
            widget: "",
            description: "",
            content: ""
        });
        callback(null, widgets);
    },
    renderWidget(widget, callback) {

    }
};

module.exports = Publisher;
