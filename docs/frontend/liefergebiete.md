# <i class="fas fa-truck"></i> Liefergebiete
## District List

This page provides the user with a table containing information on various districts. Each record in the table represents a district with corresponding details. The "Ansehen" button takes the user to a detailed view of a specific district.
The table is paginated, which means that only a limited number of data records are displayed at once. Below the table is a navigation bar with page numbers and navigation arrows to scroll through the pages and view more districts. The user can switch between pages to view different records.

![District List](district-index.png)

<details>
<summary>Check out our vue.js district list component</summary>

```
<template>
   <div class="mx-8 lg:mx-20">
        <div class="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
              <thead class="text-right">
                  <tr>
                    <th class="bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                    <th class="bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900">Name</th>
                    <th class="hidden lg:table-cell bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      Runden
                    </th>
                    <th class="hidden lg:table-cell bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      Ortschaft
                    </th>
                    <th class="bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900"></th>
                  </tr>
              </thead>
              <tbody v-if="loaded" class="divide-y divide-gray-200 bg-white">
                  <tr  v-for="district in showDistricts" :key="district.id" class="bg-white">
                      <td class="whitespace-nowrap px-6 py-4 text-left text-sm text-gray-500">
                        {{ district.id }}
                      </td>
                      <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                        {{ district.name }}
                      </td>
                      <td class="hidden lg:table-cell whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                        {{ district.round }}
                      </td>
                      <td class="hidden lg:table-cell whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                        <div>
                          <span class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{{ district.realm }}</span>
                        </div>
                      </td>
                      <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                          <a :href="'/district/' + district.id" class="bg-blue-500 cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                              Ansehen
                          </a>
                      </td>
                  </tr>
              </tbody>
              <tbody v-else>
                <td>
                  <div class="flex items-center justify-center">
                    <div class="animate-spin rounded-full h-6 w-6 border-t-4 border-gray-500"></div>
                  </div>
                </td>
                <td>
                  <div class="flex items-center justify-end">
                    <div class="animate-spin rounded-full h-6 w-6 border-t-4 border-gray-500"></div>
                  </div>
                </td>
                <td>
                  <div class="flex items-center justify-end">
                    <div class="animate-spin rounded-full h-6 w-6 border-t-4 border-gray-500"></div>
                  </div>
                </td>
                <td>
                  <div class="flex items-center justify-end">
                    <div class="animate-spin rounded-full h-6 w-6 border-t-4 border-gray-500"></div>
                  </div>
                </td>
                <td>
                  <div class="flex items-center justify-end">
                    <div class="animate-spin rounded-full h-6 w-6 border-t-4 border-gray-500"></div>
                  </div>
                </td>
              </tbody>
          </table>
          <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div>
              <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{{ (itemsPerPage * (currentPage -1)) + 1 }}</span>
                to
                <span class="font-medium">{{ currentPage * itemsPerPage }}</span>
                of
                <span class="font-medium">{{ totalDistricts }}</span>
                results
              </p>
            </div>
            <div class="flex flex-1 justify-between gap-x-3 sm:justify-end">
              <button
                  @click="changePage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="px-3 py-2 text-blue-500 font-bold mx-1 rounded"
                  >
                      <font-awesome-icon icon="chevron-left" />
              </button>
              <!-- Erster Button -->
              <button
                  v-if="showFirstPageButton"
                  @click="changePage(1)"
                  :class="{ 'bg-blue-500': currentPage === 1, 'bg-gray-300': currentPage !== 1 }"
                  class="px-3 py-2 text-white font-bold mx-1 rounded"
              >
                  1
              </button>

              <!-- ... -->
              <!-- Weitere Seiten werden durch ... ersetzt -->
              <span v-if="showEllipsisBefore">...</span>

              <!-- Anzeigen der Seitennummern in der Mitte -->
              <button
                  v-for="pageNumber in displayedPages"
                  :key="pageNumber"
                  @click="changePage(pageNumber)"
                  :class="{ 'bg-blue-500': currentPage === pageNumber, 'bg-gray-300': currentPage !== pageNumber }"
                  class="px-3 py-2 text-white font-bold mx-1 rounded"
              >
                  {{ pageNumber }}
              </button>

              <!-- ... -->
              <!-- Weitere Seiten werden durch ... ersetzt -->
              <span v-if="showEllipsisAfter">...</span>

              <!-- Letzter Button -->
              <button
                  v-if="showLastPageButton"
                  @click="changePage(totalPages)"
                  :class="{
                  'bg-blue-500': currentPage === totalPages,
                  'bg-gray-300': currentPage !== totalPages,
                  }"
                  class="px-3 py-2 text-white font-bold mx-1 rounded"
              >
                  {{ totalPages }}
              </button>
              <button
                  @click="changePage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-2 text-blue-500 font-bold mx-1 rounded"
                  >
                      <font-awesome-icon icon="chevron-right" />
              </button>
            </div> 
          </div>
        </div>  
    </div>
</template>

<script>
    import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
    import { library } from "@fortawesome/fontawesome-svg-core";
    import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
    import {  getDistrictCount, getAllDistricts } from '@/services/Districts/districtService';
    library.add(faChevronLeft, faChevronRight);

    export default {
        data() {
            return {
                showDistricts: [], // Hier werden alle Mitarbeiterdaten gespeichert
                totalDistricts: 0, // Hier werden die paginierten Mitarbeiterdaten gespeichert
                currentPage: 1,
                itemsPerPage: 50,
                loaded: false,
            };
        },
        mounted() {
            this.loadData();
        },
        methods: {
            async onStatusChange() {
                this.currentPage = 1;
                console.log("Changed Reason");
                this.loadData();
            },
            async onTypeChange() {
                this.currentPage = 1;
                console.log("Changed Type");
                this.loadData();
            },
            async loadData() {
                try {
                    // get districts
                    this.showDistricts = await getAllDistricts(
                    (this.currentPage - 1) * this.itemsPerPage,
                    this.currentPage * this.itemsPerPage - 1,
                    );
                    // get district count
                    this.totalDistricts = await getDistrictCount(
                    );
                }catch (error) {
                    console.error('Fehler beim Laden der Daten:', error);
                }
                this.loaded = true;
            },
            changePage(pageNumber) {
            this.currentPage = pageNumber;
            this.loadData();
            },
        },
        computed: {
            totalPages() {
            return Math.ceil(this.totalDistricts / this.itemsPerPage);
            },
            displayedPages() {
            const totalVisiblePages = 3; // Anzahl der sichtbaren Seitennummern in der Mitte
            const halfVisiblePages = Math.floor(totalVisiblePages / 2);

            let startPage = Math.max(this.currentPage - halfVisiblePages, 1);
            let endPage = Math.min(this.currentPage + halfVisiblePages, this.totalPages);

            if (endPage - startPage + 1 < totalVisiblePages) {
                if (this.currentPage <= halfVisiblePages) {
                endPage = Math.min(startPage + totalVisiblePages - 1, this.totalPages);
                } else {
                startPage = Math.max(endPage - totalVisiblePages + 1, 1);
                }
            }

            return Array(endPage - startPage + 1).fill().map((_, index) => startPage + index);
            },
            showFirstPageButton() {
            return this.displayedPages[0] > 1;
            },
            showLastPageButton() {
            return this.displayedPages[this.displayedPages.length - 1] < this.totalPages;
            },
            showEllipsisBefore() {
            return this.displayedPages[0] > 2;
            },
            showEllipsisAfter() {
            return this.displayedPages[this.displayedPages.length - 1] < this.totalPages - 1;
            },
        },
        components: {
            FontAwesomeIcon,
        },
    };
</script>

```
</details>

