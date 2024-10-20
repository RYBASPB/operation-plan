<script setup lang="ts">
import { onMounted, Ref, ref, watch } from 'vue'
import DataTable, { DataTableRowReorderEvent } from 'primevue/datatable'
import Column from 'primevue/column'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import ButtonGroup from 'primevue/buttongroup'
import DatePicker from 'primevue/datepicker'
import FloatLabel from 'primevue/floatlabel'
import { Supabase } from '../services/storage/supabase.ts'
import { Patient } from '../services/patient/Patient.ts'
import { dataURItoBlob, makeScreenshot } from '../services/screenshotMaker/screenshotMaker.ts'
import { supabase } from '../supabase.ts'
import EditPatient from './Patients/EditPatient.vue'

const operations: Ref<Patient[]> = ref([])
const selectedPatient = ref()
const showPatientDialog = ref(false)
const patientAction = ref('')

const openPatientEditor = (patient: Patient) => {
  patientAction.value = 'Изменить'
  selectedPatient.value = patient
  showPatientDialog.value = !showPatientDialog.value
}

const openPatientCreator = () => {
  patientAction.value = 'Добавить'
  selectedPatient.value = {}
  showPatientDialog.value = !showPatientDialog.value
}

const getTomorrowDate = () => {
  const today = new Date()
  const tomorrow = new Date(today.toDateString())
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow
}

const forScreenshot = ref(false)

const saveTableToImage = async () => {
  forScreenshot.value = true
  const element = document.getElementById('screenshotElement')
  if (element) {
    const image = await makeScreenshot(element)
    const blob = dataURItoBlob(image)
    await supabase.functions.invoke('telegram-sender', {
      body: blob,
    })
  }
  forScreenshot.value = false
}

const date = ref(getTomorrowDate())

onMounted(async () => {
  await fetchPatientsByDate()
})

watch(
  date,
  fetchPatientsByDate,
)

function afterEdit() {
  showPatientDialog.value = false
  selectedPatient.value = {}
  patientAction.value = ''
  fetchPatientsByDate()
}

async function fetchPatientsByDate() {
  console.log('fetching patients')
  const { data: allPatients, error } = await repo.GetAllByDate(date.value)
  if (error) {
    console.error(error)
    return
  }
  if (allPatients) {
    operations.value = allPatients
  }
}

const reorderPatients = async () => {
  operations.value = operations.value.map((op, i) => {
    op.order_by_date = i + 1
    return op
  })
  await repo.Reorder(operations.value)
}

const onRowReorder = async (event: DataTableRowReorderEvent) => {
  operations.value = event.value
  await reorderPatients()
}

const deletePatient = (patient: Patient) => {
  const id = patient.id
  operations.value = operations.value.filter(p => p.id != id)
  repo.Delete(patient.id)
  selectedPatient.value = {}
  reorderPatients()
}

const repo = new Supabase()

</script>

<template>
  <div class="table-container">
    <Toolbar>
      <template #start>
        <ButtonGroup>
          <Button @click="openPatientCreator">
            Добавить пациента
          </Button>
        </ButtonGroup>
      </template>

      <template #center>
        <Button @click="saveTableToImage">
          Сделать Screenshot
        </Button>
      </template>

      <template #end>
        <FloatLabel variant="on">
          <DatePicker
            v-model="date"
            date-format="dd.mm.yy"
            input-id="date_picker"
          />
          <label for="date_picker">Дата операционного дня</label>
        </FloatLabel>
      </template>
    </Toolbar>
    <DataTable
      id="screenshotElement"
      data-key="id"
      :value="operations"
      scrollable
      style="min-width: 60rem;"
      class="table__body"
      @row-reorder="onRowReorder"
    >
      <template #header>
        <span class="table-header">План операций на {{ date.toLocaleDateString() }}</span>
      </template>
      <template #loading>
        <div>Загрузка</div>
      </template>
      <Column
        :hidden="forScreenshot"
        row-reorder
        :exportable="false"
      />

      <Column
        frozen
        field="name"
        header="ФИО"
      />
      <Column
        field="age"
        header="Возраст"
      />
      <Column
        field="case_number"
        header="№ и/б"
      />
      <Column
        field="inf"
        header="Инф"
      />
      <Column
        field="diagnosis"
        header="Диагноз"
      />
      <Column
        field="operation"
        header="Операция"
      />
      <Column
        field="anesthesia"
        header="Анестезия"
      />
      <Column
        field="team"
        header="Бригада"
      />
      <Column
        :hidden="forScreenshot"
        style="width: 15rem;"
      >
        <template #body="rowData">
          <div class="table__button-container">
            <Button
              severity="secondary"
              @click="openPatientEditor(rowData.data)"
            >
              Изменить
            </Button>
            <Button
              severity="danger"
              @click="deletePatient(rowData.data)"
            >
              Удалить
            </Button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
  <EditPatient
    :props-data="selectedPatient"
    :show-patient-dialog="showPatientDialog"
    :title="patientAction"
    @after-edit="afterEdit"
    @on-close="showPatientDialog = false"
  />
</template>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}

.table-container {
  width: 100%;
}

.table-header {
  font-size: 1.3rem;
  font-weight: 500;
}

.table__body {
  max-width: 1280px;
}

.table__button-container {
  width: 100%;
  display: flex;
  gap: 0.5rem;
}
</style>
