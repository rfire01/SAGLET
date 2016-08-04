/* Register Room */
// TODO add validation errors on bad input
$("#ID").blur(function () {
    if (!$(this).val() || $(this).val() < 1) {
        validRoomID(null);
        return;
    }
    $.ajax({
        url: 'http://vmtdev.mathforum.org/rooms/' + $(this).val(),
        type: "GET",
        dataType: 'json',
        data: {},
        dataType: "json",
        success: function (res) {
            console.info(res);
            validRoomID(res.room);
        },
        error: function () {
            validRoomID(null);
        }
    });
});

function validRoomID(res) {
    if (res) {
        $("#tabs").val(res.tabs.join());
        $('#tabs').css("border-color", "green");
        $("#mod").val(res.creator);
        $('#mod').css("border-color", "green");
        $("#roomName").val(res.roomName);
        $('#roomName').css("border-color", "green");
        $('#roomName').css("color", "");
        $("#description").val(res.description);
        $('#description').css("border-color", "green");
        $('input[type="submit"]').prop('disabled', false);
    }
    else {
        $("#tabs").val('');
        $('#tabs').css("border-color", "red");
        $("#mod").val('');
        $('#mod').css("border-color", "red");
        $("#roomName").val('Error: Invalid VMT room ID');
        $('#roomName').css("border-color", "red");
        $('#roomName').css("color", "red");
        $("#description").val('');
        $('#description').css("border-color", "red");
        $('input[type="submit"]').prop('disabled', true);
    }
}


/* Register User */
$("#VmtUserName").blur(function () {
    var vmtUserInput = $(this);
    if (!vmtUserInput.val()) {
        validUserID(false);
        return;
    }
    $.ajax({
        url: 'http://vmtdev.mathforum.org/users/',
        type: "GET",
        dataType: 'json',
        data: {},
        success: function (res) {
            console.info(res);
            var isExists = isUserExists(res.users, vmtUserInput.val().toLowerCase());
            validUserID(isExists);
        },
        error: function () {
            validUserID(false);
        }
    });
});

function isUserExists(list, user) {
    var exists = false;
    $.each(list, function (index, value) {
        console.log(value);
        if (user == value.username.toLowerCase()) {
            exists = true;
            return false;   //jquery break command
        } 
    });

    if (exists) {
        console.info(user + " exists!");
        return true;
    }   
    console.info(user + " doesn't exists!")
    return false;
}

function validUserID(isExists) {
    if (isExists) {
        $('#VmtUserName').css("border-color", "green");
        $('input[type="submit"]').prop('disabled', false);
    }
    else {
        $('#VmtUserName').css("border-color", "red");
        $('input[type="submit"]').prop('disabled', true);
    }
}