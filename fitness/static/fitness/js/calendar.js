var myStorage = window.localStorage;
var calendar;

document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        eventClick: function(info) {
            var eventObj = info.event;
            alert(eventObj.title);
        },
        timeZone: 'local',
        initialView: 'timeGridWeek',
        headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: 'timeGridWeek,timeGridDay'
        }, 
        events: [ ]
    });
    calendar.render();
});

function formatEvent(message) {
    return {
        title: "[" + message.schID + "] " + message.name + ' - '+ message.desc,
        start: message.date + "T" + message.start + ":00",
        end: message.date + "T" + message.end + ":00" 
    }
}  

function addEvent(event) {
    calendar.addEvent(event);
}

var socket = new WebSocket(
    'ws://' + window.location.host + '/ws/fitness');

socket.onmessage = function(receivedMessage) {
    var received = JSON.parse(receivedMessage.data);
    console.log("Received: " + JSON.stringify(received));

    console.log(received)
    if (received['to'] == 'display') {
        var event = formatEvent(received);
        console.log(JSON.stringify(event));
        addEvent(event);
    }
}

socket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};


function ok() {
    localStorage.setItem('key', "uwu2");
}
function ok2() {
    let a = localStorage.getItem('key');
    alert(a);
}
