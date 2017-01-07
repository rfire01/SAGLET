var room = {};
var detailsHub;
room.onlineHtml = '<span class="label label-success">Online</span>';
room.offlineHtml = '<span class="label label-danger">Offline</span>';
room.colors = ['#3366CC', '#DC3912', '#FF9900', '#109618', '#990099', '#3B3EAC', '#0099C6', '#DD4477', '#66AA00', '#B82E2E', '#316395', '#994499', '#22AA99', '#AAAA11', '#6633CC', '#E67300', '#8B0707', '#329262', '#5574A6', '#3B3EAC'];
room.highlight = {
    colors: {
        1: "#ff9980",
        2: "#ffff66"
    }
}

//timer
$('#rooms-toolbar').before('<div id="countdowntimer"><span id="hm_timer"><span></div>');




//dropdown list
$('#tabs-live').change(function (e) {
    var id = 'live-tab-' + $(this).find("option:selected").text();
    $('<a href="#' + id + '"/a>').tab('show');
});

//dropdown history
$('#tabs-history').change(function (e) {
    var id = 'history-tab-' + $(this).find("option:selected").text();
    $('<a href="#' + id + '"/a>').tab('show');
});

$(function () {
    clipTdAndAddTitle();
    registerCPFeedback();   
    detailsHub = $.connection.roomDetailsHub;

    /* LIVE CHAT */
    detailsHub.client.updateRoomMsgLive = function (roomID, msg) {
        console.info('updateRoomMsgLive: ' + roomID);
        if (room.id != roomID) return;

        var sentiment = room.settings.sentiment ? msg.sentiment : '-';

        $('#chat-live').append(
            '<tr id="row-msg-' + msg.id + '">' +
                '<td>' + msg.timestamp + '</td>' +
                '<td>' + msg.user + '</td>' +
                '<td>' + sentiment + '</td>' +
                '<td>' + msg.text + '</td>' +
                '<td class="types"></td>' +
                '<td><button type="button" class="btn btn-primary btn btn-cpm-set" data-msgID="' + msg.id + '" data-roomID="' + roomID + '">Set</button></td>' +
            '</tr>'
        );

        $('#live-row-msg-' + msg.id).effect("highlight", { color: 'lightblue' }, 3000);
    };

    /* LIVE ACTION */
    detailsHub.client.updateRoomActionLive = function (roomID, tabID, act) {
        console.info('updateRoomActionLive: ' + roomID);
        if (room.id != roomID) return;

        $('#action-live-tab-' + tabID).append(
        '<tr id="' + act.id + '">' +
            '<td>' + act.timestamp + '</td>' +
            '<td>' + act.user + '</td>' +
            '<td>' + act.text + '</td>' +
        '</tr>'
        );

        $('#action-live-tab-' + tabID + ' #' + act.id).effect("highlight", { color: 'lightblue' }, 3000);
    };

    /* LIVE Atmosphere Gauge */
    detailsHub.client.updateAtmosphere = function (roomID, avg) {
        console.info('updateAtmosphere: ' + roomID);
        console.log(avg);
        if (room.id != roomID || !room.settings.sentiment) return;
        room.updateAtmosphere(avg);
    };

    /* LIVE STR Gauge */
    detailsHub.client.updateStr = function (roomID, str) {
        console.info('updateStr: ' + roomID);
        console.log(str);
        if (room.id != roomID) return;
        room.updateStr(str);
    };

    /* LIVE Wordle */
    detailsHub.client.updateWordle = function(roomID, msgs) {
        console.info('updateWordle: ' + roomID);
        if (room.id != roomID) return;
        var arr = [], i = 0;
        $.each(msgs, function (key, value) {
            arr[i] = [];
            arr[i][0] = key;
            arr[i][1] = value * 20;
            i++
        });
        console.log(arr);

        WordCloud(document.getElementById('wordle-canvas'), { list: arr });
    };

    /* LIVE Add new CP - Graph View */
    detailsHub.client.updateNewCPGraph = function (roomID, cp) {
        console.info('updateNewCPGraph: ' + roomID);
        if (room.id != roomID || cp.trigger == 'act' && !room.settings.cpa) return;

        var likeHtml = '<i class="cp-like icon-like"></i> <i class="cp-unlike icon-unlike"></i>';
        var trClass = String.format('cp-{0}-{1}-{2}-{3}', cp.trigger, cp.roomID, cp.id, cp.cpLabel);

        // add to _Graph
        $('#graph-critical-points #critical-points-table tr:first').after(
            '<tr class=' + trClass + '>' +
                '<td>' + cp.timestamp + '</td>' +
                '<td> <i class="icon-' + cp.triggerIcon + '"></i> </td>' +
                '<td>' + cp.user + '</td>' +
                '<td>' + cp.text + '</td>' +
                '<td>' + cp.type + '</td>' +
                '<td>' + cp.priority + '</td>' +
                '<td>' + likeHtml + '</td>' +
            '</tr>'
        );
        $('#graph-critical-points #critical-points-table').children('tr').eq(1).effect("highlight", { color: room.highlight.colors[cp.priority] }, 3000);
    };

    /* LIVE Add new CP - VMTToolbar View */
    detailsHub.client.updateNewCPToolBar = function (roomID, cp) {
        console.info('updateNewCPToolBar: ' + roomID);
        if (cp.trigger == 'act' && !room.settings.cpa) return;

        var cpHtml = '<i class="cp-like icon-like"></i> <i class="cp-unlike icon-unlike"></i>';
        var trClass = String.format('cp-{0}-{1}-{2}-{3}', cp.trigger, cp.roomID, cp.id, cp.cpLabel);

        //hide reviewd?
        var hideClass = room.settings.reviewed ? '' : 'hidden';
        var roomHtml = room.settings.listRoomID ? '<td>' + cp.roomID + ' </td>' : '';
        var triggerHtml = room.settings.listTrigger ? '<td> <i class="cp-goto icon-' + cp.triggerIcon + '"></i> </td>' : '';
        var timeHtml = room.settings.listTime ? '<td>' + cp.timestamp + '</td>' : '';

        // add to _VMT toolbox
        var vmtRoom = String.format('#rooms-toolbar #vmt-room-{0} .{1} table', roomID, cp.trigger);

        $(vmtRoom + ' tr:first').after(
            '<tr class=' + trClass + ' data-status="unseen" data-roomid=' + cp.dup_roomID + ' data-priority=' + cp.priority + '>' +
                '<td class=' + hideClass + '> <i class="cp-skip icon-android-done"></i> </td>' +
                timeHtml +
                triggerHtml +
                //'<td>' + cp.user + '</td>' +
                //'<td>' + cp.type + '</td>' +
                //'<td>' + cp.priority + '</td>' +
                '<td class="cp-text">' + cp.text + '</td>' +
                '<td>' + cpHtml + '</td>' +
            '</tr>'
        );

        $(vmtRoom + ' tr').eq(1).effect("highlight", { color: room.highlight.colors[cp.priority] }, 3000);

        checkForUpdateNumOfCP(roomID, cp.trigger);
        checkForUpdateColorOfCP(roomID, cp.trigger);

        handleLongCPText($(vmtRoom + ' tr:eq(1) > td.cp-text'));

        registerCPFeedback();

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
                '<td>' + cpHtml + '</td>' +
            '</tr>'
        );

        $('#summary-table tr:eq(1)').effect("highlight", { color: room.highlight.colors[cp.priority] }, 10000);

        handleLongCPText($('#summary-table tr:eq(1) > td.cp-text'));

        //show notification
        showCPNotification(roomID, cp.text, cp.priority, trClass.substring(2, trClass.length));
    };
    
    /* Live Update CP */
    detailsHub.client.updateLike = function (roomID, type, idOne, idTwo, idLabel, likeStr) {
        console.info('updateLike: ' + roomID);

        var trClass = String.format('.cp-{0}-{1}-{2}-{3}', type, idTwo, idOne, idLabel);
        var tr = $(trClass).attr('data-status', 'unseen');
        tr.find('i.selected').removeClass('selected');      //remove old selected
        tr.find('.cp-' + likeStr).addClass('selected');     //update selected
    }

    /* LIVE Remove CP - Graph View */
    detailsHub.client.updateRemovedCPGraph = function (roomID, cp) {
        console.info('updateRemovedCPGraph: ' + roomID);
        if (room.id != roomID) return;

        var trClass = String.format('cp-{0}-{1}-{2}-{3}', cp.trigger, cp.roomID, cp.id, cp.cpLabel);

        // remove from _Graph
        $('#graph-critical-points #critical-points-table tr').remove('.' + trClass);
    };

    /* LIVE Remove CP - VMTToolbar View */
    detailsHub.client.updateRemovedCPToolBar = function (roomID, cp) {
        console.info('updateRemovedCPToolBar: ' + roomID);

        var trClass = String.format('cp-{0}-{1}-{2}-{3}', cp.trigger, cp.roomID, cp.id, cp.cpLabel);

        // remove from _VMT toolbox
        var vmtRoom = String.format('#rooms-toolbar #vmt-room-{0} .{1} table', roomID, cp.trigger);
        $(vmtRoom + ' tr').remove('.' + trClass);

        // update panels
        checkForUpdateNumOfCP(roomID, cp.trigger);
        checkForUpdateColorOfCP(roomID, cp.trigger);
    };

    /* LIVE update users - Graph View*/
    detailsHub.client.updateRoomUserGraph = function (roomID, userData) {
        console.info('updateRoomUserGraph: ' + roomID);
        //console.log(userData);
        if (room.id != roomID) return;

        // check if user exists - if it does -> replace html, if not append
        var JqueryUser = $('#users #user-' + userData.user.toLowerCase());
        if (JqueryUser.length != 0) {
            var userHtml = getUserDataGraphHTML(userData, roomID);
            JqueryUser.replaceWith(userHtml);
        }
        else {
            appendUserToGraph(roomID, userData);
        }

        $('#users #user-' + userData.user.toLowerCase()).effect("highlight", { color: 'lightblue' }, 3000);
    };

    /* LIVE update users - VMToolbar View */
    detailsHub.client.UpdateRoomUserToolBar = function (roomID, userData) {
        //console.info('UpdateRoomUserToolBar: ' + roomID);
        //console.log(userData);

        // check if user exists - if it does -> replace html, if not append
        var JqueryUser = $('#toolbar-' + roomID + '-user-' + userData.user.toLowerCase());
        if (JqueryUser.length == 0) {
            appendUserToVmtToolbar(roomID, userData);
        }
        else if (room.demo.usersUpdate) {
            var userHtml = getUserDataToolBarHTML(userData, roomID);
            JqueryUser.replaceWith(userHtml);
        }
        else { return } //users are already updated once, and usersUpdate is disabled -> therefore don't update in panel

        checkForUpdateNumOfConnectedUsers(roomID);

        $('#toolbar-' + roomID + '-user-' + userData.user.toLowerCase()).effect("highlight", { color: 'lightblue' }, 3000);
    };

    /* ONLOAD update users - Graph View */
    detailsHub.client.updateUsersGraphOnLoad = function (roomID, userData) {
        console.info('updateUsersGraphOnLoad: ' + roomID);
        console.log(userData);
        if (room.id != roomID) return;

        // add new users Graph Page
        $.each(userData, function (key, value) {
            appendUserToGraph(roomID, value);
        });

    }; 

    /* ONLOAD update users - VMTToolbar View */
    detailsHub.client.updateUsersToolBarOnLoad = function (roomID, userData) {
        console.info('updateUsersToolBarOnLoad: ' + roomID);
        console.log(userData);

        room[roomID] = { 'dataMsgs': [['User', '#Messages']], 'dataActs': [['User', '#Actions']] };

        // add new users VMT Page
        var ctrOnline = 0;
        $.each(userData, function (key, value) {
            if (value.isOnline) { ctrOnline++; }
            room[roomID].dataMsgs.push([value.user, value.msgs]);
            room[roomID].dataActs.push([value.user, value.actions]);
            appendUserToVmtToolbar(roomID, value)
        });

        updateNumOfConnectedUsers(roomID, ctrOnline, userData.length);
        updateTopToolBarPriority(roomID);
    };

    /* Live update users graphs & draw graph- VMTToolbar View */
    detailsHub.client.updateUsersGraphToolBar = function (roomID, userData) {
        console.info('UpdateUsersGraphToolBar: ' + roomID);
        console.log(userData);

        var exists = false;

        // find user in dataMsgs and update msgs value and same for actions
        $.each(room[roomID].dataMsgs, function (key, value) {
            if (value[0] == userData.user.toLowerCase()) {
                value[1] = userData.msgs;
                exists = true;
            }
        });
        $.each(room[roomID].dataActs, function (key, value) {
            if (value[0] == userData.user.toLowerCase()) {
                value[1] = userData.actions;
            }
        });

        if (!exists) {
            room[roomID].dataMsgs.push([userData.user.toLowerCase(), userData.msgs]);
            room[roomID].dataActs.push([userData.user.toLowerCase(), userData.actions]);
        }

        drawVmtRoomToolbarUsersGraph(roomID);
    };
    
    /* LIVE update users on leave\join - BOTH Views */
    detailsHub.client.updateUserList = function (roomID, userList) {
        console.info('updateUserList: ' + roomID);
        console.log(userList);

        $.each(userList, function (key, value) {
            console.info('username: ' + value);
        });
    };

    /* HELPER methods*/
    function getUserDataGraphHTML(userData) {
        var type = "danger";
        var icon = "icon-user-circle";
        var status = room.offlineHtml;
        if (userData.isMod) icon = "icon-graduation-cap";
        if (userData.sentiment > 40 && userData.sentiment < 60) { type = "warning" }
        else if (userData.sentiment > 60) { type = "success" }
        if (userData.isOnline) status = room.onlineHtml;

        var prograssBarHtml = 
                    '<div class="progress">' +
                        '<div class="progress-bar progress-bar-' + type + '" role="progressbar" aria-valuenow="' + userData.sentiment + '" aria-valuemin="0" aria-valuemax="100" style="width:' + userData.sentiment +'%">' +userData.sentiment + '%</div>' +
                    '</div>';
        var prograssBar = room.settings.sentiment ? prograssBarHtml : '';
        
        var userHtml =
            '<li class="list-group-item clearfix" id="user-' + userData.user.toLowerCase() + '">' +
                '<div class="list-group-item-heading">' +
                    '<span class="' + icon + '">' + userData.user + ' </span> ' +
                    '<span class="label user-label">' + status + '</span>' +
                    '<span class="badge">' + userData.actions + '</span>' +
                    '<span class="badge">' + userData.msgs + '</span>' +
                    '<hr>' +
                    prograssBar +
                '</div>' +
            '</li>';
        return userHtml;
    }

    function getUserDataToolBarHTML(userData, roomID) {
        var type = "danger";
        var icon = "icon-user-circle";
        var toolTipTitle = 'Student';
        var status = room.offlineHtml;
        var colSize = 12 / parseInt(room.settings.usersPerLine);

        if (userData.isMod) {
            icon = "icon-graduation-cap";
            toolTipTitle = 'Moderator';
        }
        if (userData.sentiment > 40 && userData.sentiment < 60) { type = "warning" }
        else if (userData.sentiment > 60) { type = "success" }
        if (userData.isOnline) status = room.onlineHtml;
        if (userData.isOnline == null) status = '';
        
        var prograssBarHtml =
                    '<div class="progress">' +
                        '<div class="progress-bar progress-bar-' + type + '" role="progressbar" aria-valuenow="' + userData.sentiment + '" aria-valuemin="0" aria-valuemax="100" style="width:' + userData.sentiment + '%">' + userData.sentiment + '%</div>' +
                    '</div>';
        var prograssBar = room.settings.sentiment ? prograssBarHtml : '';

        var userHtml =
            '<li class="list-group-item col-xs-' + colSize + ' user-bar" id="toolbar-' + roomID + '-user-' + userData.user.toLowerCase() + '">' +
                '<div class="user-left-bar"></div>' +
                '<div class="list-group-item-heading user-right-bar">' +

                    '<span data-toggle="tooltip" title="' + toolTipTitle + '" data-placement="top" class="' + icon + '">' + userData.user.toLowerCase() + ' </span> ' +
                    '<span class="label user-label">' + status + '</span>' +
                    prograssBar +
                '</div>' +
            '</li>';
        return userHtml;
    }

    function registerCPFeedback() {
        $('i.cp-like').off().click(function () {
            args = $(this).closest('tr').attr('class').split('-');
            var type = args[1], idOne = args[3], idTwo = args[2], label = args[4];
            detailsHub.server.updateLike(idOne, idTwo, type, label, 'like');
            console.log('like -> ' +args);
        });
        $('i.cp-unlike').off().click(function () {
            args = $(this).closest('tr').attr('class').split('-');
            var type = args[1], idOne = args[3], idTwo = args[2], label = args[4];
            detailsHub.server.updateLike(idOne, idTwo, type, label, 'unlike');
            console.log('unlike -> ' +args);
        });
        $('i.cp-skip').off().click(function () {
            var row = $(this).closest('tr');
            var args = row.attr('class').split('-');
            var roomID = row.attr('data-roomid'), type = args[1];
            var deltaUnSeen = 0;
            // if seen -> toggle to unseen, unselect, +1 unseen
            if (row.attr('data-status') == 'seen'){
                $(this).removeClass('selected');
                row.attr('data-status', 'unseen');
                deltaUnSeen = 1;
                // change icon
                $(this).removeClass('icon-android-done-all').addClass('icon-android-done');
            }
            else{
                $(this).addClass('selected');
                row.attr('data-status', 'seen');
                deltaUnSeen = -1;
                // change icon
                $(this).removeClass('icon-android-done').addClass('icon-android-done-all');
            }
         
            checkForUpdateNumOfCP(roomID, type);
            checkForUpdateColorOfCP(roomID, type);
            console.log('skip -> ' + $(this));
        });
        $('i.cp-goto').off().click(function () {
            var row = $(this).closest('tr');
            var args = row.attr('class').split('-');
            var roomID = row.attr('data-roomid');
            var user = room.user;
            var type = args[1], idOne = args[3], idTwo = args[2];
            var msgID = idOne;

            if (type == 'act') {
                type = 'action';
                msgID = 'tab' + idTwo + 'e' + idOne;
            }
            if (type == 'msg') { type = 'chat'; }

            // click
            $('#vmt-frame-link-' + roomID).trigger('click');

            highlight(roomID, user, msgID, type);
        });
    }

    function appendUserToVmtToolbar(roomID, userData) {
        var userHtml = getUserDataToolBarHTML(userData, roomID);
        $('#vmt-toolbar-users-' + roomID + ' ul.list-group').append(userHtml).find('[data-toggle="tooltip"]').tooltip();
    }

    function appendUserToGraph(roomID, userData) {
        var userHtml = getUserDataGraphHTML(userData);
        $('#users ul.list-group').append(userHtml);
    }

    function drawVmtRoomToolbarUsersGraph(roomID) {
        var vis = $('#vmt-room-' + roomID + ' .users').is(":visible");
        if (vis) {

            var vmtUsersToolbar = $('#vmt-toolbar-users-' + roomID + ' ul.list-group');

            // draw
            room.drawPieChart('toolbar-' + roomID + '-msgs-pie', room[roomID].dataMsgs, 'Messages');
            if(room.settings.displayActionGraph)room.drawPieChart('toolbar-' + roomID + '-acions-pie', room[roomID].dataActs, 'Actions');
            console.info('drawVmtRoomToolbarUsersGraph room: ' + roomID + ' is visible and updated');
        }
        else { console.info('drawVmtRoomToolbarUsersGraph room: ' + roomID + ' is NOT visible'); }
    }

    function fillCPModalSelectList(options) {
        var select = document.getElementById('cpm-modal-cp-types');
        var i = select.options.length;
        for (; i < options.length; i++) {
            var opt = document.createElement('option');
            opt.innerHTML = options[i];
            opt.value = options[i];
            select.appendChild(opt);
        }
    }

    function getCPHtmlString(type, priority) {
        var lblClass = "label-danger";
        if (priority == "2") { lblClass = "label-warning"; }
        return '<span class="label ' + lblClass + '">' + type + '</span>';
    }

    /* VMT Toolbar Numbers Updates*/
    function updateNumOfConnectedUsers(roomID, online, total) {
        var bar = $('#vmt-room-' + roomID + '-num-users');
        var barTop = $('#vmt-room-' + roomID + '-top-num-users');

        var barFirst = bar.find('.first-value');
        var barSecond = bar.find('.second-value');
        if (barFirst.text() == online && barSecond.text() == total) return;   //if nothing is new return

        barFirst.text(online);
        barSecond.text(total);
        barTop.find('.first-value').text(online);
        barTop.find('.second-value').text(total);

        bar.effect("highlight", { color: '#5cb85c' }, 3000, function () { $(this).clearQueue(); });
        barTop.closest('span.badge').effect("highlight", { color: '#5cb85c' }, 3000, function () { $(this).clearQueue(); });
    }

    function checkForUpdateNumOfConnectedUsers(roomID) {
        var users = $('#vmt-toolbar-users-' + roomID + ' li.user-bar');
        var userOnline = users.find('.label-success');
        updateNumOfConnectedUsers(roomID, userOnline.length, users.length);
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
        barTop.closest('span.badge').effect("highlight", { color: '#5cb85c' }, 3000, function(){$(this).clearQueue();});
    }

    function checkForUpdateNumOfCP(roomID, type) {
        var mainDiv = $('#vmt-room-' + roomID + ' div.' + type);
        var unseen = mainDiv.find('tr[data-status="unseen"]');
        var seen = mainDiv.find('tr[data-status="seen"]');

        updateNumOfCP(roomID, type, unseen.length, unseen.length + seen.length);
    }

    /* VMT Toolbar Colors Updates*/
    function updateTopToolBarPriority(roomID) {
        var priorities = $('#collapse-' + roomID).find('div.panel-heading[data-priority]')
                                                 .map(function () {
                                                     return $(this).attr('data-priority');
                                                 }).get();
        var priority = priorities[0] < priorities[1] ? priorities[0] : priorities[1];
        $('#vmt-room-' + roomID + ' > div[data-priority]').attr('data-priority', priority);
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
        var bar = $('#collapse-' + roomID + ' div.head-' +type + ' > div[data-priority]');
        bar.attr('data-priority', val);
        updateTopToolBarPriority(roomID);
    }

    /* CPM Injection */
    /* Load CPM modal panel - reset values and send request to server to retrieve current CP information*/
    $(document).on('click', '.btn-cpm-set', function () {
        var msgID = this.getAttribute('data-msgID');
        var roomID = this.getAttribute('data-roomID');
        // Load modal
        $("#cpmModal").modal();
        // Reset text, table & select box values 
        $("#cpm-modal-roomID").text('');
        $("#cpm-modal-msgID").text('');
        $("#cpm-modal-timestamp").text('');
        $("#cpm-modal-username").text('');
        $("#cpm-modal-text").text('');
        $("#cpm-modal-active-cpm table tr").not(':first').not(':last').remove();
        $('#cpm-modal-cp-types').prop('selectedIndex', 0);
        $('#cpm-modal-cp-priority').prop('selectedIndex', 0);

        // Retrive data from server & Show on client side
        detailsHub.server.loadCpmModal(roomID, msgID);
    });

    /* CPM Injection - Update Cpm Data after retreving old CP data from server*/
    detailsHub.client.updateCpmData = function (roomID, msg, cpms, cpEnums) {
        console.info('updateCpmData: ' + roomID + ' | ' + msg + ', CPMS: [' + cpms + ']');
        if (room.id != roomID) return;

        $("#cpm-modal-roomID").text(roomID);
        $("#cpm-modal-msgID").text(msg.ID);       
        $("#cpm-modal-timestamp").text(msg.TimeStamp);
        $("#cpm-modal-username").text(msg.UserID);
        $("#cpm-modal-text").text(msg.Text);
        

        var tblRows = "";
        for (var i = 0; i < cpms.length; i++) {
            var type = cpms[i].Type;
            tblRows +=
                '<tr data-type=' + cpEnums[type] + '>' +
                    '<td>' + (i + 1) + '</td>' +
                    '<td>' + cpEnums[type] + '</td>' +
                    '<td>' + cpms[i].Priority + '</td>' +
                    '<td><i class="icon-trashcan cpm-modal-remove-cp" data-toggle="tooltip" data-placement="top" title="Remove"></i></td>' +
                '</tr>';
        }

        $("#cpm-modal-active-cpm table tr:last").before(tblRows);

        fillCPModalSelectList(cpEnums);
    }

    /* Inject New CP - send request to server to add a new cpm */
    $("#cpm-modal-add-cp").click(function () {
        var roomID = $('#cpm-modal-roomID').text();
        var msgID = $('#cpm-modal-msgID').text();
        var type = $('#cpm-modal-cp-types').val();
        var priority = $('#cpm-modal-cp-priority').val();
        
        detailsHub.server.injectCPM('add', roomID, msgID, type, priority);
    });

    /* Remove CP Injection- send request to server to remove a cpm injection */
    $(document).on('click', '.cpm-modal-remove-cp', function () {
        var roomID = $('#cpm-modal-roomID').text();
        var msgID = $('#cpm-modal-msgID').text();
        var type = $(this).closest('tr').attr('data-type');

        detailsHub.server.injectCPM('remove', roomID, msgID, type, null);
    });

    /* Update CP Modal after getting response from server that the requested injection was added successfully to the DB*/
    detailsHub.client.updateCPModal = function (roomID, msgID, action, type, priority) {
        console.info('updateCPModal: ' + roomID + ' | ' + msgID + ', action:' + action + ', type:' + type + 'priority:' + priority);
        var _msgID = $('#cpm-modal-msgID').text();
        if (room.id != roomID || _msgID != msgID) return;

        var tbl = $('#cpm-modal-active-cpm table');

        switch (action) {
            case "add":
                var i = tbl.find('tr').length - 1;

                var row = '<tr data-type=' + type + '>' +
                            '<td>' + i + '</td>' +
                            '<td>' + type + '</td>' +
                            '<td>' + priority + '</td>' +
                            '<td><i class="icon-trashcan cpm-modal-remove-cp" data-toggle="tooltip" data-placement="top" title="Remove"></i></td>' +
                        '</tr>';

                $("#cpm-modal-active-cpm table tr:last").before(row);
                break;
            case "remove":
                tbl.find('tr').remove('tr[data-type=' + type + ']');
                break;
        }


    };

    /* Update CP Labels after changing cp injections*/
    detailsHub.client.updateCPOutSiteModal = function (roomID, msgID, cpData) {
        console.info('updateCPOutSiteModal: ' + roomID + ' | ' + msgID + ', types:' + cpData);
        if (room.id != roomID) return;

        var iconString = '';

        var row = $('#row-msg-' + msgID);
        var cell = row.find('.types').html('');
        var lbls = '';

        $.each(cpData, function (key, value) {
            lbls += getCPHtmlString(key, value) + '\n';            
        });

        cell.html(lbls);

        row.effect("highlight", { color: 'green' }, 3000);
    };
    

    /* Hub Related*/
    detailsHub.client.registeredComplete = function (res) {
        console.info(res);
    };

    detailsHub.client.updateCompleted = function (res) {
        console.info(res);
    };

    detailsHub.client.updateFailed = function (res) {
        console.info(res);
    };

    var tryingToReconnect = false;

    $.connection.hub.reconnecting(function () {
        tryingToReconnect = true;
        room.reconnecting();
    });
    
    $.connection.hub.reconnected(function () {
        tryingToReconnect = false;
        room.connected();
    });

    $.connection.hub.disconnected(function () {
        if (tryingToReconnect) {

        }
        room.disconnected();
    });

    $.connection.hub.logging = true;
    /* Hub Start */
    $.connection.hub.start().done(function () {
        console.info("hub started");
        if (!room.settings.demo) {
            room.initDrawRoomGauges();
            detailsHub.server.joinGroup(room.id);
        }      
        console.info("joined room: " + room.id);
        console.info("test here");
        initRooms();
        registerEvents();
        room.connected();
    });

    /* UI functions */

    // toggle live\history data
    $('#settings-data-source-toggle').change(function () {
        $(".container-graphs li.header").toggleClass("blue-color");
        $(".container-graphs li.header").toggleClass("grey-color");
    });

    // toggle +- icons
    function togglePlusMinus(e) {
        $(e.target)
            .prev('.panel-heading')
            .find('span.icon-plus-square, span.icon-minus-square-1')
            .toggleClass('icon-plus-square icon-minus-square-1');
    }

    $('#room-panels').on('hidden.bs.collapse', togglePlusMinus);
    $('#room-panels').on('shown.bs.collapse', togglePlusMinus);

    
    // register plus button click event on users in vmt-toolbar
    function registerEvents() {
        $('#room-panels div[data-type="users"]').on('shown.bs.collapse', function (e) {
            var roomID = $(e.target).attr('data-roomid');
            drawVmtRoomToolbarUsersGraph(roomID);
            console.info('on users ' + roomID);
        });
        //$('#room-panels div[data-type="cpm"]').on('shown.bs.collapse', function (e) {
        //    var roomID = $(e.target).attr('data-roomid');
        //    window.setTimeout(function(){
        //        $('#vmt-room-' + roomID + ' div.msg tr[data-status="unseen"]').attr('data-status', 'seen');
        //    }, 1500);                                                                                                               
        //    console.info('on cpm ' + roomID);
        //});
    }

    room.connected = function () {
        $("#connection-status").removeClass('label-danger label-warning').text('Online').addClass('label-success');
    }

    room.reconnecting = function () {
        $("#connection-status").removeClass('label-success label-danger').text('Reconnecting').addClass('label-warning');
    }

    room.disconnected = function () {
        $("#connection-status").removeClass('label-success label-warning').text('Offline').addClass('label-danger');
    }

});

