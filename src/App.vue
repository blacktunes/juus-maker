<template>
  <RouterView />
</template>

<script lang="ts" setup>
import { getDB } from './store/custom'

getDB()
</script>
