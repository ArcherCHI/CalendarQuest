const header = document.querySelector(".calendar h3");
const dates = document.querySelector(".dates");
const navs = document.querySelectorAll("#prev, #next");

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

let events = [];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

let date = new Date();
let month = date.getMonth();
let year = date.getFullYear();

function renderCalendar() {
    // first day of the month
    const start = new Date(year, month, 1).getDay();
    // last date of the month
    const endDate = new Date(year, month + 1, 0).getDate();
    // last day of the month
    const end = new Date(year, month, endDate).getDay();
    // last date of the previous month
    const endDatePrev = new Date(year, month, 0).getDate();

    let datesHtml = "";

    for (let i = start; i > 0; i--) {
        datesHtml += `<li class="inactive">${endDatePrev - i + 1}</li>`;
    }

    for (let i = 1; i <= endDate; i++) {
        let className =
            i === date.getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear()
                ? ' class="today date-cell"'
                : ' class="date-cell"';

        // Zero-pad month and day for consistent date formatting
        const paddedMonth = String(month + 1).padStart(2, "0");
        const paddedDay = String(i).padStart(2, "0");
        const dateStr = `${year}-${paddedMonth}-${paddedDay}`;

        // Create button element hidden behind the date number
        datesHtml += `<li${className}>
            <button class="date-button" data-date="${dateStr}" aria-label="${months[month]} ${i}, ${year}"></button>
            <span class="date-number">${i}</span>
        </li>`;
    }

    for (let i = end; i < 6; i++) {
        datesHtml += `<li class="inactive">${i - end + 1}</li>`;
    }

    dates.innerHTML = datesHtml;
    header.textContent = `${months[month]} ${year}`;
}

// Event delegation for date button clicks
dates.addEventListener("click", function (e) {
    const button = e.target.closest(".date-button");
    if (button) {
        const dateStr = button.getAttribute("data-date");

        // Create Date object properly to avoid timezone issues
        const [clickedYear, clickedMonth, clickedDay] = dateStr
            .split("-")
            .map(Number);
        
        const clickedDate = new Date(clickedYear, clickedMonth - 1, clickedDay);
        const dateString = clickedDate.toDateString();
        console.log("Selected day:", clickedDate.toDateString());
        document.getElementById("eventDate").textContent = dateString;
        renderEventList(dateString);
        eventWindow.style.display = "flex";
        
        updateAllQuestProgress("inspect event", 1);
    }
});

navs.forEach((nav) => {
    nav.addEventListener("click", (e) => {
        const btnId = e.target.id;

        if (btnId === "prev" && month === 0) {
            year--;
            month = 11;
        } else if (btnId === "next" && month === 11) {
            year++;
            month = 0;
        } else {
            month = btnId === "next" ? month + 1 : month - 1;
        }

        date = new Date(year, month, new Date().getDate());
        year = date.getFullYear();
        month = date.getMonth();

        renderCalendar();
    });
});

renderCalendar();

// displayWeeklyStreak();

const newEventWindow = document.getElementById("newEventWindow");

// Modal windows are the pop up windows that appear when you initially log in
// Modal Window functionality
const modal = document.getElementById("myModal");
const modalBtn = document.getElementById("modalWindow");
const closeBtn = document.getElementById("closeModal");

modalBtn.style.background = "transparent";
modalBtn.style.border = "none";

// Open modal when button is clicked
modalBtn.addEventListener("click", function () {
    displayWeeklyStreak(); 
    modal.style.display = "flex";
});

// Close modal when X is clicked
closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
    console.log("Modal Closed");
});

// Close modal when clicking outside of it
window.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    } else if (event.target === eventWindow ){
        eventWindow.style.display = "none"; 
        newEventWindow.style.visibility = "hidden";
    }
});

// Display weekly streak in modal window
function displayWeeklyStreak() {
    today = date.getDay();
    let i = 0;
    while (today != i && i < 7) {
        document.getElementsByClassName("dayBox")[i].style.backgroundColor =
            "#4caf50";
        i++;
        console.log(today, days[i]);
    }
    document.getElementById("xpBar").style.width = (i + 1) * 10 + "%";
    document.getElementById("xpBar").textContent = (i + 1) * 10 + "%";
    document.getElementsByClassName("dayBox")[i].style.backgroundColor =
        "#4caf50";
}


// Event Window functionality
let currentEditingEventName = null;

const openEvents = document.getElementById("openEvents");
const eventWindow = document.getElementById("eventWindow");
const closeEventWindow = document.getElementById("closeEventWindow");
const addEventButton = document.getElementById("addEvent");

openEvents.style.background = "transparent";
openEvents.style.border = "none";

openEvents.addEventListener("click", function () {
    eventWindow.style.display = "block";
    date = document.getElementById("eventDate").textContent;
    renderEventList(date);
    console.log("Event Window Opened");
});
closeEventWindow.addEventListener("click", function () {
    eventWindow.style.display = "none";
    console.log("Event Window Closed");
    clearEventInput();
    newEventWindow.style.visibility = "hidden";
});


