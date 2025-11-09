/* 
    Leveling System
*/
let amountToLevelUp = 50;
let amountToAddToEachLevelUp = 50;
let level = 0;
let xp = 0;
const levelElement = document.getElementById("level"); // the level number element itself
const xpBar = document.getElementById("xpBar"); // the XP bar element itself

// Load in level and XP from local storage
if (typeof(Storage) !== "undefined") {
  // Set level to 0 if there is none in local storage
  if (localStorage.getItem("level") === null) {
    localStorage.setItem("level", "0");
    console.log("No level found, intialized level to 0")
  } else {
    console.log("Current level found")
  }

  // Set XP to 0 if there is none in local storage
  if (localStorage.getItem("xp") === null) {
    localStorage.setItem("xp", "0");
    console.log("No XP found, intialized XP to 0")
  } else {
    console.log("Current XP found")
  }

  // Retrieve and set level
  level = parseInt(localStorage.getItem("level")) || 0;
  amountToLevelUp = (level + 1) * amountToAddToEachLevelUp; // Set next amount of XP to level up
  levelElement.innerHTML = level;
  console.log("Set level to " + level)

  // Retrieve and set XP
  xp = parseInt(localStorage.getItem("xp")) || 0;
  updateXPBar();
  console.log("Set XP to " + xp)
} else {
  levelElement.innerHTML = "Web storage not supported";
}

// Add XP to the player's level
function addXP(xpAmount) {
    xp += xpAmount; // Add xp 

    // Check for level up
    if (xp >= amountToLevelUp) {
        // Level up
        level++;
        localStorage.setItem("level", level); // Update the level in the local storage
        document.getElementById("level").innerHTML = level;

        amountToLevelUp = (level + 1) * amountToAddToEachLevelUp;  // Update the amount needed for next level up
        
        let overflowXP = xp - amountToLevelUp; // Check for overflow
        
        xp = 0; // Reset XP
        localStorage.setItem("xp", 0); // Update the XP in the local storage
        
        // Update XP bar (should reset to 0%)
        updateXPBar();

        // If there’s leftover XP, apply it after level-up
        if (overflowXP > 0) {
          addXP(overflowXP);
        }
    } else {
      // Update the XP bar
      localStorage.setItem("xp", xp);
      updateXPBar();
    }

    console.log("+" + xpAmount + " XP");
}

// Updates the XP bar's visuals
function updateXPBar() {
  const percent = (xp / amountToLevelUp) * 100; // Get the percent to update the XP bar
  const xpBar = document.getElementById("xpBar");

  // Update the width
  xpBar.style.width = percent + "%";
  xpBar.textContent = Math.floor(percent) + "%";
}

// Sets the level to the number is passed as a parameter
function setLevel(newLevel) {
  // Check for valid number (is a number and not negative)
  newLevel = parseInt(newLevel);
  if (isNaN(newLevel) || newLevel < 0) {
    console.log("Invalid level value, level was not reset");
    return;
  }

  // Update global variables
  level = newLevel;
  xp = 0;
  amountToLevelUp = (level + 1) * amountToAddToEachLevelUp;

  // Save to localStorage
  localStorage.setItem("level", level);
  localStorage.setItem("xp", xp);

  // Update UI
  levelElement.textContent = level;
  updateXPBar();

  console.log("Level manually set to " + level + " and was XP reset to 0");
}

// Check to see if user has logged in today
function hasLoggedInToday() {
  const today = new Date().toDateString(); // format: "Sat Nov 08 2025"
  const lastLogin = localStorage.getItem("lastLoginDate");

  if (lastLogin === today) {
    // Already logged in today
    console.log("Player has already logged in today")
    return true;
  } else {
    // First login today, update last login day
    localStorage.setItem("lastLoginDate", today);
    return false;
  }
}

displayDailyMessage();

// If the player hasn't logged in today then display login message
function displayDailyMessage() {
  if (!hasLoggedInToday()) {
    // Make modal visiable
    const modal = document.getElementById("myModal");
    modal.style.display = "flex";
    console.log("Displaying login message")
  }
}