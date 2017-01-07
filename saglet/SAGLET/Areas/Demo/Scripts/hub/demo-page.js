var demoHub;
var demos = {
    demo1: {        //all options available
        toolbar: true,
        summaryTable: true,
        popup: true,
        usersUpdate: true,
        toolbarCp: true
    },
    demo2: {        //just user panel
        toolbar: true,
        summaryTable: false,
        popup: false,
        usersUpdate: false,
        toolbarCp: false
    },
    demo3: {        //only popups
        toolbar: false,
        summaryTable: false,
        popup: true,
        usersUpdate: false,
        toolbarCp: true
    },
    demo4: {        //all options turned off
        toolbar: false,
        summaryTable: false,
        popup: false,
        usersUpdate: false,
        toolbarCp: false
    },
    demo5: {        //
        toolbar: true,
        summaryTable: true,
        popup: false,
        usersUpdate: true,
        toolbarCp: true,
        feedback: false,
        roomsList: false
    },
    demo6: {        //all options turned off
        toolbar: false,
        summaryTable: false,
        popup: false,
        usersUpdate: false,
        toolbarCp: false,
        feedback: false,
        roomsList: false
    }

}


$(function () {
    
    demoHub = $.connection.demoHub;

    demoHub.client.feedBackSaved = function (fb) {
        console.info('feedBackSaved ' + fb);
    };

    $.connection.hub.start().done(function () {
        console.info("demo hub started");

        //hide feedback for demo 5-6
        if (room.demo.feedback === false) {
            var sumTable = $('#summary-table');
            var feedbackTag = sumTable.find('tbody').find('th')[3]
            feedbackTag.remove()
        }
    });

    $.connection.hub.start().fail(function (error) {
        console.info("demo hub failed to started");
        console.info(error);
    });

    $(document).on('click', 'td.rating > span', function () {
        // get params
        var row = $(this).closest('tr');
        var rowClass = '.' + row.attr('class');
        var stars = $(this).nextAll('span').length + 1;
        var args = row.attr('class').split('-');
        var roomID = row.attr('data-roomid'), type = args[1];
        var text = $(row).find('.cp-text').text();

        // unmark all stars and mark up to 'stars' count
        $(rowClass + ' span').removeClass('selected');
        var firstFive = $(rowClass + ' span').slice(5 - stars, 5)
        var lastFive = $(rowClass + ' span').slice(10 - stars, 10)
        $(firstFive).addClass('selected');
        $(lastFive).addClass('selected');

        // send request to server to save user input to db
        demoHub.server.saveFeedBack(room.user, roomID, text, stars);

        // mark row as selected and seen
        //$(rowClass).addClass('selected');
        $(rowClass).attr('data-status', 'seen');

        // update summary panels
        checkForUpdateNumOfCP(roomID, type);
        checkForUpdateColorOfCP(roomID, type);
        console.log('skip -> ' + rowClass);
    });
});