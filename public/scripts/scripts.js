const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
}

const navLink = document.querySelectorAll(".nav-link");

navLink.forEach(n => n.addEventListener("click", closeMenu));

function closeMenu() {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}

// When the user scrolls the page, execute myFunction
window.onscroll = function() {myFunction()};

// Get the navbar
var navbar = document.getElementById("stickyheader");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
    if (window.pageYOffset >= sticky) {
      navbar.classList.add("sticky");
      navbar.classList.add("dark");
    } else {
      navbar.classList.remove("sticky");
      navbar.classList.remove("dark");
    }
}


document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: 'getcalendar',
      eventClick: function(info) {
        // console.log(info.event.id);
        // console.log(info.event.title);
        let date = info.event.start;
        let parsedDate = formatDate(date);
        document.getElementById("event_date").value = parsedDate;
        document.getElementById("hide").submit();
        // window.location.href = '/events';
      }
  });
  calendar.render();
});

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

let loadMoreBtn = document.getElementById("load-more-btn");
let currentItem = 1;

loadMoreBtn.onclick = () => {
let boxes =[...document.querySelectorAll('.news_wrapper')];
console.log(boxes);

for (var i = currentItem; i < currentItem + 1; i++) {
boxes[i].style.display = "inline-block";
}

currentItem += 1;

if (currentItem >= boxes.length) {
    loadMoreBtn.style.display = "none";
    }

}
