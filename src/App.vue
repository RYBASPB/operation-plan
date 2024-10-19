<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue'
import Auth from './components/AuthWindow.vue'
import { supabase } from './supabase.ts'
import { Session } from '@supabase/supabase-js'
import Plan from './components/PlanTable.vue'

const session: Ref<Session | null | undefined> = ref()

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })
})
</script>

<template>
  <div>
    <div v-if="session">
      <Plan />
    </div>
    <Auth v-else />
  </div>
</template>

<style scoped>

</style>
