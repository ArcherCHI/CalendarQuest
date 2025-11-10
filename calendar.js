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
        console.log("Selected day:", clickedDate.toDateString());
        document.getElementById("eventDate").textContent = clickedDate.toDateString();

        eventWindow.style.display = "flex";
        
        addXP(10); // FOR TESTING
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

// Event Window functionality
const newEvent = document.getElementById("newEvent");
const eventWindow = document.getElementById("eventWindow");
const closeEventWindow = document.getElementById("closeEventWindow");

newEvent.addEventListener("click", function () {
    eventWindow.style.display = "block";
    console.log("Event Window Opened");
});
closeEventWindow.addEventListener("click", function () {
    eventWindow.style.display = "none";
    console.log("Event Window Closed");
})


// Modal functionality
const modal = document.getElementById("myModal");
const modalBtn = document.getElementById("modalWindow");
const closeBtn = document.getElementById("closeModal");

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
    } else if (event.target === eventWindow )
        eventWindow.style.display = "none";    
});

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

const eventList = document.querySelector(".event-list");
const eventButton = document.querySelector(".event-button");


eventButton.addEventListener("click", function (e) {
    console.log("Event Button Clicked");
    document.getElementsByClassName("event-details").visibility = "visible";
});