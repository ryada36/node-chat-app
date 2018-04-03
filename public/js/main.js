var socket=io();

function scrollToBottom () {
  // Selectors
  var messages = jQuery('#chatbox');
  var newMessage = messages.children('li:last-child')
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}


socket.on('connect',function(){
    var params = jQuery.deparam(window.location.search);
    socket.emit('join', params, function (err) {
        if (err) {
        alert(err);
        window.location.href = '/';
        } else {
        console.log('No error');
        }
    });
});
socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {
  var ol = $('<ol></ol>');

  users.forEach(function (user) {
    ol.append($('<li></li>').text(user));
  });

  $('#users').html(ol);
});

socket.on('new-message',function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = $('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#chatbox').append(html);
    scrollToBottom();
});

socket.on('new-location',function(data){
    var formattedTime=moment(data.createdAt).format('h :mm a');
    var template=$('#location-message-template').html();
    var html = Mustache.render(template, {
        from: data.from,
        url: data.url,
        createdAt: formattedTime
    });
    $('#chatbox').append(html);
    scrollToBottom();
})

$('#send').on('click',function(event){
    event.preventDefault();
    var message=$('#message');
    if(!message.val())
        return alert('please enter some message');
    socket.emit('send-message',{
        from:message.from,
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
            lat,
            lng
        });
        that.removeAttr('disabled');
    },function(){
        that.removeAttr('disabled');
        alert('Unable to fetch location.');
    })
})