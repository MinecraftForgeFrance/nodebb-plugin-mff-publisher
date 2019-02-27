/* global define, $, app, socket */

define('admin/plugins/mff-publisher', ['settings'], function(Settings) {
    var Publisher = {};

    Publisher.init = function() {
        Settings.load('mff-publisher', $('.mff-publisher-settings'));

        $('#save').on('click', function() {
            Settings.save('mff-publisher', $('.mff-publisher-settings'), function() {
                app.alert({
                    type: 'success',
                    alert_id: 'mff-publisher-saved',
                    title: 'Settings Saved',
                    message: 'Please reload your NodeBB to apply these settings',
                    clickfn: function() {
                        socket.emit('admin.reload');
                    }
                })
            });
        });
    };

    return Publisher;
});
