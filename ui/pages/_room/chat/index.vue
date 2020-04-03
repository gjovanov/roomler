<template>
  <client-only>
    &nbsp;
  </client-only>
</template>

<script>

export default {
  middleware: 'authenticated'
}
</script>

<style>
table {
  border-collapse: collapse;
}

table, th, td {
  border: 1px solid black;
}
</style>
