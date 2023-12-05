# <i class="fas fa-clock"></i> Historical
In this section of our application, we take a look at the historical development of employee absences, delivery failures and rounds data. Interactive diagrams illustrate patterns and developments in these areas. The following sections provide insights into historical trends to gain valuable knowledge from past operational developments.

## Absences
This component displays a chart of monthly employee absences based on the selected year and reason (holiday or sickness). Users can select the year and reason via drop-down lists. The Chart.js library is used to create an interactive bar chart that visualises the monthly absences for the selected year and reason.


![Absences](absences-stats.png)
<br>
<br>

[<i class="fas fa-folder"></i> Check out our vue.js MonthlyAbsences component](https://github.com/UHPDome/backend_mainpost/blob/main/frontend/src/components/Views/Absences/MonthlyAbsences.vue){:target="_blank"}


## Delivery Failures
This component shows a chart of monthly failures related to failed deliveries for a selected year and a selected reason (holiday, illness or not delivered). Users can select the year and reason via drop-down lists. The chart is also created with Chart.js and visualises the monthly downtime for the selected year and reason.
<br>
<br>
![Failed Delivery](vacancy-stats.png)
<br>
<br>
[<i class="fas fa-folder"></i> Check out our vue.js YearlyVacancies component](https://github.com/UHPDome/backend_mainpost/blob/main/frontend/src/components/Views/Vacancies/YearlyVacancies.vue){:target="_blank"}


## Rounds
This Vue.js component creates a page with statistics that contains two charts. The statistics show delivery failures per year and delivery failures per round code.
<br>
<br>
![Rounds Statistics](round-stats.png)
<br>
<br>
[<i class="fas fa-folder"></i> Check out our vue.js RoundStatistics component](https://github.com/UHPDome/backend_mainpost/blob/main/frontend/src/components/Views/Rounds/RoundStatistics.vue){:target="_blank"}
