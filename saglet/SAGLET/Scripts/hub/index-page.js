$(function () {
    // Reference the auto-generated proxy for the hub.
    var indexHub = $.connection.roomIndexHub;
    // Create a function that the hub can call back to display messages.
    indexHub.client.updateRoomIndex = function (id, date, mods, msgs, actions, users) {

        var tr = $('#' + id);
        //update time
        var htmlDate = tr.find('.room-date');
        htmlDate.text(date);

        //update mods
        var HtmlMods = tr.find('.room-mods');
        HtmlMods.text(mods);

        //update msgs
        var HtmlMsgs = tr.find('.room-msgs');
        HtmlMsgs.text(msgs);

        ////update actions
        var HtmlActions = tr.find('.room-actions');
        HtmlActions.text(actions);

        ////update users
        var HtmlUsers = tr.find('.room-users');
        HtmlUsers.text(users);

        //highlight row
        tr.addClass('highlight');
        setTimeout(function () {
            tr.removeClass('highlight');
        }, 3000);
    };

    indexHub.client.registeredComplete = function (msg) {
        console.info(msg);
    }


    $.connection.hub.logging = true;
    /* Hub Start */
    $.connection.hub.start().done(function () {
        console.info("hub started");
        indexHub.server.joinGroup();
        console.log(indexHub);
    });
});