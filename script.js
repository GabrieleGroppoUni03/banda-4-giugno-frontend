// Autore: Gabriele Groppo
const BASE_URL = "https://strapi.gabrielegroppo.it"; //Strapi
const API_BASE_URL = BASE_URL + "/api"; //Strapi
// Carica i componenti comuni
fetch("components/footer.html")
  .then(response => response.text())
  .then(data => document.getElementById("footer-container").innerHTML = data);

fetch("components/navbar.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("navbar-container").innerHTML = data;
  });

const map = {
  "Concerto": "Concerti",
  "Servizio": "Servizi",
  "Cena": "Cene",
  "Tutto": "Tutto"
};

//getLatestPastEvent();
async function getLatestPastEvent() {
  try {
    const today = new Date(Date.now()).toISOString().split('T')[0];
    console.log(today);
    const response = await fetch(`${BASE_URL}/api/events?filters[Date][$lt]=${today}&sort=Date:DESC&pagination[limit]=1&populate=*`);
    if (!response.ok) throw new Error("Errore nel recupero dei dati");

    const json = await response.json();
    const data = json.data[0];  // Otteniamo l'oggetto data
    console.log(data);

    return data;

  } catch (error) {
    console.error("Errore:", error);
    throw error;
  }
}

async function getUpcomingEvents() {
  try {
    const today = new Date(Date.now()).toISOString().split('T')[0];

    const response = await fetch(`${BASE_URL}/api/events?filters[Date][$gte]=${today}&sort=Date:ASC&populate=*`);
    console.log("Risposta: " + response);
    if (!response.ok) throw new Error("Errore nel recupero dei dati");
    const json = await response.json();
    const data = json.data;  // Otteniamo l'oggetto data
    return data;
  } catch (error) {
    console.error("Errore:", error);
    throw error;
  }
}

//getEventsByYear(2025);
async function getEventsByYear(year) {
  try {
    const response = await fetch(`${BASE_URL}/api/events?filters[Date][$contains]=${year}&sort=Date:ASC&populate=*`);
    if (!response.ok) throw new Error("Errore nel recupero dei dati");

    const json = await response.json();
    const data = json.data;  // Otteniamo l'oggetto data
    console.log(data);
    return data;
  } catch (error) {
    console.error("Errore:", error);
    throw error;
  }
}

//getEventsByYear(2025);
async function getPastEventsByYear(year) {
  try {
    const today = new Date(Date.now()).toISOString().split('T')[0];
    console.log(today);
    const response = await fetch(`${BASE_URL}/api/events?filters[Date][$lt]=${today}&filters[Date][$contains]=${year}&sort=Date:ASC&populate=*`);
    if (!response.ok) throw new Error("Errore nel recupero dei dati");

    const json = await response.json();
    const data = json.data;  // Otteniamo l'oggetto data
    console.log(data);
    return data;
  } catch (error) {
    console.error("Errore:", error);
    throw error;
  }
}


async function getEventsByYearAndCategory(year, category) {
  try {
    console.log(category);
    //just the first letter in uppercase
    //category = category.charAt(0).toUpperCase() + category.slice(1);
    const response = await fetch(`${BASE_URL}/api/events?filters[Date][$contains]=${year}&filters[EventType]=${category}&sort=Date:ASC&populate=*`);
    if (!response.ok) throw new Error("Errore nel recupero dei dati");

    const json = await response.json();
    const data = json.data;  // Otteniamo l'oggetto data
    //console.log(data);
    return data;
  } catch (error) {
    console.error("Errore:", error);
    throw error;
  }
}


async function getPastEventsByYearAndCategory(year, category) {
  try {
    console.log(category);
    const today = new Date(Date.now()).toISOString().split('T')[0];
    console.log(today);
    //just the first letter in uppercase
    //category = category.charAt(0).toUpperCase() + category.slice(1);
    const response = await fetch(`${BASE_URL}/api/events?filters[Date][$lt]=${today}&filters[Date][$contains]=${year}&filters[EventType]=${category}&sort=Date:ASC&populate=*`);
    if (!response.ok) throw new Error("Errore nel recupero dei dati");

    const json = await response.json();
    const data = json.data;  // Otteniamo l'oggetto data
    //console.log(data);
    return data;
  } catch (error) {
    console.error("Errore:", error);
    throw error;
  }
}


//filterEvents();
async function filterEvents(year, category) {
  console.log(year + " " + category);
  let events = category != 'Tutto' ? await getPastEventsByYearAndCategory(year, category) : await getPastEventsByYear(year);
  document.getElementById('events-year').innerText = map[category] + " - " + year;
  document.getElementById('events-containter').innerHTML = "";
  events.forEach(event => {
    console.log(event);
    let eventHtml = generateEventCard(event, true, false);
    document.getElementById('events-containter').innerHTML += eventHtml;
  });
}

//filterEvents();
// Function to show/hide events based on the selected year

var year = 2025;
var category = 'Tutto';
// Function to filter events by dropdown selection
function filterByYear(new_year) {
  year = new_year;
  filterEvents(new_year, category);
}