## District Details

The page displays detailed information about a specific district, including name, alias, number of laps, geographic area, activation date and more. This information is clearly organised in info boxes. There is also a map component that visually displays the geographic location of the district. This allows the user to get both textual and visual insights into the selected district.
<br>
<br>

![District List](district-detail.png)

<details>
<summary>Check out our vue.js DistrictDetail component</summary>

```
<template>

    <div v-if="loaded">
      <ShowInfoBoxes
        :infoArray="[
          { 'label': 'Name', 'value': district[0].name },
          { 'label': 'Alias', 'value': district[0].alias },
          { 'label': 'Runden', 'value': String(district[0].round) },
          { 'label': 'Gegend', 'value': district[0].realm },
          { 'label': 'Aktiv seit', 'value': district[0].active_since },
          { 'label': 'Abgelaufen', 'value': district[0].is_old_district ? 'ja' : 'nein' },
          { 'label': 'Austragungsweise Briefe', 'value': district[0].vehicle_letter },
          { 'label': 'Austragungsweise Zeitungen', 'value': district[0].vehicle_newspaper },
          { 'label': 'Anzahl Briefe', 'value': String(district[0].letters) },
          { 'label': 'Anzahl Zeitungen', 'value': String(district[0].newspapers) },
        ]" 
        :boxHeader="'Informationen zum Bereich'"
        :boxSubHeader="'Für alle Information ausklappen'"
      />
    </div>

    <div v-if="loaded">
        <MapComponent :location="district[0].realm" :zip="districtZips[0]" />
    </div>
</template>
<script>
import {  getSpecificDistrict, getZipsOfDistrict } from '@/services/Districts/districtService';
import MapComponent from '@/components/SubComponents/Map/MapComponent';
import ShowInfoBoxes from '@/components/SubComponents/InfoBoxes/ShowInfoBox';
export default {
    data() {
      return {
          loaded: false,
          districtZips: [],
          district: [],
      };
    },
    components: {
        MapComponent,
        ShowInfoBoxes
    },
    mounted() {
      this.loadData();
    },
    methods: {
      async loadData() {
        const routeParams = this.$route.params;
        try {
          this.district = await getSpecificDistrict(routeParams.id);
          this.districtZips = await getZipsOfDistrict(routeParams.id);

        } catch (error) {
          console.error('Fehler beim Laden der Daten:', error);
        }
        this.loaded = true;
      },
      
    },
  };
</script>

```
</details>
