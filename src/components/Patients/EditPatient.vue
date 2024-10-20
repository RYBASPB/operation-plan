<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import { Supabase } from '../../services/storage/supabase.ts'
import DatePicker from 'primevue/datepicker'
import { ref, watchEffect } from 'vue'
import { CreatePatient, UpdatePatient } from '../../services/patient/Patient.ts'
import FloatLabel from 'primevue/floatlabel'
import options from '../../data/options.ts'

const {
  infections,
  diagnoses,
  surgeries,
  anesthesiaTypes,
  doctors,
} = options

interface Props {
  propsData?: CreatePatient | UpdatePatient
  showPatientDialog: boolean
  title: string
}

const { propsData, showPatientDialog, title } = defineProps<Props>()

const patientData = ref<CreatePatient | UpdatePatient>({})
const isVisible = ref()
watchEffect(() => {
  if (propsData) {
    patientData.value = JSON.parse(JSON.stringify(propsData))
    isVisible.value = showPatientDialog
  }
})

const emit = defineEmits(['afterEdit', 'onClose'])

const repo = new Supabase()

const editPatient = async () => {
  if (patientData.value) {
    if ('id' in patientData.value) {
      const { error } = await repo.Update(patientData.value)
      if (error) {
        console.error(error)
        return
      }
      emit('afterEdit')
      return
    }

    const { error } = await repo.Create(patientData.value)
    if (error) {
      console.error(error)
      return
    }
    emit('afterEdit')
  }
}

</script>

<template>
  <Dialog
    v-if="patientData"
    v-model:visible="isVisible"
    :header="title"
    @hide="$emit('onClose')"
  >
    <div class="modal__content">
      <div class="modal__block">
        <FloatLabel variant="in">
          <label for="date_picker">Дата операции</label>
          <DatePicker
            v-model="patientData.operation_date"
            date-format="dd.mm.yy"
            input-id="date_picker"
          />
        </FloatLabel>
        <FloatLabel variant="in">
          <label for="name">ФИО</label>
          <InputText
            id="name"
            v-model="patientData.name"
            type="text"
            fluid
          />
        </FloatLabel>
        <FloatLabel variant="in">
          <label for="age">Возраст</label>
          <InputText
            id="age"
            v-model="patientData.age"
            type="number"
            inputmode="numeric"
            fluid
          />
        </FloatLabel>
        <FloatLabel variant="in">
          <InputText
            id="case_number"
            v-model="patientData.case_number"
            type="number"
            inputmode="numeric"
            fluid
          />
          <label for="case_number">Номер истории</label>
        </FloatLabel>
      </div>
      <div class="modal__block">
        <FloatLabel variant="in">
          <Select
            v-model="patientData.inf"
            input-id="inf"
            editable
            :options="infections"
          />
          <label for="inf">Инфекции</label>
        </FloatLabel>
        <FloatLabel variant="in">
          <Select
            v-model="patientData.diagnosis"
            input-id="diagnosis"
            editable
            :options="diagnoses"
          />
          <label for="diagnosis">Диагноз</label>
        </FloatLabel>
        <FloatLabel variant="in">
          <Select
            v-model="patientData.operation"
            input-id="operation"
            editable
            :options="surgeries"
            class="w-full"
          />
          <label for="operation">Операции</label>
        </FloatLabel>
        <FloatLabel variant="in">
          <Select
            v-model="patientData.anesthesia"
            input-id="anesthesia"
            editable
            :options="anesthesiaTypes"
          />
          <label for="anesthesia">Анестезия</label>
        </FloatLabel>
        <FloatLabel variant="in">
          <Select
            v-model="patientData.team"
            input-id="team"
            editable
            :options="doctors"
          />
          <label for="team">Бригада</label>
        </FloatLabel>
      </div>
    </div>
    <template #footer>
      <Button
        :label="title"
        @click="editPatient"
      />
    </template>
  </Dialog>
</template>

<style scoped>
.modal__content {
  display: flex;
  justify-content: center;
  align-items: start;
  gap: 1rem;
}

.modal__block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
