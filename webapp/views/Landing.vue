<template>
  <div v-if="loaded">
    loaded
  </div>
  <div v-else>
    <curves-chart :labels="labels" :subLabels="subLabels" :values="values"></curves-chart>
  </div>
</template>

<script>
  import covid              from '../services/covid'
  import { mapGetters }     from 'vuex';
  import _                  from 'lodash';
  import CurvesChart        from '../components/CurvesChart';

  export default {
    name: 'landing',
    components: {
      CurvesChart
    },
    methods: {},
    setup() {
      return {
        labels: ['Active Cases', 'Recoveries', 'Deaths'],
        subLabels: ['Direct', 'Social Media', 'Ads'],
        values: [
        // with the given Labels and SubLabels here's what the values represent:
        //
        // Direct, Social, Ads  
        //    |      |     |    
        //    v      v     v
            [3000, 2500, 6500], // Segments of "Impressions" from top to bottom
            [3000, 1700, 1000], // Segments of "Add To Cart"
            [600,  200,  130]   // Segments of "Buy"
        ],
      };
    },

    computed: {
      loaded() { false }
    },
    async created() {
      console.log(await covid.countries())
    },
    beforeDestroy () {
      clearInterval(this.polling)
    }
  }
</script>

<style lang="scss" scoped>
  .summary-container {
   
  }
</style>

