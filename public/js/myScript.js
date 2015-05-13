/**
 * Created by ricardomendes on 12/05/15.
 */
var socket = io.connect('127.0.0.1:8080');

var current_user ='';
socket.on('connect', function () {
    current_user = prompt("Nome?");
    socket.emit('adduser', current_user);
});

socket.on('updatechat', function (color, username, data) {
    if(username == current_user){
        $('#conversation').append('<div class="chat-box-left">' + data + '</div><div class="chat-box-name-left"><div style="width:40px;height:40px;border-radius:40px;color:#fff;text-align:center;background:'+color+';display:inline-block;"> ' + username[0]+username[username.length-1] + '</div><div style="display:inline-block;padding: 0px 5px;color:'+color+'">- ' + username + '</div></div><hr class="hr-clas">'); 
    } else{
        $('#conversation').append('<div class="chat-box-right">' + data + '</div><div class="chat-box-name-right"><div style="width:40px;height:40px;border-radius:40px;color:#fff;text-align:center;background:'+color+';display:inline-block;"> ' + username[0]+username[username.length-1] + '</div><div style="display:inline-block;padding: 0px 5px;color:'+color+'">- ' + username + '</div></div><hr class="hr-clas">'); 
    }
    $('#data').focus();
    $("#conversation").scrollTop($("#conversation")[0].scrollHeight);
    
});

socket.on('updaterooms', function (rooms, current_room) {
    $('#numChats').empty();
    $('#numChats').append("(" + rooms.length + ")");
    $('#listChats').empty();    
    $.each(rooms, function (key, value) {
        if (value == current_room) {
                $('#listChats').append('<a class="chat-box-online-left" href="#"><div style="width:40px;height:40px;border-radius:40px;color:#fff;text-align:center;background:#049e64;display:inline-block;"> <img class="img-circle" src="/images/room.png"></div><div style="display:inline-block;padding: 0px 5px;color:#049e64">- (' + value + ')</div>');            
        }
        else {
            $('#listChats').append('<a class="chat-box-online-left" href="#" onclick="switchRoom(\'' + value + '\')"><div style="width:40px;height:40px;border-radius:40px;color:#fff;text-align:center;background:#ff6a00;display:inline-block;"> <img class="img-circle" src="/images/room.png"></div><div style="display:inline-block;padding: 0px 5px;">- (' + value + ')</div></a>');            
        }
        $('#listChats').append('<hr class="hr-clas-low">');
    });
});

socket.on('updateNumOnline', function (numOnline, users) {
    $('#numUsers').empty();
    $('#numUsers').append("(" + numOnline + ")");
    $('#listUsers').empty();    
    $.each(users, function (key, value) { 
        $('#listUsers').append('<div class="chat-box-online-users-left"><div style="width:40px;height:40px;border-radius:40px;color:#fff;text-align:center;background:' + value + ';display:inline-block;"> ' + key[0]+key[key.length-1] + '</div><div style="display:inline-block;padding: 0px 5px;color:' + value + '">- ' + key + '</div></div><hr class="hr-clas-low">');
    });
});

function switchRoom(room) {
    socket.emit('switchRoom', room);
}

$(function () {
    $('#datasend').click(function () {
        var message = $('#data').val();
        $('#data').val('');
        socket.emit('sendchat', message);
    });

    $('#data').keypress(function (e) {
        if (e.which == 13) {
            $(this).blur();
            $('#datasend').focus().click();
        }
    });
});
