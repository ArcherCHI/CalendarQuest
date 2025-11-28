// Retrieves the array of events for a given day
function getEventsForDate(date) {
  // Get existing array or create a new empty one from local storage
  return JSON.parse(localStorage.getItem(date) || "[]");
}

// Retrieves the event of a given name on a given data, null if it does not exist
function getEventByName(date, name) {
    const events = getEventsForDate(date); // get array of events for that day
    return events.find(event => event.name === name) || null;
}

// Add the passed event into the array of events for that day to local storage
// Returns true when successful, false when not
function addEvent(date, event) {
  const events = getEventsForDate(date); // Get existing events array

  // Check if an event with the same name already exists
  const duplicate = events.some(e => e.name === event.name);
  if (duplicate) {
    console.log("Event " + event.name + " already exists on " + date + ". Editing it instead.");
    const success = editEvent(date, event.name, event);
    if (success) {
        return 2; // Edited event instead
    } else {
        return 0; // Failed to add or edit
    }
  }

  events.push(event); // Add new event to array
  localStorage.setItem(date, JSON.stringify(events)); // Save array back to local storage
  console.log("Added " + event.name + " to the calendar");

  return 1; // Successfully added event
}

// Remove the event speceficed by name
// Returns true when successful, false when not
function removeEvent(date, eventName) {
  let events = getEventsForDate(date); // Get the events for the given date

  // Check if the event exists
  const eventExists = events.some(e => e.name === eventName);
  if (!eventExists) {
    console.log("Event " + eventName + "not found on " + date);
    return false; // Failed to remove
  }

  // Filter out the event that matches the given name
  const updatedEvents = events.filter(e => e.name !== eventName);

  // Save updated list back to local storage
  localStorage.setItem(date, JSON.stringify(updatedEvents));

  console.log("Removed " + eventName + " from " + date);

  return true; // Successfully removed event
}

// Edits the event by removing old version and adding new version
// Returns true when successful, false when not
function editEvent(date, oldName, updatedEvent) {
  const events = getEventsForDate(date);

  // Check if the new name already exists and not the same as the old name
  const nameIsTaken = events.some(e => e.name === updatedEvent.name && e.name !== oldName);

  if (nameIsTaken) {
    console.log("Event with the name " + updatedEvent.name + " already exists on " + date);
    return false; // Failed to edit
  }

  // Remove the old event by its old name
  removeEvent(date, oldName);

  // Add the updated version which could have a new name
  addEvent(date, updatedEvent);

  // Signifier to show that event details have been saved
  document.getElementById("saveButton").textContent = "Saved!";
  setTimeout(function() {
    document.getElementById("saveButton").textContent = "Save";
    document.getElementById("saveButton").style.backgroundColor = "white";
    document.getElementById("saveButton").style.color = "black";
  }, 5000);
  console.log("Edited event " + oldName + " -> " + updatedEvent.name + " on " + date);

  return true; // Successfully edited event
}

// Creates a new event object
function createEvent(name, date, time, place, description, lastInspectDate) {
  return { name, date, time, place, description, lastInspectDate};
}

// Event Window functionality
let currentEditingEventName = null;
const openEvents = document.getElementById("openEvents");
const eventWindow = document.getElementById("eventWindow");
const closeEventWindow = document.getElementById("closeEventWindow");
const addEventButton = document.getElementById("addEvent");
const newEventWindow = document.getElementById("newEventWindow");
// Open event window when a date is clicked
openEvents.style.background = "transparent";
openEvents.style.border = "none";
openEvents.addEventListener("click", function () {
    eventWindow.style.display = "block";
    date = document.getElementById("eventDate").textContent;
    renderEventList(date);
    console.log("Event Window Opened");
});

// Close event window when X is clicked
closeEventWindow.addEventListener("click", function () {
    eventWindow.style.display = "none";
    console.log("Event Window Closed");
    clearEventInput();
    newEventWindow.style.visibility = "hidden";
});

// Creates a small window for adding a new event
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

