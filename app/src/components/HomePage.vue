<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div class="meteo_container">
      
    </div>
    <city-table :cities="cities"></city-table>
  </div>
</template>

<script>
import CityTable from './CityTable.vue'

export default {
  name: 'HomePage',
  props: {
    msg: String
  },
  data() {
    return {
      cities: []
    }
  },
  components: {
    CityTable
  },
  created() {
    fetch('http://localhost:3000/cities')
      .then(response => response.json())
      .then(data => {
        this.cities = data
      })
  }
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
table {
  width: 50%;
}
</style>
