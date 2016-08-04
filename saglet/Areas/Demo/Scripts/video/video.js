function startCommands() {
    for (var i = 0; i < room.commands.length; i++) {
        var cmd = room.commands[i];
        
        switch (cmd.classType) {
            case "CP":
                {
                    SetCPTimeOut(cmd.time, cmd.roomID, cmd.userID, cmd.type, cmd.priority, cmd.text);
                    break;
                }
            case "UsersUpdate":
                {
                    SetUsersUpdateTimeOut(cmd.time, cmd.roomID, cmd.msgCount);
                    break;
                }
            default: {
                console.error("bad command classType - " + cmd.classType);
            }
        }
    }

    // play videos
    for (var i = 0; i < room.videos.length; i++) {
        room.videos[i].play();
        //room.videos[i].onended = function endVideo() {
        //    room.videosEndedCtr++;
        //    if (room.videosEndedCtr == room.videos.length) { $('#btn-save').removeAttr('disabled'); }
        //};
    }
};

function SetCPTimeOut(time, roomID, userID, type, priority, text) {
    setTimeout(function () {
        HandleCPAddEvent(roomID, userID, type, priority, text);
    }, time * 1000);
}

function SetUsersUpdateTimeOut(time, roomID, msgCount) {
    setTimeout(function () {
        HandleUsersUpdateEvent(roomID, msgCount);
    }, time * 1000);
}

function initRoomsDemo(videos) {
    initRooms();
    for (var i = 0; i < videos.length; i++) {
        room[videos[i]] = { 'dataMsgs': [['User', '#Messages']], 'dataActs': [['User', '#Actions']] };
    }
    room['videos'] = document.getElementsByTagName('video');
    //room['videosEndedCtr'] = 0;

    // set demo conditions
    if (!room.demo.toolbar) {
        $('#rooms-toolbar').closest('div.col-md-4').hide().prev("div.col-md-8").toggleClass('col-md-8 col-md-9');
    }
    if (!room.demo.summaryTable) {
        $('#summary-table').hide();
    }
    if (!room.demo.popup) {
        $('#notifications-box').hide();
    }
    if (!room.demo.toolbarCp) {
        $('div.head-msg').hide();
        $('div.toolbar-badges').hide();
    }
}


