<template>
    <el-table
    class="data-table"
    :data="data"
    :default-sort = "{prop: 'confirmed', order: 'descending'}"
    :row-class-name="tableRowClassName"
    height="600">
    <el-table-column
      prop="country"
      label="Country"
      sortable
      width="140">
    </el-table-column>
    <el-table-column
      prop="confirmed"
      label="Confirmed Cases"
      sortable
      width="180">
    </el-table-column>
    <el-table-column
      prop="recoveries"
      label="Recoveries"
      sortable
      width="140">
    </el-table-column>
    <el-table-column
      prop="deaths"
      label="Deaths"
      sortable
      width="100">
    </el-table-column>
    <el-table-column
      prop="newCases"
      label="New Cases"
      sortable
      width="140">
    </el-table-column>
    <el-table-column
      prop="newDeaths"
      label="New Deaths"
      sortable
      width="180">
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    name: 'data-table',
    props: ['data'],
    methods: {
      tableRowClassName({ row }) {
        if (row['country'] == 'World') {
          return 'info-row';
        }

        return '';
      }
    },
  }
</script>

<style lang="scss">
  .data-table {
    padding: 1rem;

    .info-row {
      background: #eee;
    }
  }
</style>