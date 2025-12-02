// For each event in the next 7 days, display them in 7 boxes under upcoming-events-list
function displayUpcomingEvents(){
    console.log("Displaying Upcoming Events");
    const upcomingEventsList = document.getElementById("upcoming-events-list");
    upcomingEventsList.innerHTML = "";
    const today = new Date();
    const next7Days = new Date();
    next7Days.setDate(today.getDate() + 7);
    const events = getEventsForDateRange(today, next7Days);
    events.forEach(event => {
        const eventBox = document.createElement("li");
        eventBox.classList.add("list-element");
        eventBox.innerHTML = event.date + ": " + event.name;
        upcomingEventsList.appendChild(eventBox);
        console.log("Event Box Text:" + eventBox.textContent );
    });
}
function getEventsForDateRange(startDate, endDate){
    const events = [];
    for(let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)){
        const eventsForDate = getEventsForDate(date.toDateString());
        events.push(eventsForDate);
        console.log("Events for " + date.toDateString() + ": " + eventsForDate.length);
    }
    return events;
}
function getEventsForDate(date){
    const events = JSON.parse(localStorage.getItem(date)) || [];
    return events;
}
function displayEvents(){
    console.log("Displaying Event Dots");
    const dateCells = document.querySelectorAll(".date-cell");
    dateCells.forEach(cell => {
        const dateStr = cell.querySelector(".date-button").getAttribute("data-date");
        const [clickedYear, clickedMonth, clickedDay] = dateStr.split("-").map(Number);
        const clickedDate = new Date( clickedYear, clickedMonth - 1, clickedDay );
        const dateString = clickedDate.toDateString();
        const events = getEventsForDate(dateString);
        if (events.length > 0) {
            console.log("Number of events on " + dateString + ": " + events.length);
            const dot = document.createElement("div");
            dot.classList.add("event-dot");
            if ( events.length > 1 )
                dot.textContent = events.length + " events";
            else
                dot.textContent = events.length + " event";
            cell.appendChild(dot);
            console.log("Cell Text:" + cell.textContent );
        }
    });
}
window.onload = function(){
    // displayEvents();
    // displayUpcomingEvents();
}
function getUpcomingEvents() {
    const events = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() + i);
        const dateString = checkDate.toDateString();
        const dayEvents = getEventsForDate(dateString);

        dayEvents.forEach(event => {
            events.push({
                ...event,
                dateString: dateString,
                displayDate: formatDisplayDate(checkDate)
            });
        });
    }
    return events;
}

function formatDisplayDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function renderUpcomingEvents() {
    const upcomingList = document.getElementById("upcoming-events-list");
    if (!upcomingList) return;

    upcomingList.innerHTML = "";
    const events = getUpcomingEvents();

    if (events.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.classList.add("upcoming-event-item", "empty-message");
        emptyMessage.textContent = "No events scheduled for the next 7 days";
        upcomingList.appendChild(emptyMessage);
        return;
    }

    events.forEach(event => {
        const eventItem = document.createElement("li");
        eventItem.classList.add("upcoming-event-item");

        const dateSpan = document.createElement("span");
        dateSpan.classList.add("upcoming-event-date");
        dateSpan.textContent = event.displayDate;

        const nameSpan = document.createElement("span");
        nameSpan.classList.add("upcoming-event-name");
        nameSpan.textContent = event.name;

        const timeSpan = document.createElement("span");
        timeSpan.classList.add("upcoming-event-time");
        timeSpan.textContent = event.time || "";

        eventItem.appendChild(dateSpan);
        eventItem.appendChild(nameSpan);
        eventItem.appendChild(timeSpan);
        upcomingList.appendChild(eventItem);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    renderUpcomingEvents();
});