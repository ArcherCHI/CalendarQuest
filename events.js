// Retrieves the array of events for a given day
// Takes a string not a date object
function getEventsForDate(date) {
  // Get existing array or create a new empty one from local storage
  return JSON.parse(localStorage.getItem(date) || "[]");
}

// Add the passed event into the array of events for that day to local storage
// Returns true when successful, false when not
function addEvent(date, event) {
  const events = getEventsForDate(date); // Get existing events array
  
  // Check if an event with the same name already exists
  const duplicate = events.some(e => e.name === event.name);
  if (duplicate) {
    console.log("Event " + event.name + " already exists on " + date);
    return false; // Failed to add
  }

  events.push(event); // Add new event to array
  localStorage.setItem(date, JSON.stringify(events)); // Save array back to local storage
  console.log("Added " + event.name + " to the calendar");

  return true; // Successfully added event
}

// Remove the event speceficed by name
// Returns true when successful, false when not
function removeEvent(date, eventName) {
  let events = getEventsForDate(date); // Get the events for the given date

  // Check if the event exists
  const eventExists = events.some(e => e.name === eventName);
  if (!eventExists) {
    console.log("Event " + eventName + " not found on " + date);
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

  console.log("Edited event " + oldName + " -> " + updatedEvent.name + " on " + date);

  return true; // Successfully edited event
}



// Returns true if an event is present on that day, false if not
function eventOnThisDay(day) {
  const events = getEventsForDate(day);

  if (events.length === 0) {
    return false;
  }

  return true;
}

// Creates a new event object
function createEvent(name, date, time, place, description) {
  return { name, date, time, place, description };
}