// Init

function initRooms() {
    // load iframes
    if (!room.settings.demo) {
        var iframes = $('#vmt-iframes-tabs iframe');
        $.each(iframes, function (key, value) {
            var id = $(value).attr('data-id');
            value.src = 'http://vmtdev.mathforum.org/#/rooms/' + id + '?autoload=true';
        });
    }
    // apply settings
    if (!room.settings.cpa) {
        $('.head-act').hide();
        $('span.badge.toolbar-badge.toolbar-cpa').hide();
    }
    if (!room.settings.reviewed) {
        $('.cp-skip').closest('td').hide();
        $('th.th-reviewed').hide();
    }
}

function clipTdAndAddTitle() {
    $("td.cp-text").each(function () {
        handleLongCPText(this);
    });
}

function handleLongCPText(td) {
    var val = $(td).text();
    if (val.length > 35) {
        $(td).attr("title", val);
        $(td).text(($(td).text().substr(0, 35) + "..."));
        $(td).css('cursor', 'pointer');
    }
}

function showCPNotification(roomID, text, priority, id) {
    var box = $("#notifications-box > ul");

    var li = box.prepend(
        '<li id="box-' + id + '" class="notification" data-priority=' + priority + ' data-roomID=' + roomID + '>' +
            '<span class="label label-default">Room ' + roomID + '</span>' +
            '<span>' + text + '</span>' +
        '</li>'
    );

    $('#box-' + id).effect("highlight", { color: room.highlight.colors[priority] }, 3000, function () {
        $(this).delay(7000).fadeOut();
    });
}