function filterByCategory(new_category) {
  category = new_category;
  filterEvents(year, new_category);
}

// Used to toggle the menu on small screens when clicking on the menu button
function mini_munu() {
  var x = document.getElementById("mini_nav_bar");
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
  } else {
    x.className = x.className.replace(" w3-show", "");
  }
}

function getIntalianDateTime(old_date, old_time) {
  let date = new Date(old_date);
  if (isNaN(date.getTime())) {
    console.error("Data evento non valida:", Date);
  } else {
    let opzioniData = { day: "2-digit", month: "long", year: "numeric" };
    let dataFormattata = date.toLocaleDateString("it-IT", opzioniData); // Formato italiano: "dd mese yyyy"
    if (old_time) {
      let time = new Date("1970-01-01T" + old_time).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
      dataFormattata += " ore " + time;
    }
    return dataFormattata;
  }
}

function loadCategories() {
  let categories = ["Tutto", "Concerto", "Servizio", "Cena"];

  let select = document.getElementById("memCategories");
  select.innerHTML = "";
  categories.forEach(category => {
    let option = document.createElement('option');
    option.value = category;
    option.text = map[category];
    select.appendChild(option);
  });
}

function loadYears() {
  const start = '2022';
  const end = '2025';
  let select = document.getElementById('memYears');
  for (let year = end; year >= start; year--) {
    let option = document.createElement('option');
    option.value = year;
    option.text = year;
    select.appendChild(option);
  }
}

async function setUpcomingEventsSection() {
  let upcomingEvents = await getUpcomingEvents();
  console.log(upcomingEvents);
  let eventsContainer = document.getElementById('next-events');
  eventsContainer.innerHTML = '';
  console.log(upcomingEvents);
  upcomingEvents.forEach(event => {
    let eventHtml = generateEventCard(event, false, false);
    eventsContainer.innerHTML += eventHtml;
  });
}

async function setLastEventSection() {
  let lastEvent = await getLatestPastEvent();
  let lastEventContainer = document.getElementById('last-event-container');
  let lastEventHtml = generateEventCard(lastEvent, true, true);
  lastEventContainer.innerHTML = lastEventHtml;
}

function generateEventCard(event, expired, big) {
  let date = getIntalianDateTime(event.Date, event.Time);
  let googleDate = formatDateForGoogleCalendar(event.Date, event.Time);
  let googleEndDate = getEndDateTime(event.Date, event.Time);
  let cardContent;
  let wrapperClass = big ? "w3-col s12" : "w3-third w3-margin-bottom";
  
  // Create action button or description based on event status
  let actionContent = expired 
    ? `<p class="w3-white event-description">${event.ShortDescription}</p>` 
    : `<a id="google-calendar-link-${event.documentId}" 
         href="${googleCalendarUrl(event.Title, event.Location, event.ShortDescription, googleDate, googleEndDate, event.documentId)}" 
         class="w3-button w3-round w3-margin-bottom gold-hover" 
         style="background-color: #A0B9E9; color: black; text-decoration: none; display: inline-block; transition: all 0.3s ease;"
         target="_blank">Salva</a>`;

  // Build the card HTML with enhanced styling
  cardContent = `
    <div class="${wrapperClass}">
      <div class="event w3-card w3-hover-shadow" style="border-radius: 8px; overflow: hidden; transition: all 0.3s ease;">
        <div class="event-image-container" style="position: relative; overflow: hidden;">
          <img src="${BASE_URL}${event.Cover.formats.medium.url}" 
               alt="${event.Cover.alternativeText}" 
               style="width: 100%; height: 200px; object-fit: cover; transition: transform 0.5s ease;" 
               class="w3-hover-opacity event-image"
               onclick="window.location.href='event.html?id=${event.documentId}'">
          <div class="event-date-badge" style="position: absolute; top: 10px; right: 10px; background-color: rgba(20, 18, 24, 0.8); color: #A0B9E9; padding: 8px; border-radius: 4px; font-size: 14px;">
            ${date}
          </div>
        </div>
        <div class="w3-container w3-white" style="padding: 16px;">
          <h4 class="w3-white title" style="margin-top: 0; font-weight: bold; margin-bottom: 10px;">${event.Title}</h4>
          <p class="w3-opacity w3-white location" style="display: flex; align-items: center; margin-bottom: 15px;">
            <span style="margin-right: 5px;">📍</span> ${event.Location}
          </p>
          <div class="event-action" style="margin-top: auto; background-color: white;">
            ${actionContent}
          </div>
        </div>
      </div>
    </div>`;

  return cardContent;
}
function googleCalendarUrl(title, location, details, start, end, id) {
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;
}

