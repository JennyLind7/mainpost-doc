## FullCalendar

![Mapbox Logo](fullCalendar-logo.png){ align=right }
<div style="display: flex; align-items: center;">
    <div style="flex: 8;">
     FullCalendar is a powerful JavaScript library used to create and display interactive calendars and event planners in web applications. This library allows to integrate appealing and user-friendly calendar views into their web applications. FullCalendar is particularly useful for applications that need to manage appointments, events and schedules.
    </div>    
</div>
<br>

<details>
  <summary>Klicken Sie hier, um den Code anzuzeigen</summary>
  <pre><code>
    import FullCalendar from '@fullcalendar/vue3'
    import dayGridPlugin from '@fullcalendar/daygrid'
    interactionPlugin from '@fullcalendar/interaction'

    export default {
      components: {
        FullCalendar // make the <FullCalendar> tag available
      },
      data() {
        return {
          calendarOptions: {
            plugins: [dayGridPlugin, interactionPlugin],
            initialView: 'dayGridMonth'
          }
        }
      }
    }
  </code></pre>
</details>

## Mapbox

![Mapbox Logo](mapbox.png){ align=right }
<div style="display: flex; align-items: center;">
    <div style="flex: 8;">
      The delivery areas of the Mainpost Media Group are not only limited to the Würzburg area. To get a better overview of the individual areas in our web application, we work with maps. 
      <br>
      <br>
       Mapbox is a company that provides map services and geospatial tools. It enables developers to integrate custom maps and location services into their applications. Mapbox can be used to create interactive maps, geodata visualisation, location search, route planning and geographic analysis in a variety of applications and websites.
       <br>
       <br>
       To be able to include Mapbox in our Vue.js frontend, the Mapbox-Gl-JS library was added. 
    </div>
</div>
<br>

## OpenweatherMap

![OpenWeatherMap Logo](openweathermap.png){ align=right }
<div style="display: flex; align-items: center;">
    <div style="flex: 8;">
       As postal workers are usually facing the current weather conditions during most of their working day, we consider it an important component to include the current weather conditions in our models in order to make the prediction of downtimes even more accurate.
       <br>
       <br>
        OpenWeatherMap is a service that provides real-time weather data and information. It provides access to various weather data, including current weather conditions, forecasts, historical weather data and climate information.
        <br>
        <br>
    </div>
</div>

### Integration of weather data in the web application

<div style="display: flex; align-items: center;">
    <div style="flex: 8;">     
        <ul>
          <li>
            To retrieve weather data from OpenWeatherMap in our Vue.js application, we used an HTTP client that allows us to send requests to the OpenWeatherMap API and get the corresponding data. In our case, we use the <span style="background-color: fuchsia;"><strong>Axios package</strong></span>, which is a commonly used library for sending HTTP requests in Vue.js applications.
          </li>
        </ul>
        <br>
    </div>
</div>

### Weather data in forecast models


