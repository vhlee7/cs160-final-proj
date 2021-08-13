var d = new Date();
var myStorage = window.localStorage;
var calendar;
var socket = new WebSocket(
    'ws://' + window.location.host + '/ws/fitness');

var calColor = {
    work: '#e4e4e4',
    exercise: 'green',
    leisure: 'blue',
    other: '#87ceeb'
}

var userEvents = {
    events: [
        {
            id: 'mywork',
            title: '[work] - finish project',
            start: '2021-08-09T09:00:00',
            end: '2021-08-09T17:00:00',
            backgroundColor: calColor['work']
        },
        {
            title: '[work] - study',
            start: '2021-08-10T09:00:00',
            end: '2021-08-10T15:00:00',
            backgroundColor: calColor.work
        },
        {
            title: '[work] - present project',
            start: '2021-08-11T09:00:00',
            end: '2021-08-11T12:00:00',
            backgroundColor: calColor.work
        },
        {
            title: '[leisure] - shopping',
            start: '2021-08-11T15:00:00',
            end: '2021-08-11T17:00:00',
            backgroundColor: calColor.leisure
        },
        {
            title: '[work] - meeting',
            start: '2021-08-12T09:00:00',
            end: '2021-08-12T15:00:00',
            backgroundColor: calColor.work
        },
        {
            title: '[work] - plan next project',
            start: '2021-08-13T09:00:00',
            end: '2021-08-13T17:00:00',
            backgroundColor: calColor.work
        },
        {
            id: 'mywork',
            title: '[work] - finish project',
            start: '2021-08-16T09:00:00',
            end: '2021-08-16T17:00:00',
            backgroundColor: calColor.work
        },
        {
            title: '[work] - study',
            start: '2021-08-17T09:00:00',
            end: '2021-08-17T15:00:00',
            backgroundColor: calColor.work
        },
        {
            title: '[work] - present project',
            start: '2021-08-18T09:00:00',
            end: '2021-08-18T12:00:00',
            backgroundColor: calColor.work
        },
        {
            title: '[leisure] - shopping',
            start: '2021-08-18T15:00:00',
            end: '2021-08-18T17:00:00',
            backgroundColor: calColor.work
        },
        {
            title: '[work] - meeting',
            start: '2021-08-19T09:00:00',
            end: '2021-08-19T15:00:00',
            backgroundColor: calColor.work
        },
        {
            title: '[work] - plan next project',
            start: '2021-08-20T09:00:00',
            end: '2021-08-20T17:00:00',
            backgroundColor: calColor.work
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

var wList = ['arms', 'legs', 'abs', 'shoulders', 'back', 'chest'];

var deleteMode = false;

function init() {
    $("#first-row").hide();
    closeForm();
    closeForm2();
    hideSuggestions();
    deleteModeOff();

    if (localStorage.getItem('userTracker') === null) {
        // pages that user opened
        var userTracker = {
            index: false,
            calendar: true,
            goal: false,
            about: false, 
            muscle_group: false, 
            progress: false

        };
        localStorage.setItem('userTracker', JSON.stringify(userTracker));
    } else {
        let tracker = JSON.parse(localStorage.getItem('userTracker'));
        tracker['calendar'] = true;
        localStorage.setItem('userTracker', JSON.stringify(tracker));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        eventClick: function(info) {
            var eventObj = info.event;
            if (deleteMode) {
                alert(eventObj.title + ' was deleted.')
                eventObj.remove();
                analyzeSchedule();
            } else {
                alert(eventObj.title);
            }
        },
        timeZone: 'local',
        nowIndicator: true,
        initialView: 'timeGridWeek',
        headerToolbar: {
            left: 'add autoWorkout',
            center: 'title',
            right: 'prev,next timeGridWeek,timeGridDay'
        }, 
        footerToolbar: {
            left: 'delete'
        },
        customButtons: {
            add: {
                text: 'Add to calendar',
                click: function() {
                    closeForm2();
                    deleteModeOff();
                    openForm();
                }
            },
            autoWorkout: {
                text: 'Autofill Workout',
                click: function() {
                    closeForm();
                    deleteModeOff();
                    openForm2();
                }
            },
            delete: {
                text: 'Delete items',
                click: function() {
                    closeForm();
                    closeForm2();
                    deleteModeOn();
                }
            }
        },
        events: [

        ]
    });
    calendar.render();
    //calendar.scrollToTime(d.getHours() + ':' + d.getMinutes());
    var cachedEvents = JSON.parse(localStorage.getItem('calendarEvents'));
    if (cachedEvents === null) {
        importUserEvents(userEvents.events);
    } else {
        importUserEvents(cachedEvents);
    }
    analyzeSchedule();
});

function formatEvent(message) {
    return {
        title: '[' + message.type + '] - ' + message.title,
        start: message.date + "T" + message.start + ":00",
        end: message.date + "T" + message.end + ":00",
        backgroundColor: calColor[message.type]
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

function getEventsDate(date) {
    var allEvents = calendar.getEvents();
    var dEvents = [];
    for (let i = 0; i < allEvents.length; i++) {
        if (allEvents[i].startStr.split('T')[0] === date) {
            dEvents.push(allEvents[i]);
        }
    }
    return dEvents;
}

function getEventsWeek(wStart, wEnd) {
    var allEvents = calendar.getEvents();
    var wEvents = [];
    for (let i = 0; i < allEvents.length; i++) {
        if (allEvents[i].start >= wStart && allEvents[i].start < wEnd) {
            wEvents.push(allEvents[i]);
        }
    }
    return wEvents;
}

function openForm() {
    $("#calendar-form").show();
}

function closeForm() {
    $("#calendar-form").hide();
}

function openForm2() {
    $("#workout-fill").show();
}

function closeForm2() {
    $("#workout-fill").hide();
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

    if (taskType === 'exercise') {
        localStorage.setItem('manExercise', 'true');
    }

    var event = formatEvent(calendarParams);
    calendar.addEvent(event);
    alert('Successfully added to calendar!');
    analyzeSchedule();
}

function sendForm2() {
    var date = document.getElementById("wdate").value;
    var minutes = document.getElementById("minutes").value;
    minutes = parseInt(minutes);
    var sel = Math.floor(Math.random() * wList.length);
    var eventList = getEventsDate(date);
    localStorage.setItem('autoExercise', 'true');
    eventList.sort(function (a, b) {
        var aSt = parseInt(a.startStr.split('T')[1].split(':')[0]) * 60 + parseInt(a.startStr.split('T')[1].split(':')[1])
        var bSt = parseInt(b.startStr.split('T')[1].split(':')[0]) * 60 + parseInt(b.startStr.split('T')[1].split(':')[1])
        if (aSt < bSt) {
            return -1;
        } else if (aSt > bSt) {
            return 1;
        } else {
            return 0;
        }
    });
    if (eventList.length == 0) {
        calendar.addEvent({
            title: '[exercise] - ' + wList[sel],
            start: date + 'T08:00:00',
            end: date + 'T' + ('0' + Math.floor(minutes / 60 + 8 )).slice(-2) + ':' + ('0' + minutes % 60).slice(-2) + ':00',
            backgroundColor: calColor['exercise']
        });
        alert('Successfully added to calendar!');
        return;
    } else {
        var eStart = '08';
        if (parseInt(eventList[0].startStr.split('T')[1].split(':')[0]) - Math.floor(minutes / 60) > 8) {
            eStart = '08';
            calendar.addEvent({
                title: '[exercise] - ' + wList[sel],
                start: date + 'T' + ('0' + eStart).slice(-2) + ':00:00',
                end: date + 'T' + ('0' + Math.floor(minutes / 60 + parseInt(eStart))).slice(-2) + ':' + ('0' + minutes % 60).slice(-2) + ':00',
                backgroundColor: calColor['exercise']
            });
        } else {
            for (let j = 0; j < eventList.length - 1; j++) {
                var dTime = getDuration(eventList[j].endStr, eventList[j + 1].startStr);
                if (dTime >= minutes) {
                    var eH = parseInt(eventList[j].endStr.split('T')[1].split(':')[0]);
                    var eM = parseInt(eventList[j].endStr.split('T')[1].split(':')[1]);
                    eH += Math.floor((eM + minutes) / 60);
                    calendar.addEvent({
                        title: '[exercise] - ' + wList[sel],
                        start: eventList[j].endStr,
                        end: date + 'T' + ('0' + Math.floor(minutes / 60) + eH).slice(-2) + ':' + ('0' + (minutes + eM) % 60).slice(-2) + ':00',
                        backgroundColor: calColor['exercise']
                    });
                    alert('Successfully added to calendar!');
                    return;
                }
            }
            var last = eventList[eventList.length - 1];
            var lH = parseInt(last.endStr.split('T')[1].split(':')[0]);
            var lM = parseInt(last.endStr.split('T')[1].split(':')[1]);
            lH += Math.floor((lM + minutes) / 60);
            calendar.addEvent({
                title: '[exercise] - ' + wList[sel],
                start: last.endStr,
                end: date + 'T' + ('0' + Math.floor(minutes / 60) + lH).slice(-2) + ':' + ('0' + (minutes + lM) % 60).slice(-2) + ':00',
                backgroundColor: calColor['exercise']
            });
            alert('Successfully added to calendar!');
            analyzeSchedule();
            return;
        }
    }
}

// parses through title to get type
function getType(str) {
    return str.replace(/\s+/g, '').split('-')[0].replace(/[\[\]']+/g,'');
}

// returns time in minutes
function getDuration(st, et) {
    st = st.split('T')[1].split(':');
    et = et.split('T')[1].split(':');
    var minuteDiff = parseInt(et[1]) - parseInt(st[1]);  
    var hourDiff = parseInt(et[0]) - parseInt(st[0]);
    return (hourDiff * 60) + minuteDiff;
}

function addDays(date, days) {
    var result = new Date(date.toDateString());
    result.setDate(result.getDate() + days);
    return result;
}

function analyzeSchedule() {
    var curDay = d.getDay();
    var wStart = addDays(d, -1 * curDay);
    var wEnd = addDays(d, (6 - curDay) + 1);
    var wEvents = getEventsWeek(wStart, wEnd);
    var schedText = document.getElementById('analyze-schedule');

    userSchedData = {
        workTime: 0,
        exerciseTime: 0,
        leisureTime: 0, 
        otherTime: 0
    };

    for (let i = 0; i < wEvents.length; i++) {
        var type = getType(wEvents[i].title);
        var dur = getDuration(wEvents[i].startStr, wEvents[i].endStr);
        userSchedData[type + 'Time'] += dur;
    }

    var wB = (wStart + '').split(" ")[1] + ' ' + (wStart + '').split(" ")[2];
    var wE = (wEnd + '').split(" ")[1] + ' ' + (parseInt((wEnd + '').split(" ")[2]) - 1);

    schedText.innerHTML = 'This week (' + wB + ' to ' + wE + ') you have: <br><b>' + 
        Math.floor(userSchedData['exerciseTime'] / 60) + ' hours</b> and <b>' + userSchedData['exerciseTime'] % 60 + ' minutes</b> of <b>exercise</b>, <br><b>' +
        Math.floor(userSchedData['workTime'] / 60) + ' hours</b> and <b>' + userSchedData['workTime'] % 60 + ' minutes</b> of <b>work</b>, <br><br><b>' +
        Math.floor(userSchedData['leisureTime'] / 60) + ' hours</b> and <b>' + userSchedData['leisureTime'] % 60 + ' minutes</b> of <b>leisure</b>, <br><b>' +
        Math.floor(userSchedData['otherTime'] / 60) + ' hours</b> and <b>' + userSchedData['otherTime'] % 60 + ' minutes</b> of <b>other</b> tasks times.<br><br>';
    
    suggestions();
    saveEvents();
    localStorage.setItem('userHours', JSON.stringify(userSchedData));
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
    if (userSchedData.exerciseTime < 150) {
        var eDiff = 150 - userSchedData.exerciseTime;
        suggText += '    This week, your schedule averages less than 30 minutes of exercise per day. You need ' + 
            eDiff + ' minutes of exerise or more for a healthy amount. Consider using the "Autofill Workout" tool. <br>';
    }

    if (userSchedData.workTime > 2400) { 
        suggText += '    This week, your schedule has you working for more than 40 hours. Consider adding more breaks. <br>';
    }

    if (suggText === '') {
        suggText = 'Your schedule is perfect. Keep it up!';
    }

    if (userSchedData.exerciseTime > userSchedData.leisureTime) {
        localStorage.setItem('moreExercise', 'true');
    }

    textBox.innerHTML = suggText;
}

function saveEvents() {
    var allEvents = calendar.getEvents();
    localStorage.setItem('calendarEvents', JSON.stringify(allEvents));
}

function importUserEvents(listEvents) {
    for (let i = 0; i < listEvents.length; i++) {
        calendar.addEvent(listEvents[i]);
    }
}

function deleteModeOff() {
    deleteMode = false;
    $("#delete-mode").hide();
}

function deleteModeOn() {
    deleteMode = true;
    $("#delete-mode").show();
}

function goBack() {
    window.history.back();
  }
