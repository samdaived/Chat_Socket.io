
var socket = io();

socket.on('connect',function(){
    const param =$.deparam(window.location.search);

    socket.emit("newRoomUser",param,function(er){
         if(er){
             window.location.replace("/")
             alert(er)
         } else{
             console.log("no error");
         }
    })

});
    
socket.on("roomList",function(users){
    var ol =$("<ol></ol>");

    users.forEach(function(element) {
        ol.append($("<li class=' bg-light people'></li>").text(element))
    });
    
    $("#people").html(ol)
    
});

socket.on('disconnect',function(){
    console.log("server is disconnected");});


socket.on("NewMessage", function(message){
    var formatedTime = moment(message.createdAt).format('h:mm a');
    var Newmessage = $('<li></li>');
    var template = $('#message-template').html();
    var html = Mustache.render(template,{
        text:message.text,
        from:message.from,
        createdAt:formatedTime
    });
    Newmessage.append(html);
    $('#messgesOutput').append(Newmessage)});


$("#submitButton").on('click',function(){

    var message = $('[name=message]').val();
    socket.emit("createMessage",{text:message},function (){
        $('[name=message]').val("")
    })});


$('[name=message]').keypress(function(ev){
     const keycode = ev.keycode?ev.keycode:ev.which;
     if(keycode===13){
        var message = $('[name=message]').val();
        return socket.emit("createMessage",{from:"user", text:message},function (){
            $('[name=message]').val("")
        })}
    });


$("#location").on("click", function(){
    $('#location').attr("disabled", "disabled").text("Sending location");
    if(!navigator.geolocation){
        return alert("Sorry we can't acces your location")
    };
    navigator.geolocation.getCurrentPosition(function(position){
        socket.emit("sendUserLocation",{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },function(){
            $('#location').removeAttr("disabled").text("Send location");
        })
    },function(){
        alert("Some problem happened we can send you location")
    })
});

socket.on('locationMessage',function(message){
    var formatedTime = moment(message.createdAt).format('h:mm a');
    var Newmessage = $('<li></li>');
    var template = $('#location-message-template').html();
    var html = Mustache.render(template,{
        url:message.url,
        from:message.from,
        createdAt:formatedTime
    });
    Newmessage.append(html);
    $('#messgesOutput').append(Newmessage)
                        });