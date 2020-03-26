<template>
  <div class="graph-container">
    <apexchart width="800" type="area" :options="options.chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
  import { reactive, computed, toRefs }  from "@vue/composition-api";

  export const CurvesChart = {
    name: 'navigation-bar',
    props: ['timestamps', 'series'],
    setup(props) {
      console.log(props.timestamps);
      return {
        options: {
          chartOptions: {
            chart: {
              height: 400,
              type: 'area',
              stacked: true
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: 'smooth'
            },
            xaxis: {
              type: 'datetime',
              categories: props.timestamps
            },
            tooltip: {
              x: {
                format: 'dd/MM/yy HH:mm'
              },
            },
          }
        }
      }
    }
  }

  export default CurvesChart
</script>

<style lang="scss" scoped>
  .graph-container {
    position: relative;
    width: 800px;
    height: 400px;
    overflow: hidden;
    margin-top: 3rem;
  }
</style>