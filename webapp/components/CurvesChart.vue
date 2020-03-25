<template>
  <div class="graph-container">
    <vue-funnel-graph
      :width="width"
      :height="height"
      :labels="labels"
      :values="values"
      :colors="colors"
      :sub-labels="subLabels"
      :direction="direction"
      :gradient-direction="gradientDirection"
      :animated="true"
      :display-percentage="true"
    ></vue-funnel-graph>
  </div>
</template>

<script>
  import { VueFunnelGraph } from 'vue-funnel-graph-js';

  export const CurvesChart = {
    name: 'navigation-bar',
    components: { VueFunnelGraph },
    props: ['labels', 'subLabels', 'values'],
    setup() {
      return {
        colors: [
          ['#FFB178', '#FF3C8E'], // color set for "Impressions" segment
          ['#A0BBFF', '#EC77FF'], // color set for "Add To Cart" segment
          ['#A0F9FF', '#7795FF']  // color set for "Buy" segment
        ],
        direction: 'horizontal',
        gradientDirection: 'horizontal',
        height: 300,
        width: 800
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
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