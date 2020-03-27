<template>
  <div class="landing-view">
    <alphabetical-dropdown class="country-input" :values="countries" default-value="World" v-model="chartCountry"></alphabetical-dropdown>
    <curves-chart v-if="chartData" :series="chartData.series" :timestamps="chartData.timestamps"></curves-chart>
  </div>
</template>

<script>
  import { mapGetters }                             from 'vuex';
  import _                                          from 'lodash';
  import CurvesChart                                from '../components/CurvesChart';
  import { reactive, computed, toRefs, onMounted }  from "@vue/composition-api";
  import { timelineData, countries }                from '../services/covid';
  import AlphabeticalDropdown                       from '../components/AlphabeticalDropdown';

  export default {
    name: 'landing',
    components: {
      CurvesChart,
      AlphabeticalDropdown
    },
    methods: {},
    setup() {
      const state = reactive({
        chartCountry: 'World',
        countries: countries(),
        chartData: computed(() => {
          return timelineData(state.chartCountry)
        })
      });

      return {
        ...toRefs(state),
        selectCountry(c) {
          console.log(c);
          state.chartCountry = c;
        }
      };
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
  .landing-view {
    .country-input {
      margin-top: 1.5rem;
      margin-bottom: 1.5rem;
    }
  }
</style>