function formatDateForGoogleCalendar(dateStr, timeStr) {
  // Parse the date and time
  const dateParts = dateStr.split('-'); // Assuming date format is YYYY-MM-DD
  
  // Create a date object (using local timezone)
  let date;
  
  if (timeStr) {
    const timeParts = timeStr.split(':'); // Assuming time format is HH:MM
    date = new Date(
      parseInt(dateParts[0]), // Year
      parseInt(dateParts[1]) - 1, // Month (0-based in JS)
      parseInt(dateParts[2]), // Day
      parseInt(timeParts[0]), // Hour
      parseInt(timeParts[1])  // Minute
    );
  } else {
    date = new Date(
      parseInt(dateParts[0]), // Year
      parseInt(dateParts[1]) - 1, // Month (0-based in JS)
      parseInt(dateParts[2])  // Day
    );
  }
  
  // Format to YYYYMMDDTHHMMSSZ format needed by Google Calendar
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${year}${month}${day}T${hours}${minutes}00`;
}

function formatDateForGoogleCalendar(dateStr, timeStr) {
  // Parse the date and time
  const dateParts = dateStr.split('-'); // Assuming date format is YYYY-MM-DD
  
  // Create a date object (using local timezone)
  let date;
  
  if (timeStr) {
    const timeParts = timeStr.split(':'); // Assuming time format is HH:MM
    date = new Date(
      parseInt(dateParts[0]), // Year
      parseInt(dateParts[1]) - 1, // Month (0-based in JS)
      parseInt(dateParts[2]), // Day
      parseInt(timeParts[0]), // Hour
      parseInt(timeParts[1])  // Minute
    );
  } else {
    date = new Date(
      parseInt(dateParts[0]), // Year
      parseInt(dateParts[1]) - 1, // Month (0-based in JS)
      parseInt(dateParts[2])  // Day
    );
  }
  
  // Format to YYYYMMDDTHHMMSSZ format needed by Google Calendar
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${year}${month}${day}T${hours}${minutes}00`;
}

function getEndDateTime(dateStr, timeStr) {
  // Parse the date and time
  const dateParts = dateStr.split('-'); // Assuming date format is YYYY-MM-DD
  
  // Create a date object
  let startDate;
  
  if (timeStr) {
    const timeParts = timeStr.split(':'); // Assuming time format is HH:MM
    startDate = new Date(
      parseInt(dateParts[0]), // Year
      parseInt(dateParts[1]) - 1, // Month (0-based in JS)
      parseInt(dateParts[2]), // Day
      parseInt(timeParts[0]), // Hour
      parseInt(timeParts[1])  // Minute
    );
  } else {
    startDate = new Date(
      parseInt(dateParts[0]), // Year
      parseInt(dateParts[1]) - 1, // Month (0-based in JS)
      parseInt(dateParts[2])  // Day
    );
  }
  
  // Add 2 hours to the start date
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 2);
  
  // Format to YYYYMMDDTHHMMSSZ format needed by Google Calendar
  const year = endDate.getFullYear();
  const month = (endDate.getMonth() + 1).toString().padStart(2, '0');
  const day = endDate.getDate().toString().padStart(2, '0');
  const hours = endDate.getHours().toString().padStart(2, '0');
  const minutes = endDate.getMinutes().toString().padStart(2, '0');
  
  return `${year}${month}${day}T${hours}${minutes}00`;
}

document.addEventListener('DOMContentLoaded', function () {
  const scrollIndicator = document.querySelector('.scroll-indicator-container');

  function hideScrollIndicator() {
      if (window.scrollY > 100) {
          scrollIndicator.style.opacity = '0';
          scrollIndicator.style.transition = 'opacity 0.5s ease';
          
          setTimeout(() => {
              window.removeEventListener('scroll', hideScrollIndicator);
          }, 500);
      }
  }

  window.addEventListener('scroll', hideScrollIndicator);
  
  // Funzionalità click per lo scroll arrow
  const scrollArrow = document.querySelector('.scroll-indicator');
  scrollArrow.style.cursor = 'pointer';
  scrollArrow.style.pointerEvents = 'auto';

  scrollArrow.addEventListener('click', function () {
      document.getElementById('locandina').scrollIntoView({ behavior: 'smooth' });
  });
  
  // Funzione per aggiungere l'evento al calendario Google
  document.getElementById('add-to-calendar').addEventListener('click', function(e) {
      e.preventDefault();
      
      // Informazioni evento
      const eventTitle = "Concerto della Battaglia - Banda 4 Giugno 1859";
      
      // Formatta date per Google Calendar
      const startDate = new Date(2025, 5, 4, 21, 0);
      const endDate = new Date(2025, 5, 4, 23, 0);
      
      const formatDate = (date) => {
          return date.toISOString().replace(/-|:|\.\d+/g, '');
      };
      
      const startFormatted = formatDate(startDate);
      const endFormatted = formatDate(endDate);
      
      // Crea parametri per Google Calendar
      const location = "Villa Naj Oleari, Magenta";
      const details = "Concerto della Battaglia della Banda 4 Giugno 1859. Dirige il Maestro Michela Fassi. Ingresso libero. In caso di maltempo il concerto si svolgerà al Teatro Lirico di Magenta.";
      
      // Crea URL per Google Calendar
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startFormatted}/${endFormatted}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
      
      // Apri nuova finestra per Google Calendar
      window.open(googleCalendarUrl, '_blank');
  });
});