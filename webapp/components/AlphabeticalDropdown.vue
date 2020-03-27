<template>
<div>
  <el-cascader
    v-model="selection"
    :options="options"
    @change="handleChange"></el-cascader>
</div>
</template>

<script>
  import _ from "lodash";

  export default {
    name: 'alpha-dropdown',
    props: [ "values", "default-value", "value" ],
    setup(props) {

      const { values, defaultValue, value: selectedValue } = props;
      const ranges = ['A-E', 'F-J', 'K-O', 'P-T', 'U-Z'];

      const options = ranges.map((range) => {
        return {
          value:    range,
          label:    range,
          children: values
            .filter(v => new RegExp(`^[${range}]`, 'i').test(v))
            .map(v => ({
              value: v,
              label: v
            }))
        };
      });

      if (defaultValue) {
        options.unshift({
          value: defaultValue,
          label: defaultValue
        });
      }

      return {
        selection: selectedValue ? [selectedValue] : [],
        options
      }
    },
    methods: {
      handleChange(path) {
        this.$emit('input', _.last(path))
      }
    }
  };
</script>