addEventButton.addEventListener("click", function (e) {
    console.log("Add Event Button Clicked");
    currentEditingEventName = null;
    newEventWindow.style.visibility = "visible";

    document.getElementById("eventTitle").value = "";
    document.getElementById("eventTime").value = "";
    document.getElementById("eventLocation").value = "";
    document.getElementById("eventDescription").value = "";
});

// Event List functionality
const eventList = document.querySelector(".event-list");
const eventButton = document.querySelector(".event-button");

if (eventButton) {
    eventButton.addEventListener("click", function (e) {
        console.log("Event Button Clicked");
        document.getElementsByClassName("event-details").visibility = "visible";
    });
}

function addEventToList(eventName) {
    const newEvent = document.createElement("li");
    newEvent.classList.add("event-list-item");
    
    const textSpan = document.createElement("span");
    textSpan.textContent = eventName;
    textSpan.style.flexGrow = "1";
    newEvent.appendChild(textSpan);

    const viewBtn = document.createElement("button");
    viewBtn.textContent = "View";
    viewBtn.classList.add("event-view-btn");
    viewBtn.addEventListener('click', function() {
        const currentDate = document.getElementById("eventDate").textContent;
        const events = getEventsForDate(currentDate);
        const eventData = events.find(e => e.name === eventName);

        if (eventData) {
            currentEditingEventName = eventName;
            
            document.getElementById("eventTitle").value = eventData.name || "";
            document.getElementById("eventTime").value = eventData.time || "";
            document.getElementById("eventLocation").value = eventData.place || "";
            document.getElementById("eventDescription").value = eventData.description || "";
            newEventWindow.style.visibility = "visible";
            console.log('Viewing event:', eventName);
        }
    });

    newEvent.appendChild(viewBtn);
    eventList.prepend(newEvent);
}    

function clearEventInput() {
    document.getElementById("eventTitle").value = "";
    document.getElementById("eventTime").value = "";
    document.getElementById("eventLocation").value = "";
    document.getElementById("eventDescription").value = "";
}

function renderEventList(date) {
    const items = eventList.querySelectorAll('.event-list-item');
    items.forEach(item => item.remove());
    
    const events = getEventsForDate(date);
    events.forEach(event => addEventToList(event.name));
}

function openNewEventWindow(){
    document.getElementById("newEvent-section").visibility = "visible";
}
const saveButton = document.getElementById("saveButton");
saveButton.addEventListener("click", function (e) {
    console.log("Save Button Clicked");
    date = document.getElementById("eventDate").textContent;
    eventName = document.getElementById("eventTitle").value;
    eventTime = document.getElementById("eventTime").value;
    eventLocation = document.getElementById("eventLocation").value;
    eventDescription = document.getElementById("eventDescription").value;
    
    if (!eventName.trim()) {
        alert("Please enter an event title");
        return;
    }
    
    const success = addEvent(date, createEvent(eventName, date, eventTime, eventLocation, eventDescription));
    
    if (success) {
        updateAllQuestProgress("add event", 1);

        if (eventTime !== "" && eventLocation !== "") {
            updateAllQuestProgress("add time+location", 1);
        }

        renderEventList(date);
        
        document.getElementById("eventTitle").value = "";
        document.getElementById("eventTime").value = "";
        document.getElementById("eventLocation").value = "";
        document.getElementById("eventDescription").value = "";
        
        currentEditingEventName = null;
        newEventWindow.style.visibility = "hidden";
        
        console.log("Event saved successfully: " + eventName);
    }
});

const editButton = document.getElementById("editButton");
editButton.addEventListener("click", function (e) {
    console.log("Edit Button Clicked");
    
    if (!currentEditingEventName) {
        alert("Please select an event to edit by clicking the View button");
        return;
    }
    
    const date = document.getElementById("eventDate").textContent;
    const newEventName = document.getElementById("eventTitle").value;
    const newEventTime = document.getElementById("eventTime").value;
    const newEventLocation = document.getElementById("eventLocation").value;
    const newEventDescription = document.getElementById("eventDescription").value;
    
    if (!newEventName.trim()) {
        alert("Please enter an event title");
        return;
    }
    
    const updatedEvent = createEvent(newEventName, date, newEventTime, newEventLocation, newEventDescription);
    const success = editEvent(date, currentEditingEventName, updatedEvent);
    
    if (success) {
        renderEventList(date);

        if (eventTime !== "" && eventLocation !== "") {
            updateAllQuestProgress("add time+location", 1);
        }
        
        document.getElementById("eventTitle").value = "";
        document.getElementById("eventTime").value = "";
        document.getElementById("eventLocation").value = "";
        document.getElementById("eventDescription").value = "";
        
        currentEditingEventName = null;
        newEventWindow.style.visibility = "hidden";
        
        console.log("Event edited successfully");
    } else {
        alert("Failed to edit event. An event with that name may already exist.");
    }
});

const removeButton = document.getElementById("removeButton");
removeButton.addEventListener("click", function (e) {
    console.log("Remove Button Clicked");
    date = document.getElementById("eventDate").textContent;
    eventName = document.getElementById("eventTitle").value;
    removeEvent(date, eventName);
    renderEventList(date);
    newEventWindow.style.visibility = "hidden";
    // removeEvent();
});

displayWeeklyStreak();