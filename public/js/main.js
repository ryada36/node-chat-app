var socket=io();
socket.on('connect',function(){
    console.log('connecting  to server');
});
socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('new-message',function(data){
    var htmlStr='<li>'+ data.from+ ' : '+data.text+'</li>'
    $('#chatbox').append(htmlStr);
});

socket.on('new-location',function(data){
    var htmlStr=$('<li></li>')
    var link=$('<a></a>')
    link.attr('href',data.url);
    link.attr('target','_blank');
    link.text('Current Location');
    htmlStr.text('User : ')
    htmlStr.append(link);
    $('#chatbox').append(htmlStr);
})

$('#send').on('click',function(event){
    event.preventDefault();
    var message=$('#message');
    if(!message.val())
        return alert('please enter some message');
    socket.emit('send-message',{
        from:'User',
        text:message.val()
    },function(){
        message.val('');
    });
})

$('#geolocation').on('click',function(event){
    event.preventDefault();
    var that=$(this);
    if(!navigator.geolocation)
        return alert('No Support for Geolocation');
    that.attr('disabled','disabled');
    navigator.geolocation.getCurrentPosition(function(data){
        var lat=data.coords.latitude;
        var lng=data.coords.longitude;
        socket.emit('send-location',{
            from:'user',
            lat,
            lng
        });
        that.removeAttr('disabled');
    },function(){
        that.removeAttr('disabled');
        alert('Unable to fetch location.');
    })
})