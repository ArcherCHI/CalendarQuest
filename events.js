// Retrieves the array of events for a given day
function getEventsForDate(date) {
  // Get existing array or create a new empty one from local storage
  return JSON.parse(localStorage.getItem(date) || "[]");
}

// Add the passed event into the array of events for that day to local storage
function addEvent(date, event) {
  const events = getEventsForDate(date); // Get existing events array
  events.push(event); // add new event to array
  localStorage.setItem(date, JSON.stringify(events)); // Save array back to local storage
  console.log("Added " + event.name + " to the calendar");
}

// Function to create a new event object
function createEvent(name, date, time, place, description) {
  return { name, date, time, place, description };
}