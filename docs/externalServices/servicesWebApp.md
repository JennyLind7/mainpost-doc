## FullCalendar

![Mapbox Logo](fullCalendar-logo.png){ align=right }
<div style="display: flex; align-items: center;">
    <div style="flex: 8;">
     FullCalendar is a powerful JavaScript library used to create and display interactive calendars and event planners in web applications. This library allows to integrate appealing and user-friendly calendar views into their web applications. FullCalendar is particularly useful for applications that need to manage appointments, events and schedules.
    </div>    
</div>
[<i class="fas fa-folder"></i> Check out our vue.js Calendar components](https://github.com/UHPDome/backend_mainpost/tree/main/frontend/src/components/SubComponents/Calendar){:target="_blank"}

## Mapbox

![Mapbox Logo](mapbox.png){ align=right }
<div style="display: flex; align-items: center;">
    <div style="flex: 8;">
      The delivery areas of the Mainpost Media Group are not only limited to the Würzburg area. To get a better overview of the individual areas in our web application, we work with maps. 
      <br>
      <br>
       Mapbox is a company that provides map services and geospatial tools. It enables developers to integrate custom maps and location services into their applications. Mapbox can be used to create interactive maps, geodata visualisation, location search, route planning and geographic analysis in a variety of applications and websites.
       <br>
       To be able to include Mapbox in our Vue.js frontend, the Mapbox-Gl-JS library was added. 
    </div>
</div>
<details open>
<summary>Implementation of Mapbox in our application</summary>

```
import mapboxgl from 'mapbox-gl';
const token = process.env.VUE_APP_MAPBOX_API_TOKEN
mapboxgl.accessToken = token; 
// console.log('Token:', token);

export default mapboxgl;

```
</details>
[<i class="fas fa-folder"></i> Check out our vue.js Map component](https://github.com/UHPDome/backend_mainpost/blob/main/frontend/src/components/SubComponents/Map/MapComponent.vue){:target="_blank"}


## OpenweatherMap

![OpenWeatherMap Logo](openweathermap.png){ align=right }
<div style="display: flex; align-items: center;">
    <div style="flex: 8;">
       As postal workers are usually facing the current weather conditions during most of their working day, we consider it an important component to include the current weather conditions in our models in order to make the prediction of downtimes even more accurate.
       <br>
       <br>
        OpenWeatherMap is a service that provides real-time weather data and information. It provides access to various weather data, including current weather conditions, forecasts, historical weather data and climate information.
    </div>
</div>
Following api queries to extract weather information from openweathermap have been executed:
<details open>
<summary>Loading weather information for specific area</summary>
```
## get weather information for next five days of specified area
async function getWeatherData(area_id)
```
</details>
<details>
<summary>View our weatherService.js</summary>

```
import axios from 'axios';

export async function getWeatherData(area_id) {
    const apiKey = '768229ab8175e578773e450e2c81e5a3';
    const days = 5;  // Number of days for the forecas
    const location = getLocationCenter(area_id);
    
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&cnt=${days * 8}&units=metric&appid=${apiKey}`;
    // console.log("try");
    let response;
    try {
        response = await axios.get(forecastApiUrl);
        console.log(response);
    } catch (error) {
        console.error('Fehler beim Abrufen der Wetterdaten:', error);
    }
    return response;
}

function getLocationCenter(area_id) {
    var location;
    if (area_id == 1.1) {
        location = "Wuerzburg";
    } else if (area_id == 1.6) {
        location = "Wuerzburg";
    } else if (area_id == 1.7) {
        location = "Rimpar";
    } else if (area_id == 1.3) {
        location = "Gemuenden";
    } else if (area_id == 2.6) {
        location = "Gerolzhofen";
    } else if (area_id == 2.5) {
        location = "Hammelburg";
    } else if (area_id == 2.3) {
        location = "Werneck";
    } else if (area_id == 1.2) {
        location = "Helmstadt";
    } else if (area_id == "FN") {
        location = "Tauberbischofsheim";
    } else if (area_id == 1.4) {
        location = "Kitzingen";
    } else if (area_id == 1.5) {
        location = "Ochsenfurt";
    } else if (area_id == 2.7) {
        location = "Oerlenbach";
    } else if (area_id == 2.8) {
        location = "Stadtlauringen";
    }else if (area_id == 2.4) {
        location = "Oberelsbach";
    }else {
        location = "Wuerzburg";
    }
    return location;
}

```
</details>




