# <i class="fas fa-database"></i> Planung

<span style="color:red;">Einleitung für diese Kapitel einfügen</span><br><br>
<span style="color:red;">Link prüfen OpenWeatherMap</span>


## Witterungsbedingte Ausfälle
In this predictive view, an advanced model with multiple time series forecasts outages for the next five days. Real-time weather data from [OpenWeatherMap](/docs/externalServices/servicesWebApp.md) is seamlessly integrated, providing valuable insight into weather conditions and their impact on outages.

The user-friendly interface can be customised by selecting one of 16 different areas via a drop-down menu. This feature allows users to focus on specific geographic regions, making it easier to implement targeted proactive measures in response to expected outage patterns.

The user interface provides a dual forecast: a comprehensive weather forecast for the next five days and a visual representation of expected outages based on correlated weather conditions. This forecast is presented through an intuitive line graph that helps users recognise patterns and make informed decisions.

By integrating state-of-the-art forecasting models with real-time weather data, our platform not only improves the accuracy of outage prediction, but also empowers users with the knowledge to proactively address potential issues. This integrated approach encourages a proactive response to outage scenarios and contributes to a more resilient and better prepared infrastructure.
<br>
<br>
![Absences Weather based](weather-based.png)
<br>
<br>
<details>
<summary>Check out our vue.js VacancyPrediction component</summary>

```
<template>
    <FiveDayForecast @area-changed="handleAreaChanged" />
    
    <div class="mt-12" v-if="loadedChart">
        <SimpleLineChart :injectedVacancyPrediction="absences" :injectedStartDate="startDate" :injectedEndDate="endDate" />
    </div>

</template>
  

<script>

    import FiveDayForecast from "@/components/SubComponents/Weather/FiveDayForecast"
    import { findWeatherBasedReplacements } from '@/services/Absences/absencePredictionService'
    import SimpleLineChart from "@/components/SubComponents/Charts/LineCharts/SimpleLineChart"


    export default {
        components: {
            FiveDayForecast,
            SimpleLineChart,
        },
        data() {
            return {
                absences: [],
                loadedChart: false,
                startDate: "",
                endDate: "",
                area_id: "2.2",
            };
        },
        mounted() {
            this.loadData();
        },
        methods: {
            async loadData() {
                this.loadedChart = false;
                this.absences = await findWeatherBasedReplacements(this.area_id, "");
                let today = new Date();
                let fiveDaysLater = new Date();
                fiveDaysLater.setDate(today.getDate() + 4); 

                // Funktion zum Formatieren des Datums als 'dd-mm-yyyy'
                let formatMyDate = (date) => {
                    let d = new Date(date),
                        month = '' + (d.getMonth() + 1), // Monate von 0 indexiert
                        day = '' + d.getDate(),
                        year = d.getFullYear();

                    // Vorabfüllung kleinerer Monate und Tage mit 0
                    if(month.length < 2) 
                        month = '0' + month;
                    if(day.length < 2) 
                        day = '0' + day;
                    
                    return [day, month, year].join('-');
                }

                this.startDate = formatMyDate(today);
                this.endDate = formatMyDate(fiveDaysLater);
                this.loadedChart = true;
            },
            async getPredictions() {
                this.loadData();
            },
            handleValidStartDate(date) {
                this.startDate = date;
            },
            handleValidEndDate(date) {
                this.endDate = date;
            },
            handleAreaChanged(newAreaId) {
                // Hierhin kommt der neue Wert von area_id
                this.area_id = newAreaId;
                this.loadData();
            }
        }
    }

    
</script>

```
</details>
<span style="color:red;">Auf Modellperformance verweisen</span>

## Allgemeine Ausfälle

In this advanced forecast view, users are provided with the ability to forecast outages up to three years into the future, providing strategic insights for long-term planning. <br> <br>
It is important to emphasise that weather-related considerations are excluded due to the inherent unpredictability over longer periods of time. The view includes filter options at the top, allowing users to refine forecasts based on specific reasons such as sickness or holidays, as well as date ranges. This functionality proves invaluable for gaining a comprehensive overview of future periods and making proactive adjustments to employee scheduling to respond to anticipated patterns of absence.

![General Outages](long-time-prediction.png)
<details>
<summary>Check out our vue.js AbsencePredictionFiltered component</summary>