$(function () {
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": true,
        "progressBar": false,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "300",
        "timeOut": "1000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
});

$(document).on('click', '#summary-table table tr', function (e) {
    console.info(" *** Summary Table onClick ***");

    var roomID = $(this).attr('data-roomID');
    $(this).attr('data-status', 'seen');
    
    
    $('#vmt-frame-link-' + roomID).trigger('click');
   
    


   
   
});

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var target = $(e.target).attr("href") // activated tab
    
    var toastrMessage = "עברת לחדר מספר: " + target.substring(11,12)



    Command: toastr["info"](toastrMessage)

    

});


function fitTableToKRows(table, k) {
    var wrapper = table.parentNode;
    var rowsInTable = table.rows.length;
    var height = 0;
    if (rowsInTable > k) {
        for (var i = 0; i < k; i++) {
            height += table.rows[i].clientHeight;
        }
        wrapper.style.height = height + "px";
    }
}

$('#room-panels').on('shown.bs.collapse', fitRoomTableOnOpen);

// toggle +- icons
function fitRoomTableOnOpen(e) {
    var roomID = $(e.target).prev('.panel-heading').attr('data-target').split('-')[1];
    var table = $('#collapse-cpm-' + roomID + ' table');
    var vmtRoom = String.format('#vmt-room-{0} .{1} table', roomID, 'cpm');
    fitTableToKRows(table.get(0), 4);
}