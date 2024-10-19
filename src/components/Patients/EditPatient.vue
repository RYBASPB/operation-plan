<script setup lang="ts">
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import { Supabase } from '../../services/storage/supabase.ts'
import DatePicker from 'primevue/datepicker'
import { ref, watchEffect } from 'vue'
import { CreatePatient, UpdatePatient } from '../../services/patient/Patient.ts'

interface Props {
  propsData: CreatePatient | UpdatePatient
  showPatientDialog: boolean
}

const { propsData, showPatientDialog } = defineProps<Props>()

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

const infections = [
  'Нет',
]

const diagnoses = [
  'ДГПЖ',
  'МКБ',
]

const surgeries = [
  'ТУР',
]

const anesthesiaTypes = [
  'ЭТН',
  'в/в',
  'местная',
]

const doctors = [
  'Док',
]

</script>

<template>
  <Dialog
    v-if="patientData"
    v-model:visible="isVisible"
    @hide="$emit('onClose')"
  >
    <DatePicker
      v-model="patientData.operation_date"
      date-format="dd.mm.yy"
      input-id="date_picker"
    />
    <InputText
      v-model="patientData.name"
      type="text"
      fluid
    />
    <InputText
      v-model="patientData.age"
      type="number"
      inputmode="numeric"
      fluid
    />
    <InputText
      v-model="patientData.case_number"
      type="number"
      inputmode="numeric"
      fluid
    />
    <Select
      v-model="patientData.inf"
      editable
      :options="infections"
      class="w-full"
    />
    <Select
      v-model="patientData.diagnosis"
      editable
      :options="diagnoses"
      class="w-full"
    />
    <Select
      v-model="patientData.operation"
      editable
      :options="surgeries"
      class="w-full"
    />
    <Select
      v-model="patientData.anesthesia"
      editable
      :options="anesthesiaTypes"
      class="w-full"
    />
    <Select
      v-model="patientData.team"
      editable
      :options="doctors"
      class="w-full"
    />
    <Button @click="editPatient">
      Изменить
    </Button>
  </Dialog>
</template>

<style scoped>

</style>