```
<template>


    <div>
        <div class="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:max-w-7xl lg:px-8">

            <section aria-labelledby="filter-heading" class="border-t border-gray-200 py-6">

                <div class="grid grid-cols-2 gap-y-4 md: gap-y-0 md:flex items-center justify-between">
                    <div class="relative inline-block text-left">
                        <label for="startDate" class="block text-xs text-gray-700">Startdatum:</label>
                        <div>
                            <button @click="showButton('startDate')" type="button" class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900" id="mobile-menu-button" aria-expanded="false" aria-haspopup="true">
                                {{startDate}}
                                <svg v-show="showStart" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="-mr-1 ml-1 h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-500">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                </svg>
                                <svg v-show="!showStart" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="-mr-1 ml-1 h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-500">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>

                            </button>
                        </div>

                        <div v-show="showStart" class="absolute left-0 z-10 mt-2 w-72 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="mobile-menu-button" tabindex="-1">
                            <DateInput v-model="this.startDate" @dateValid="handleValidStartDate" />
                        </div>
                    </div>
                    <div class="relative inline-block text-left">
                        <label for="endstartDate" class="block text-xs text-gray-700">Enddatum:</label>
                        <div>
                            <button @click="showButton('endDate')" type="button" class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900" id="mobile-menu-button" aria-expanded="false" aria-haspopup="true">
                                {{ endDate }}
                                <svg v-show="showEnd" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="-mr-1 ml-1 h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-500">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                </svg>
                                <svg v-show="!showEnd" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="-mr-1 ml-1 h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-500">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>
                        </div>

                        <div v-show="showEnd" class="absolute left-0 z-10 mt-2 w-72 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="mobile-menu-button" tabindex="-1">
                            <DateInput v-model="this.endDate" @dateValid="handleValidEndDate" />
                        </div>
                    </div>
                    <div class="relative inline-block text-left">
                        <label for="reason" class="block text-xs text-gray-700">Grund:</label>
                        <div>
                            <button @click="showButton('reason')" type="button" class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900" id="mobile-menu-button" aria-expanded="false" aria-haspopup="true">
                                <span v-if="reason == 'illness'"> Krankheit</span>
                                <span v-else> Urlaub </span>
                               
                                <svg v-show="showReason" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="-mr-1 ml-1 h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-500">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                </svg>
                                <svg v-show="!showReason" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="-mr-1 ml-1 h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-500">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>
                        </div>

                        <div v-show="showReason" class="absolute left-0 z-10 mt-2 w-72 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="mobile-menu-button" tabindex="-1">
                            <ul class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" tabindex="-1" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3">
                                <li 
                                    class="text-gray-900 cursor-pointer relative select-none py-2 pl-3 pr-9" 
                                    id="listbox-option-0" 
                                    role="option"
                                    @click="chooseReason('illness')"
                                    :class="{ 'bg-primary-400 text-white': reason == 'illness' }"

                                >
                                    <!-- Selected: "font-semibold", Not Selected: "font-normal" -->
                                    <span class="font-normal block truncate">Krankheit</span>
                                    
                                </li>
                                <li 
                                    class="text-gray-900 cursor-pointer relative select-none py-2 pl-3 pr-9" 
                                    id="listbox-option-0" 
                                    role="option"
                                    @click="chooseReason('vacation')"
                                    :class="{ 'bg-primary-400 text-white': reason == 'vacation' }"
                                >
                                    <!-- Selected: "font-semibold", Not Selected: "font-normal" -->
                                    <span class="font-normal block truncate">Urlaub</span>
                                </li>

                            </ul>
                        </div>
                    </div>
                    <div class="relative inline-block text-left">
                        <label for="area" class="block text-xs text-gray-700">Area Code:</label>
                        <div>
                            <button @click="showButton('areaId')" type="button" class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900" id="mobile-menu-button" aria-expanded="false" aria-haspopup="true">
                                {{area_id }}
                                <svg v-show="showArea" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="-mr-1 ml-1 h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-500">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                </svg>
                                <svg v-show="!showArea" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="-mr-1 ml-1 h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-500">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>
                        </div>

                        <div v-show="showArea" class="absolute left-0 z-10 mt-2 w-72 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="mobile-menu-button" tabindex="-1">
                            <AreaList @update-chosen-area="handleUpdateChosenArea"/>
                        </div>
                    </div>
                    <button @click="getPredictions" class="cursor-pointer bg-blue-500 text-white rounded px-4 py-1 max-h-[45px] col-span-2">Ausfälle berechnen</button>
                </div>
            </section>
        </div>
    </div>
    <div class="mt-12" v-if="loadedChart">
        <SimpleLineChart :injectedVacancyPrediction="absences" :injectedStartDate="startDate" :injectedEndDate="endDate" />
    </div>

</template>

<script>
    import DateInput from "@/components/SubComponents/Inputs/DateInput"
    import AreaList from "@/components/SubComponents/Inputs/AreaList"
    import { getTimelinePredictions } from "@/services/Absences/absencePredictionService"
    import SimpleLineChart from "@/components/SubComponents/Charts/LineCharts/SimpleLineChart"


    export default {

        components: {
            DateInput,
            AreaList,
            SimpleLineChart
        },

        data() {
            return {
                area_id: "2.2", 
                reason: "illness", 
                startDate: "01-01-2024",
                endDate: "07-01-2024",
                showStart: false, 
                showEnd: false,
                showArea: false,
                showReason: false,
                absences: [],
                loadedChart:false,
            };
        },
        mounted() {
            this.getPredictions();
        },

        methods: {
            showButton(type) {
                if (type == "endDate") {
                    this.showEnd = !this.showEnd;
                } else if (type == "startDate") {
                    this.showStart = !this.showStart;
                }
                else if (type == "reason") {
                    this.showReason = !this.showReason;
                }
                else if (type == "areaId") {
                    this.showArea = !this.showArea;
                }
            },
            chooseReason(reason) {
                this.reason = reason;
                this.showReason = !this.showReason;
            },
            async getPredictions() {
                this.loadedChart = false;
                this.absences = await getTimelinePredictions(
                    this.startDate, this.endDate, this.reason, this.area_id,
                );
                console.log(this.absences);
                this.loadedChart = true;
            },
            handleValidStartDate(date) {
                this.startDate = date;
            },
            handleValidEndDate(date) {
                this.endDate = date;
            },
            handleUpdateChosenArea(area) {
                this.area_id = area;
                this.showArea = !this.showArea;
            }
        }

    
    }

</script>

```
</details>

