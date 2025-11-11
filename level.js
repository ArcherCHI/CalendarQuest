/* 
    Leveling System
*/
let amountToLevelUp = 50;
let amountToAddToEachLevelUp = 50;

let level = 0;
const levelElement = document.getElementById("level"); // the level number element itself

let xp = 0;
const xpBar = document.getElementById("xpBar"); // the XP bar element itself

let dailyStreak = 0;
// const streakNumber = document.getElementById("");

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
  console.log("Set XP to " + xp + " out of " + amountToLevelUp +" needed")
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