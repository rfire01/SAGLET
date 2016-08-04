function highlight(roomID, username, msgID, type) {
    var conn = io('http://vmtdev.mathforum.org:80');
   
    conn.on('connect', function () {
        conn.emit("highlightChat", 'room' + roomID, username, msgID, type);
    });
}