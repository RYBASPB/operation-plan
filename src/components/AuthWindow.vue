<script setup lang="ts">

import { ref } from 'vue'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'

import { supabase } from '../supabase.ts'

const loading = ref(false)
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    // TODO show error modal
    if (error) throw error
  }
  catch (error) {
    // TODO show error modal
    alert(error.error_description || error.message)
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <form
      class="auth-form"
      @submit.prevent="handleLogin"
    >
      <InputText
        v-model="email"
        type="text"
      />
      <Password v-model="password" />
      <Button
        label="Submit"
        :loading="loading"
        type="submit"
      />
    </form>
  </div>
</template>

<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