// Add event to list
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
        const eventsOfDate = getEventsForDate(currentDate);
        const eventData = eventsOfDate.find(e => e.name === eventName);

        if (eventData) {
            // Checks whether the user has inspected the event today
            const today = new Date();
            const lastInspect = eventData.lastInspectDate ? new Date(eventData.lastInspectDate) : null;

            if (!lastInspect || lastInspect.toDateString() !== today.toDateString()) {
                updateAllQuestProgress("inspect event", 1);
                eventData.lastInspectDate = today;

                editEvent(currentDate, eventData.name, eventData);
            } else {
                console.log("This event has already been inspected");
            }

            currentEditingEventName = eventName;

            document.getElementById("eventTitle").value = eventData.name || "";
            document.getElementById("eventTime").value = eventData.time || "";
            document.getElementById("eventLocation").value = eventData.place || "";
            document.getElementById("eventDescription").value = eventData.description || "";
            document.getElementById("newEventWindow").style.visibility = "visible";
            console.log('Viewing event:', eventName);
        }
    });
    newEvent.appendChild(viewBtn);
    eventList.prepend(newEvent);
    events.push(eventName);
}    

// Clear event input fields when event window is closed
function clearEventInput() {
    document.getElementById("eventTitle").value = "";
    document.getElementById("eventTime").value = "";
    document.getElementById("eventLocation").value = "";
    document.getElementById("eventDescription").value = "";
}

function removeEventDots(){
    console.log("Removing Event Dots");
    document.querySelectorAll(".event-dot").forEach(dot => dot.remove());
}

// For each date-cell, display a dot for each event on that date
function displayEvents(){
    // console.log(events);
    console.log("Displaying Event Dots");
    removeEventDots();
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



// When user clicks a date, display the events for that date
function renderEventList(date) {
    console.log("renderEventList called");
    const items = eventList.querySelectorAll('.event-list-item');
    items.forEach(item => item.remove());

    const events = getEventsForDate(date);
    events.forEach(event => addEventToList(event.name));
}

// Adds event to list when "save" button is clicked
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

    const existingEvent = getEventByName(eventName); // For quest progress tracking

    const success = addEvent(date, createEvent(eventName, date, eventTime, eventLocation, eventDescription, null));

    if (success === 1 || success === 2) {
        // Always increment "add event" for new or edited events
        if (success === 1) {
            updateAllQuestProgress("add event", 1);
        }

        // Check attributes only if they are newly added or changed
        if (eventTime !== "" && (!existingEvent || eventTime !== existingEvent.eventTime)) {
            updateAllQuestProgress("add time", 1);
        }

        if (eventLocation !== "" && (!existingEvent || eventLocation !== existingEvent.eventLocation)) {
            updateAllQuestProgress("add location", 1);
        }

        if (eventDescription !== "" && (!existingEvent || eventDescription !== existingEvent.eventDescription)) {
            updateAllQuestProgress("add description", 1);
        }

        // For "add complete event" quest
        if (
            eventTime !== "" && (!existingEvent || eventTime !== existingEvent.eventTime) &&
            eventLocation !== "" && (!existingEvent || eventLocation !== existingEvent.eventLocation) &&
            eventDescription !== "" && (!existingEvent || eventDescription !== existingEvent.eventDescription)
        ) {
            updateAllQuestProgress("add complete event", 1);
        }

        console.log("Event added successfully: " + eventName);
        renderEventList(date);

        document.getElementById("eventTitle").value = "";
        document.getElementById("eventTime").value = "";
        document.getElementById("eventLocation").value = "";
        document.getElementById("eventDescription").value = "";

        currentEditingEventName = null;

        console.log("Event saved successfully: " + eventName);
        
        displayEvents();
    }
});

// Removes event from list when "remove" button is clicked
const removeButton = document.getElementById("removeButton");
removeButton.addEventListener("click", function (e) {
    console.log("Remove Button Clicked");
    date = document.getElementById("eventDate").textContent;
    eventName = document.getElementById("eventTitle").value;
    removeEvent(date, eventName);
    // document.querySelectorAll("event-dot").remove();
    // cell.parentNode.removeChild(cell);
    renderEventList(date);
    displayEvents();
    newEventWindow.style.visibility = "hidden";
});
