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
    console.log("renderCalendar called");
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
    displayEvents();
}


// Event delegation for date button clicks
dates.addEventListener("click", function (e) {
    const button = e.target.closest(".date-button");
    if (button) {
        const dateStr = button.getAttribute("data-date");

        // Create Date object properly to avoid timezone issues
        const [clickedYear, clickedMonth, clickedDay] = dateStr.split("-").map(Number);

        const clickedDate = new Date(clickedYear, clickedMonth - 1, clickedDay);
        const dateString = clickedDate.toDateString();
        console.log("Selected day:", clickedDate.toDateString());
        document.getElementById("eventDate").textContent = dateString;
        renderEventList(dateString);
        eventWindow.style.display = "flex";
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




// Modal windows are the pop up windows that appear when you initially log in
// Modal Window functionality
const modal = document.getElementById("myModal");
const modalBtn = document.getElementById("modalWindow");
const closeBtn = document.getElementById("closeModal");

modalBtn.style.background = "transparent";
modalBtn.style.border = "none";

// Open pop-up windows when button is clicked
modalBtn.addEventListener("click", function () {
    displayWeeklyStreak(); 
    modal.style.display = "flex";
});

// Close pop-up windows when X is clicked
closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
    console.log("Modal Closed");
});

// Close pop-up windows when clicking outside of it
window.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    } else if (event.target === eventWindow ){
        eventWindow.style.display = "none"; 
        newEventWindow.style.visibility = "hidden";
    } 
});

// Display weekly streak in modal window
function highlightWeeklyStreak() {
    const streakNum = Number(localStorage.getItem("streak") || 1);
    const boxes = document.getElementsByClassName("dayBox");

    // Clear boxes
    for (let b of boxes) b.style.backgroundColor = "";

    const today = new Date().getDay(); // 0–6

    // Highlight BACKWARDS from today
    for (let i = 0; i < streakNum; i++) {
        let index = (today - i + 7) % 7;  
        boxes[index].style.backgroundColor = "#4caf50";
    }

    // Update XP bar
    const percent = Math.min(streakNum, 7) * (100 / 7);
    xpBar.style.width = percent + "%";
    xpBar.textContent = Math.round(percent) + "%";

    dayNum.textContent = `Streak: ${Math.min(streakNum, 7)} / 7`;
}

function updateLoginModal() {
    // Update date text
    document.getElementById("today").textContent =
        new Date().toDateString();

    // Use the proper highlight function
    highlightWeeklyStreak();
}

const rewardButton = document.getElementById('rewardsButton');
const settingsButton = document.getElementById('settingsButton');
const shopButton = document.getElementById('shopButton');


const themeLink = document.getElementById('theme-stylesheet');
let isRedTheme = false;

// Change theme to red when clicking rewards and above or at level 3
shopButton.addEventListener("click", function (e) {
    window.location = "shop.html";
});

// Reset the calendar when clicking on cogwheel
settingsButton.addEventListener("click", function (e) {
    if (confirm("Do you want to reset the calendar? All progress will be lost.")) {
        if (confirm("Are you sure you want to reset all progress?")) {
            localStorage.clear(); // Clears local storage
            location.reload(); // Refreshes the page
        }
    }
});

// Reveals an input box for selecting a month/year
// Once input received, renders the calendar for that month/year
// Click button once to reveal input box, click again to hide it and save changes
const selectMonthButton = document.getElementById("selectMonthButton");
selectMonthButton.addEventListener("click", function () {
    if ( monthPicker.style.display === "block" ) {
        selectMonthButton.style.backgroundColor = "#865DFF";
        selectMonthButton.style.color = "#fff";
        monthPicker.style.display = "none";
        if ( monthPicker.value !== "" ){
            month = monthPicker.value.split("-")[1] - 1;
            year = monthPicker.value.split("-")[0];
            renderCalendar();

        }
    } else {
        selectMonthButton.style.backgroundColor = "#fff";
        selectMonthButton.style.color = "#865DFF";
        monthPicker.style.display = "block";
    }
});

const tutorialWindow = document.getElementById("tutorialSlides");
tutorialWindow.style.display = "none";
const tutorialButton = document.getElementById("tutorialButton");
tutorialButton.addEventListener("click", function () {
    console.log("Tutorial Button Clicked");
    // tutorialWindow.style.visibility = "visible";
    tutorialWindow.style.display = "block";
});

// Render calendar and display event dots when page loads
window.onload = function() {
    // tutorialWindow.style.display = "none";
    monthPicker.style.display = "none";
    renderCalendar();
    displayEvents();
}

const questBtn = document.getElementById("quest-link");
questBtn.addEventListener("click", function () {
    window.location = "quests.html";
});