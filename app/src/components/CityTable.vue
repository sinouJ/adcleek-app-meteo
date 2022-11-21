<template>
    <b-table striped hover :items="cities"></b-table>
</template>

<script>
export default {
    name: 'CityTable',
    props: {
        cities: Array
    }
}
</script>

<style>

</style>