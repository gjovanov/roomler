<template>
  <v-chart :options="options" :autoresize="true" />
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/title'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/markPoint'
import 'echarts/lib/component/dataZoom'

export default {
  components: {
    'v-chart': ECharts
  },
  props: {
    options: {
      type: Object,
      default: null
    }
  }
}
</script>
