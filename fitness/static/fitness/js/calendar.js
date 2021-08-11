var d = new Date();
var myStorage = window.localStorage;
var calendar;
var socket = new WebSocket(
    'ws://' + window.location.host + '/ws/fitness');

var userEvents = {
    events: [
        {
            title: '[work] - finish project',
            start: '2021-08-09T09:00:00',
            end: '2021-08-09T17:00:00'
        },
        {
            title: '[work] - study',
            start: '2021-08-10T09:00:00',
            end: '2021-08-10T15:00:00'
        },
        {
            title: '[work] - present project',
            start: '2021-08-11T09:00:00',
            end: '2021-08-11T12:00:00'
        },
        {
            title: '[leisure] - shopping',
            start: '2021-08-11T15:00:00',
            end: '2021-08-11T17:00:00'
        },
        {
            title: '[work] - meeting',
            start: '2021-08-12T09:00:00',
            end: '2021-08-12T15:00:00'
        },
        {
            title: '[work] - plan next project',
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
            title: '[exercise] - arms',
            start: '2021-08-09T18:00:00',
            end: '2021-08-09T18:30:00'
        },
        {
            title: '[exercise] - legs',
            start: '2021-08-10T16:00:00',
            end: '2021-08-10T17:00:00'
        },
        {
            title: '[exercise] - abs',
            start: '2021-08-11T14:00:00',
            end: '2021-08-11T14:30:00'
        },
        {
            title: '[exercise] - shoulders',
            start: '2021-08-12T16:00:00',
            end: '2021-08-12T17:00:00'
        },
        {
            title: '[exercise] - legs',
            start: '2021-08-13T18:00:00',
            end: '2021-08-13T18:30:00'
        },
    ],
    id: "userWorkout",
    color: 'green',
    textColor: 'black'
};

var userSchedData = {
    workTime: 0,
    exerciseTime: 0,
    leisureTime: 0, 
    otherTime: 0
};

function init() {
    $("#calendar-form").hide();
    $("#first-row").hide();
    closeForm();
    hideSuggestions();
}

document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        eventClick: function(info) {
            var eventObj = info.event;
            //alert(eventObj.title);
            eventObj.remove();
            analyzeSchedule();
        },
        timeZone: 'local',
        initialView: 'timeGridWeek',
        headerToolbar: {
            left: 'add autoWorkout',
            center: 'title',
            right: 'prev,next timeGridWeek,timeGridDay'
        }, 
        footerToolbar: {
            center: ''
        },
        customButtons: {
            add: {
                text: 'Add to calendar',
                click: function() {
                    openForm();
                }
            },
            autoWorkout: {
                text: 'Autofill Workout',
                click: function() {
                    generateWorkout();
                }
            }
        },
        eventSources: [
            userEvents
        ]
    });
    calendar.render();
    calendar.scrollToTime(d.getHours() + ':' + d.getMinutes());
    analyzeSchedule();
});

function formatEvent(message) {
    return {
        title: message.type + ' - ' + message.title,
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
    analyzeSchedule();
}

function openForm() {
    $("#calendar-form").show();
    $('#formControl').click(closeForm);
    $('#formControl').text("Hide Form");
}

function closeForm() {
    $("#calendar-form").hide();
    $('#formControl').click(openForm);
    $('#formControl').text("Show Form");
}

function sendForm() {
    var title = document.getElementById("eventName").value;
    var date = document.getElementById("date").value;
    var startTime = document.getElementById("startTime").value;
    var endTime = document.getElementById("endTime").value;
    var taskType = document.getElementById("taskType").value;

    var calendarParams = {
        title: title,
        date: date,
        start: startTime,
        end: endTime,
        type: taskType 
    };

    var event = formatEvent(calendarParams);
    calendar.addEvent(event);
    alert('Successfully added to calendar!');
    analyzeSchedule();
}

// parses through title to get type
function getType(str) {
    return str.replace(/\s+/g, '').split('-')[0].replace(/[\[\]']+/g,'');
}

// returns time in minutes
function getDuration(startTime, endTime) {
    startTime = startTime.split(' ')[4].split(':');
    endTime = endTime.split(' ')[4].split(':');
    var minuteDiff = parseInt(endTime[1]) - parseInt(startTime[1]);  
    var hourDiff = parseInt(endTime[0]) - parseInt(startTime[0]);
    return (hourDiff * 60) + minuteDiff;
}

function analyzeSchedule() {
    var calItems = calendar.getEvents();
    var schedText = document.getElementById('analyze-schedule');

    userSchedData = {
        workTime: 0,
        exerciseTime: 0,
        leisureTime: 0, 
        otherTime: 0
    };

    for (let i = 0; i < calItems.length; i++) {
        var type = getType(calItems[i].title);
        var dur = getDuration(calItems[i].start + '', calItems[i].end + '');
        userSchedData[type + 'Time'] += dur;
    }

    schedText.innerHTML = 'This week you have: <br>' + 
        Math.floor(userSchedData['exerciseTime'] / 60) + ' hours and ' + userSchedData['exerciseTime'] % 60 + ' minutes of exercise, <br>' +
        Math.floor(userSchedData['workTime'] / 60) + ' hours and ' + userSchedData['workTime'] % 60 + ' minutes of work, <br>' +
        Math.floor(userSchedData['leisureTime'] / 60) + ' hours and ' + userSchedData['leisureTime'] % 60 + ' minutes of leisure, <br>' +
        Math.floor(userSchedData['otherTime'] / 60) + ' hours and ' + userSchedData['otherTime'] % 60 + ' minutes of other tasks times.';
    
    suggestions();
}

function showSuggestion() {
    $("#suggTitle").show();
    $("#suggestions").show();
    suggestions();
    $("#suggButton").click(hideSuggestions);
    $("#suggButton").text('Hide suggestions');
}

function hideSuggestions() {
    $("#suggTitle").hide();
    $("#suggestions").hide();
    $("#suggButton").click(showSuggestion);
    $("#suggButton").text('Show suggestions');
}

function suggestions() {
    var textBox = document.getElementById('suggestions');
    var suggText = '';
    if (userSchedData.exerciseTime < 210) {
        var eDiff = 210 - userSchedData.exerciseTime;
        suggText += '    This week, your schedule averages less than 30 minutes of exercise per day. You need ' + 
            eDiff + ' minutes of exerise or more for a healthy amount. Consider using the "Autofill Workout" tool. <br>'
    }

    if (userSchedData.workTime > 2400) { 
        suggText += '    This week, your schedule has you working for more than 40 hours. Consider adding more breaks. <br>'
    }

    if (suggText === '') {
        suggText = 'Your schedule is perfect. Keep it up!'
    }

    textBox.innerHTML = suggText;
}
