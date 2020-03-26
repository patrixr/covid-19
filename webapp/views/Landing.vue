<template>
  <div v-if="loading">
    loading
  </div>
  <div v-else>
    <curves-chart v-if="chartData" :series="chartData.series" :timestamps="chartData.timestamps"></curves-chart>
  </div>
</template>

<script>
  import covid                                      from '../services/covid'
  import { mapGetters }                             from 'vuex';
  import _                                          from 'lodash';
  import CurvesChart                                from '../components/CurvesChart';
  import { reactive, computed, toRefs, onMounted }  from "@vue/composition-api";

  export default {
    name: 'landing',
    components: {
      CurvesChart
    },
    methods: {},
    setup() {
      const chartLabels = ['Active Cases', 'Recoveries', 'Deaths'];

      const state = reactive({
        history     : null,
        loading     : true,
        error       : null,
        chartCountry: 'China',
      });

      const chartData = computed(() => {
        const series = [{
          name: 'Active Cases',
          data: []
        }, {
          name: 'Recoveries',
          data: []
        }, {
          name: 'Deaths',
          data: []
        }];

        const timestamps = [];

        const country = state.chartCountry;
        const records = _.get(state.history, country, []);

        if (!records.length) { return null; }

        _.each(records, (r, idx) => {
          timestamps.push(r.record_date);
          series[0].data.push(r.active_cases);
          series[1].data.push(r.total_recovered);
          series[2].data.push(r.total_deaths);
        });

        return { timestamps, series };
      });

      const loadData = async () => {
        console.log('Loading data');
        try {
          state.loading = true;
          state.error = null
          state.history = await covid.history();
        } catch (error) {
          console.error(error);
          state.error = error.toString();
          state.history = {};
        } finally {
          state.loading = false;
        }
      }

      onMounted(() => loadData());

      return {
        ...toRefs(state),
        chartLabels,
        chartData,
        loadData
      };

      // return {
      //   labels: ['Active Cases', 'Recoveries', 'Deaths'],
      //   subLabels: ['Direct', 'Social Media', 'Ads'],
      //   values: [
      //   // with the given Labels and SubLabels here's what the values represent:
      //   //
      //   // Direct, Social, Ads  
      //   //    |      |     |    
      //   //    v      v     v
      //       [3000, 2500, 6500], // Segments of "Impressions" from top to bottom
      //       [3000, 1700, 1000], // Segments of "Add To Cart"
      //       [600,  200,  130]   // Segments of "Buy"
      //   ],
      // };
    },

    computed: {
      loaded() { false }
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

