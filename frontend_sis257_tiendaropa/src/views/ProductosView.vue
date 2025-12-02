<script setup lang="ts">
import ProductoList from '@/components/productos/ProductoList.vue'
import DashboardHeader from '@/components/DashboardHeader.vue'
</script>

<template>
  <div class="view-wrapper">
    <DashboardHeader />
    <div class="container-fluid px-4 py-4">
      <ProductoList />
    </div>
  </div>
</template>

<style scoped>
.view-wrapper {
  min-height: 100vh;
  background: #ffffff;
  padding-top: 65px;
}
</style>
