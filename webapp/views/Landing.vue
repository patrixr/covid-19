<template>
  <div class="landing-view">
    <div class="title">
      <span class="main"> COVID-19 Numbers</span>
      <span class="subtitle"> (as of {{ recordDate }}) </span>
    </div>

    <div class="global-stats">
      <el-card>
        <div slot="header" class="clearfix">
          <span>Total Cases</span>
        </div>
        <div>{{ worldStats.confirmed | prettyNumber }}</div>
      </el-card>
      <el-card>
        <div slot="header" class="clearfix">
          <span>Deaths</span>
        </div>
        <div>{{ worldStats.deaths | prettyNumber }}</div>
      </el-card>
      <el-card>
        <div slot="header" class="clearfix">
          <span>Recoveries</span>
        </div>
        <div>{{ worldStats.recoveries | prettyNumber }}</div>
      </el-card>
    </div>

    <div class="trends">
      <div class="header">
        <h3> <fa-icon icon="chart-line"></fa-icon> Trends </h3>
        <alphabetical-dropdown class="country-input" :values="countries" default-value="World" v-model="chartCountry"></alphabetical-dropdown>
      </div>

      <el-card>
        <div slot="header" class="clearfix">
          <span>Cases over time</span>
        </div>
        <curves-chart v-if="chartData" :series="chartData.series" :timestamps="chartData.timestamps"></curves-chart>
      </el-card>
    </div>

    <div class="countries">
      <div class="header">
        <h3> <fa-icon icon="sort-amount-down"></fa-icon> Global Stats </h3>
      </div>

      <el-card>
        <div slot="header" class="clearfix">
          <span>Latest numbers</span>
        </div>
        <data-table :data="tableData"></data-table>
      </el-card>
    </div>
  </div>
</template>

<script>
  import { mapGetters }                             from 'vuex';
  import _                                          from 'lodash';
  import CurvesChart                                from '../components/CurvesChart';
  import { reactive, computed, toRefs, onMounted }  from "@vue/composition-api";
  import AlphabeticalDropdown                       from '../components/AlphabeticalDropdown';
  import DataTable                                  from '../components/DataTable';
  import {
    worldStats,
    timelineData,
    countries,
    latestStats,
    recordDate,
  }   from '../services/covid';

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
        recordDate: new Date(recordDate).toDateString(),
        worldStats: worldStats(),
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
  .title {
      margin-top: .5rem;
      margin-bottom: 2rem;

    .main {
      font-size: 1.5rem;
    }
    .subtitle {
      font-size: 0.9rem;
      color: gray;
    }
  }

  .global-stats {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .el-card {
      width: 10rem;
      margin-bottom: 1rem;
    }
  }

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

