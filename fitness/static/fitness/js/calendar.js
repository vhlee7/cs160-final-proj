var d = new Date();
var myStorage = window.localStorage;
var calendar;
var socket = new WebSocket(
    'ws://' + window.location.host + '/ws/fitness');

var userEvents = {
    events: [
        {
            title: 'work',
            start: '2021-08-09T09:00:00',
            end: '2021-08-09T17:00:00'
        },
        {
            title: 'work',
            start: '2021-08-10T09:00:00',
            end: '2021-08-10T15:00:00'
        },
        {
            title: 'work',
            start: '2021-08-11T09:00:00',
            end: '2021-08-11T12:00:00'
        },
        {
            title: 'errands',
            start: '2021-08-11T15:00:00',
            end: '2021-08-11T17:00:00'
        },
        {
            title: 'work',
            start: '2021-08-12T09:00:00',
            end: '2021-08-12T15:00:00'
        },
        {
            title: 'work',
            start: '2021-08-13T09:00:00',
            end: '2021-08-13T17:00:00'
        },
    ],
    id: "userSchedule",
    color: '#e4e4e4',
    textColor: 'black'
};

var userWorkouts = {
    events: [
        {
            title: 'arms',
            start: '2021-08-09T18:00:00',
            end: '2021-08-09T18:30:00'
        },
        {
            title: 'legs',
            start: '2021-08-10T16:00:00',
            end: '2021-08-10T17:00:00'
        },
        {
            title: 'abs',
            start: '2021-08-11T14:00:00',
            end: '2021-08-11T14:30:00'
        },
        {
            title: 'shoulders',
            start: '2021-08-12T16:00:00',
            end: '2021-08-12T17:00:00'
        },
        {
            title: 'legs',
            start: '2021-08-13T18:00:00',
            end: '2021-08-13T18:30:00'
        },
    ],
    id: "userWorkout",
    color: 'green',
    textColor: 'black'
};
function init() {
    $("#calendar-form").hide();
    closeForm();
}

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
            left: 'prev,next,import',
            center: 'title',
            right: 'timeGridWeek,timeGridDay'
        }, 
        customButtons: {
            import: {
                text: 'import schedule',
                click: function() {
                    alert('Schedule imported!');
                }
            }
        },
        eventSources: [
            userEvents
        ]
    });
    calendar.render();
    calendar.scrollToTime(d.getHours() + ':' + d.getMinutes());
});

function formatEvent(message) {
    return {
        title: message.title,
        start: message.date + "T" + message.start + ":00",
        end: message.date + "T" + message.end + ":00",
        eventColor: message.color
    };
}  

socket.onmessage = function(receivedMessage) {
    var received = JSON.parse(receivedMessage.data);
    console.log("Received: " + JSON.stringify(received));
}

socket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};

function generateWorkout() {
    var workouts = userWorkouts.events;
    for (let i = 0; i < workouts.length; i++) {
        calendar.addEvent(workouts[i]);
    }
}

function openForm() {
    $("#calendar-form").show();
    $('#formControl').click(closeForm);
    $('#formControl').text("Close the Form");
}

function closeForm() {
    $("#calendar-form").hide();
    $('#formControl').click(openForm);
    $('#formControl').text("Open the Form");
}

function sendForm() {
    var title = document.getElementById("eventName").value;
    var date = document.getElementById("date").value;
    var startTime = document.getElementById("startTime").value;
    var endTime = document.getElementById("endTime").value;

    var calendarParams = {
        title: title,
        date: date,
        start: startTime,
        end: endTime,
    };

    var event = formatEvent(calendarParams);
    calendar.addEvent(event);
}

function ok() {
    localStorage.setItem('key', "uwu2");
}
function ok2() {
    let a = localStorage.getItem('key');
    alert(a);
}


/*
function reqListener () {
    console.log(this.responseText);
}
function fetchWorkout() {
    var wgerUrl = 'https://wger.de/api/v2/exercise/';
    var xhr = new XMLHttpRequest();
    xhr.open("GET", wgerUrl, true);
    xhr.addEventListener("load", reqListener);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
}

fetchWorkout();

*/
