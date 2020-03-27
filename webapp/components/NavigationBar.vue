<template>
  <el-menu
    :default-active="activeIndex2"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    text-color="#526BA3"
    active-text-color="#8AA35A">
    <el-menu-item index="1"><a href="/">Covid-19 Dashboard</a></el-menu-item>
    <el-menu-item index="4"><a href="https://github.com/patrixr/covid-19" target="_blank">Source</a></el-menu-item>
  </el-menu>
</template>

<script>
  export const NavigationBar = {
    name: 'navigation-bar',
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }

  export default NavigationBar
</script>