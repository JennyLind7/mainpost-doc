# <i class="fas fa-calendar"></i> Abwesenheitserfassung 

This component provides a user-friendly interface for recording information on future absences or substitutions.
<br>
The component comprises several steps. Firstly, the employee IDs are retrieved when the page is loaded and displayed dynamically in a drop-down menu. The drop-down list is searchable, which makes it easier to select the employee ID.
<br>
<br>
The actual form contains various input fields such as date, reason, name, district ID, round ID, training and residence ZIP. Error messages for required fields are displayed when filling in the form.
<br>
<br>
The form is submitted using the *createFutureVacancy* method from the *replacementService* module. The form is checked for validity before submission. Error messages are displayed if required fields have not been filled in correctly. Once the form has been successfully submitted, a success message is displayed.
<br>
<br>
![Absence detection](abwesenheit.png)

<details>
<summary>Check out our vue.js VacancyDetection component</summary>

```
<template v-if="loaded">
    <div v-if="successMessage" class="text-center text-green-500 ">
        {{ successMessage }}
    </div>
    <form class="grid lg:grid-cols-2 gap-x-4 gap-y-2" v-else @submit.prevent="submitForm">
        <!-- ... Ihre anderen Eingabefelder ... -->
        <div>
            <input class="border" v-model="searchText" @input="filterEmployeeIds" placeholder="Search Employee ID">
            <select v-model="form.employee_id" id="employee_id" class="border-2 p-2 rounded-lg w-full">
            <option value="" disabled>Select an Employee ID</option>
            <option v-for="id in filteredEmployeeIds" :key="id" :value="id">{{ id }}</option>
            </select>
            <p v-if="errors.employee_id" class="text-red-500">{{ errors.employee_id }}</p>
        </div>


        <div>
            <label for="date">Date</label>
            <input v-model="form.date" type="date" id="date" class="border-2 rounded-lg p-2 w-full">
            <p v-if="errors.date" class="text-red-500">{{ errors.date }}</p>
        </div>

        <div>
            <label for="reason">Reason</label>
            <select v-model="form.reason" id="reason" class="border-2 rounded-lg p-2 w-full">
                <option value=""></option>
                <option value="illness">Illness</option>
                <option value="vacation">Vacation</option>
            </select>
            <p v-if="errors.reason" class="text-red-500">{{ errors.reason }}</p>
        </div>
        <div>
            <label for="name">Name</label>
            <input v-model="form.name" type="text" id="name" class="border-2 rounded-lg p-2 w-full">
        </div>
        <div>
            <label for="district_id">District ID</label>
            <input v-model="form.district_id" type="text" id="district_id" class="border-2 p-2 rounded-lg w-full">
        </div>

        <div>
            <label for="round_id">Round ID</label>
            <input v-model="form.round_id" type="text" id="round_id" class="border-2 p-2 rounded-lg w-full">
            <p v-if="errors.round_id" class="text-red-500">{{ errors.round_id }}</p>
        </div>
        <div>
            <label for="training">Training</label>
            <select v-model="form.training" id="training" class="border-2 p-2 rounded-lg w-full">
                <option value="illness">true</option>
                <option value="vacation">false</option>
            </select>
        </div>

        
        <div>
            <label for="residence_zip">Residence Zip</label>
            <input v-model="form.residence_zip" type="text" id="residence_zip" class="border-2 p-2 rounded-lg w-full">
        </div>

        <button type="submit" class="bg-blue-500 text-white p-2 w-1/2 rounded">Erfassen</button>
    </form>
</template>

<script>
    import { createFutureVacancy } from '@/services/Replacement/replacementService';
    import { fetchEmployeeIds } from '@/services/Employees/employeeService';
    export default {
        data() {
            return {
                form: {
                    district_id: null,
                    round_id: null,
                    training: null,
                    name: '',
                    employee_id: null,
                    reason: '',
                    residence_zip: null,
                    date: null,
                },
                errors: {
                    employee_id: "",
                    date: "",
                    reason: "",
                    round_id: "",
                },
                successMessage: '',
                employeeIds: [],
                loaded: false,
                searchText: '',
            }
        },
        computed: {
            filteredEmployeeIds() {
            // Filter the employee IDs based on the search text
            const search = this.searchText.toLowerCase();
            return this.employeeIds.filter(id => id.toString().includes(search));
            },
        },
        mounted() {
            this.loadEmployeeIds();
        },
        methods: {
            async submitForm() {
                // Validieren Sie das Formular vor der Verarbeitung
                this.errors = this.validateForm(this.form);
                if (!Object.keys(this.errors).length){
                    await createFutureVacancy(this.form);
                    this.successMessage = 'Eintrag erfolgreich vorgenommen';
                }
            },
            validateForm(form) {
                let errors = {};
                if (!form.employee_id){
                    errors.employee_id = 'Bitte geben Sie eine Mitarbeiter ID an';
                }
                if (!form.date){
                    errors.date = 'Bitte geben Sie ein Datum für den Ausfall an';
                }
                if (!form.reason){
                    errors.reason = 'Bitte geben Sie ein Grund für den Ausfall an (vacation/illness)';
                }
                if (!form.round_id){
                    errors.round_id = 'Bitte geben Sie eine Round Id an';
                }
                return errors;
            },
            async loadEmployeeIds() {
                const ids =  await fetchEmployeeIds();
                this.employeeIds = ids.map(employee => employee.id);
                console.log(this.employeeIds);
                this.loaded = true;
            }
        },
    }
</script>

```
</details>