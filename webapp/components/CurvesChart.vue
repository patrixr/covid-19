<template>
  <div class="graph-container">
    <apexchart :width="width" height="400" type="area" :options="options.chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
  import { reactive, computed, toRefs }  from "@vue/composition-api";

  export const CurvesChart = {
    name: 'navigation-bar',
    props: ['timestamps', 'series'],
    setup(props) {
      return {
        width: (window.outerWidth > 800 ? 800 : window.outerWidth) * 0.85,
        options: {
          chartOptions: {
            chart: {
              foreColor: "#526BA3",
              type: 'area',
              stacked: true,
              toolbar: {
                autoSelected: "pan",
                show: false
              }
            },
            theme: {
              mode: 'light', 
              palette: 'palette1'
            },
            legend: {
              position: 'top'
            },
            grid: {
              borderColor: "#ABD5FF",
              clipMarkers: true
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
                format: 'dd/MM/yy'
              },
            },
          }
        }
      }
    }
  }

  export default CurvesChart
</script>

<style lang="scss" >
  .graph-container {
    position: relative;
  }
</style>