require('../lib/removeByValue')();
module.exports = function(io){
    var userList = [];  // 사용자 리스트를 저장 할 공간.
    io.on('connection', function(socket){
        
        //passport의 req.user의 데이터에 접근한다.
        var session = socket.request.session.passport;
        var user = (typeof session !== 'undefined') ? (session.user) : "";

        socket.on('disconnect', function(){
            userList.removeByValue(user.displayName); // removeByValue를 Array의 prototype으로 설정하였기 때문에 사용 가능
            io.emit('leave', userList)
        })

        if(userList.indexOf(user.displayName)===-1){
            userList.push(user.displayName); //user의 displayName값이 없다면 push
        }
        io.emit('join', userList);

        socket.on('client message', function(data){
            io.emit('server message', {message:data.message, displayName:user.displayName});
        });
    });
}