/**
 * Created by Noman on 2/28/15.
 */
module.exports = function(io, rooms){

    var chatrooms = io.of('/roomlist').on('connection', function(socket){
       console.log('Connection Established on the server!!!!')
        socket.emit('roomupdate', JSON.stringify(rooms));

        socket.on('newroom', function(data){
            rooms.push(data);
            socket.broadcast.emit('roomupdate', JSON.stringify(rooms));
            socket.emit('roomupdate', JSON.stringify(rooms));
        });

    });

    var messages = io.of('/messages').on('connection', function(socket){
        console.log('Connection Established on the server Message!!!!')
        socket.on('joinroom', function(data){
            socket.username = data.user;
            socket.username = data.profilePic;
            socket.join(data.room);
        });
    });


}
