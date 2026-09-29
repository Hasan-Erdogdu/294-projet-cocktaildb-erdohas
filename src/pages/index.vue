<script setup>
  import { onMounted, ref } from 'vue'

  const cocktail = ref([])

  onMounted(async () => {
    const response = await fetch('https://apis.divtec.me/api/cocktails/cocktails')
    const json = await response.json()
    cocktail.value = json.data
  })
</script>

<template>
</template>
