
function HandleCPAddEvent(roomID, userID, type, priority, text) {
    if (room.demo && !room.demo.toolbarCp) return;
    
    console.info("HandleCPAddEvent");
    var cp = {
        id: room.cp.nextId++,
        roomID: roomID,
        dup_roomID: roomID,
        cpLabel: type,
        trigger: "msg",
        triggerIcon: "chat-bubble-two",
        timestamp: new Date().toLocaleTimeString(),
        user: userID,
        type: type,
        priority: priority,
        text: text
    }
    room.updateNewCPToolBar(roomID, room.demo, cp);
}

function HandleUsersUpdateEvent(roomID, msgCount) {
    console.info("HandleUsersUpdateEvent");
    
    for (var i = 0; i < msgCount.length; i++) {

        var userData = {
            actions: 0,
            isMod: false,
            isOnline: null,
            msgs: msgCount[i].Value,
            sentiment: 50,
            user: msgCount[i].Key
        }

        detailsHub.client.UpdateRoomUserToolBar(roomID, userData);
        if (room.demo.usersUpdate)
            detailsHub.client.updateUsersGraphToolBar(roomID, userData);
    }
}


/* **DEMO** LIVE Add new CP - VMTToolbar View */
room.updateNewCPToolBar = function (roomID, roomDemo, cp) {
    console.info('updateNewCPToolBar');
    if (cp.trigger == 'act' && !room.settings.cpa) return;
    
    
    var cpHtml = "'<td class='rating'>' + '<span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>' + '</td>' + ";
    var cpHtmlRating = ""
    var trClass = String.format('cp-{0}-{1}-{2}-{3}', cp.trigger, cp.roomID, cp.id, cp.cpLabel);
    console.log(cp);

    //hide reviewd?
    var hideClass = room.settings.reviewed ? '' : 'hidden'
    var roomHtml = room.settings.listRoomID ? '<td>' + cp.roomID + ' </td>' : '';
    var triggerHtml = room.settings.listTrigger ? '<td> <i class="cp-goto icon-' + cp.triggerIcon + '"></i> </td>' : '';
    var timeHtml = room.settings.listTime ? '<td>' + cp.timestamp + '</td>' : '';

    
    //hide feedback
    if (roomDemo.feedback === false) 
        cpHtml = '';
    


    // add to _VMT toolbox
    var vmtRoom = String.format('#rooms-toolbar #vmt-room-{0} .{1} table', roomID, cp.trigger);
    console.info("feedback check");
    console.log($(vmtRoom + ' tr:first'));

    $(vmtRoom + ' tr:first').after(
          '<tr class=' +
          trClass + ' data-status="unseen" data-roomid=' +
          cp.dup_roomID + ' data-priority=' +
          cp.priority + '>' + '<td class=' +
          hideClass + '> <i class="cp-skip icon-android-done"></i> </td>' +
          timeHtml +
          triggerHtml +
              //'<td>' + cp.user + '</td>' +
              //'<td>' + cp.type + '</td>' +
              //'<td>' + cp.priority + '</td>' +
              '<td class="cp-text">' + cp.text + '</td>' +
              cpHtml +
              
          '</tr>'
    );
    
    
    $(vmtRoom + ' tr').eq(1).effect("highlight", { color: room.highlight.colors[cp.priority] }, 10000);

    checkForUpdateNumOfCP(roomID, cp.trigger);
    checkForUpdateColorOfCP(roomID, cp.trigger);

    handleLongCPText($(vmtRoom + ' tr:eq(1) > td.cp-text'));
    console.log($(vmtRoom).get(0));
    fitTableToKRows($(vmtRoom).get(0), 16)

    //add to summary table
    
    $('#summary-table  table tr:first').after(
        '<tr class=' + trClass + ' data-status="unseen" data-roomid=' + cp.dup_roomID + ' data-priority=' + cp.priority + '>' +
            '<td class=' + hideClass + '> <i class="cp-skip icon-android-done"></i> </td>' +
            timeHtml +
            roomHtml +
            triggerHtml +
            //'<td>' + cp.user + '</td>' +
            //'<td>' + cp.type + '</td>' +
            //'<td>' + cp.priority + '</td>' +
            '<td class="cp-text">' + cp.text + '</td>' +
            cpHtml +
        '</tr>'
    );


    $('#summary-table tr:eq(1)').effect("highlight", { color: "#f1ff10" }, 10000);

    handleLongCPText($('#summary-table tr:eq(1) > td.cp-text'));

    //limit table size to k rows
    fitTableToKRows($('#summary-table table').get(0), 6)

    //show notification
    showCPNotification(roomID, cp.text, cp.priority, trClass.substring(2, trClass.length));
};

/* Copied Heler Functions */
function checkForUpdateNumOfCP(roomID, type) {
    var mainDiv = $('#vmt-room-' + roomID + ' div.' + type);
    var unseen = mainDiv.find('tr[data-status="unseen"]');
    var seen = mainDiv.find('tr[data-status="seen"]');

    updateNumOfCP(roomID, type, unseen.length, unseen.length + seen.length);
}

function checkForUpdateColorOfCP(roomID, type) {
    var rows = $('#vmt-room-' + roomID + ' div.' + type + ' tr[data-status="unseen"][data-priority]');
    var min = 99;
    for (var i = 0; i < rows.length; i++) {
        var val = rows[i].getAttribute('data-priority');
        if (val < min) min = val;
    }

    UpdateColorOfCP(roomID, type, min);
}

function updateNumOfCP(roomID, type, unSeen, total) {
    var bar = $('#vmt-room-' + roomID + '-num-cp-' + type);
    var barTop = $('#vmt-room-' + roomID + '-top-num-cp-' + type);

    var barFirst = bar.find('.first-value');
    var barSecond = bar.find('.second-value');
    if (barFirst.text() == unSeen && barSecond.text() == total) return;   //if nothing is new return

    barFirst.text(unSeen);
    barSecond.text(total);
    barTop.find('.first-value').text(unSeen);
    barTop.find('.second-value').text(total);

    bar.effect("highlight", { color: '#5cb85c' }, 3000, function () { $(this).clearQueue(); });
    barTop.closest('span.badge').effect("highlight", { color: '#5cb85c' }, 3000, function () { $(this).clearQueue(); });
}

function checkForUpdateColorOfCP(roomID, type) {
    var rows = $('#vmt-room-' + roomID + ' div.' + type + ' tr[data-status="unseen"][data-priority]');
    var min = 99;
    for (var i = 0; i < rows.length; i++) {
        var val = rows[i].getAttribute('data-priority');
        if (val < min) min = val;
    }

    UpdateColorOfCP(roomID, type, min);
}

function UpdateColorOfCP(roomID, type, val) {
    var bar = $('#collapse-' + roomID + ' div.head-' + type + ' > div[data-priority]');
    bar.attr('data-priority', val);
    updateTopToolBarPriority(roomID);
}

function updateTopToolBarPriority(roomID) {
    var priorities = $('#collapse-' + roomID).find('div.panel-heading[data-priority]')
                                             .map(function () {
                                                 return $(this).attr('data-priority');
                                             }).get();
    var priority = priorities[0] < priorities[1] ? priorities[0] : priorities[1];
    $('#vmt-room-' + roomID + ' > div[data-priority]').attr('data-priority', priority);
}
