<template>
  <div class="landing-view">
    <div class="header">
      <h3> <fa-icon icon="chart-line"></fa-icon> Trends </h3>
      <alphabetical-dropdown class="country-input" :values="countries" default-value="World" v-model="chartCountry"></alphabetical-dropdown>
    </div>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Cases over time</span>
      </div>
      <curves-chart v-if="chartData" :series="chartData.series" :timestamps="chartData.timestamps"></curves-chart>
    </el-card>

    <div class="header">
      <h3> <fa-icon icon="sort-amount-down"></fa-icon> Global Stats </h3>
    </div>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Latest numbers</span>
      </div>
      <data-table :data="tableData"></data-table>
    </el-card>
  </div>
</template>

<script>
  import { mapGetters }                             from 'vuex';
  import _                                          from 'lodash';
  import CurvesChart                                from '../components/CurvesChart';
  import { reactive, computed, toRefs, onMounted }  from "@vue/composition-api";
  import { timelineData, countries, latestStats }   from '../services/covid';
  import AlphabeticalDropdown                       from '../components/AlphabeticalDropdown';
  import DataTable                                  from '../components/DataTable';

  export default {
    name: 'landing',
    components: {
      CurvesChart,
      AlphabeticalDropdown,
      DataTable
    },
    methods: {},
    setup() {
      const state = reactive({
        chartCountry: 'World',
        countries: countries(),
        tableData: latestStats(),
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
  .header {
    display: flex;

    >* { margin-right: 1rem; }

    h3 {
      opacity: 0.5;
      line-height: 2.2rem;
    }
  }

  .landing-view {
    padding: 1rem;
    .country-input {
      margin-top: 1.5rem;
      margin-bottom: 1.5rem;
    }
  }
</style>

