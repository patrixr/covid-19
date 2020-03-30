<template>
  <el-menu
    class="nav-bar"
    mode="horizontal"
    @select="handleSelect"
    active-text-color="#8AA35A">
    <el-menu-item index="1" class="logo"><a href="https://www.tronica.io" target="_blank"><img height="50" src="../assets/tronica.png"/></a></el-menu-item>
    <el-menu-item index="2"><a href="https://github.com/patrixr/covid-19" target="_blank"><img height="30" src="../assets/github.png"/></a></el-menu-item>
    <!-- <el-menu-item index="3"><a href="/">Covid-19 Dashboard</a></el-menu-item> -->
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

<style lang="scss" scoped>
  .nav-bar {

    a { text-decoration: none; }

    .el-menu-item:hover {
      img { opacity: 0.6 }
    }

    .el-menu-item:not(.logo) {
      line-height: 3rem;
    }
  }
</style>