<span style="color:red;">Auf Modellperformance verweisen</span>

## Ersatzarbeitskräfte
This comprehensive view allows users to track the absence of individual employees on specific days and understand the reasons for each absence. The information is dynamically updated as soon as absences are recorded by the previously introduced components. The view makes it possible to switch between a weekly and daily perspective, providing a differentiated understanding of absence patterns.

Additionally, the view provides access to information on designated replacements, which streamlines the process of ensuring coverage during employee absences. This feature-rich view enhances workforce management by providing real-time insight into employee availability and enabling proactive planning for smooth operations.

![Replacements](vacancies-future.png)

When the user selects one of the buttons above, two different approaches are available for selecting a replacement. The first approach utilises a machine learning model to intelligently determine the most suitable substitutes based on various factors. This advanced model takes into account the employee's skills, past performance and other relevant parameters to optimise the selection process.

Alternatively, users can decide in favour of the traditional company approach, where one of the previous employees traces the path. This utilises the experience of previous employees to find a reliable and efficient replacement and ensure continuity of service delivery.

![Found Replacements](found-replacement.png)

<details>
<summary>Check out our vue.js EmployeeAllocation component</summary>

```
<template>
    <ListCalendar />

</template>

<script>
    import  ListCalendar  from "@/components/SubComponents/Calendar/ListCalendar";

    export default {
        data() {
            return {
                replacement: [],
            }
        },
        mounted() {
            this.loadData();
        },
        methods: {
            async loadData() {
            }
        },
        components: {
            ListCalendar,
        },
    }


</script>

```
</details>

<span style="color:red;">Auf Modellperformance verweisen</span>

## Modell Performance

In this final view of our web application, users can explore and analyse the performance of machine learning models through visual representations. By using MLflow to track models, performance metrics are presented using embedded images that provide detailed insights into key parameters. MLflow's specialised features, such as model tracking, make the view an informative and visually engaging experience. Users can seamlessly evaluate and compare the efficiency of different machine learning models.
These models are predictions for weather-related employee shortages. 

### Feature Influence of the weather data
![Feature Influence](performance.jpeg)

### Effect of the parameters on performance
![Effect on performance](lgbmplot.png)

### Probabilistic prediction
The model performance is compared using Area_ID and the reason for failure as a probabilistic prediction. This means that we do not limit the predictions of the models to whether a failure will occur or not, but also analyse the probabilities for different reasons in different areas. 
<br> <br>
This probabilistic approach makes it possible to gain deeper insights into the predictive accuracy of the models both at the level of working areas (Area_ID) and on the basis of different reasons for failure. Through this analysis, patterns and trends can be identified that help to better understand the strengths and weaknesses of the models in different contexts and to make targeted optimisations.

![Found Replacements](probibalistic_forecast.png)
