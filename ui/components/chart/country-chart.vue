<template>
  <line-chart :options="options" />
</template>

<script>
import echarts from 'echarts/lib/echarts'
import LineChart from '@/components/chart/line-chart'

export default {
  components: {
    LineChart
  },
  props: {
    from: {
      type: String,
      default: null
    },
    to: {
      type: String,
      default: null
    },
    items: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    options () {
      const data = {}
      const options = {
        initOptions: {
          renderer: 'svg'
        },
        title: {
          text: 'Countries'
        },
        legend: {
          data: []
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            magicType: {
              show: true,
              type: ['line', 'bar'],
              title: {
                line: 'Line',
                bar: 'Bar'
              }
            },
            restore: { show: true, title: 'Reset' },
            saveAsImage: { show: true, title: 'Save as Image' }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        calculable: true,
        xAxis: [
          {
            type: 'time',
            boundaryGap: false,
            min: new Date(this.from),
            max: new Date(this.to),
            axisLabel: {
              formatter (value) {
                return echarts.format.formatTime('yyyy-MM-dd', value)
              }
            }
          }
        ],
        yAxis: {
          type: 'value'
        },
        series: []
      }
      this.items.forEach((r) => {
        const key = r._id.key || 'n/a'
        if (!data[key]) {
          data[key] = []
        }
        data[key].push([new Date(`${r._id.year}-${r._id.month}-${r._id.day}`), r.count])
      })
      for (const key in data) {
        const sortedData = data[key].sort((a, b) => {
          return a[0] - b[0]
        })
        options.legend.data.push(key)

        options.series.push({
          name: key,
          type: 'line',
          // smooth: true,
          itemStyle: { normal: { areaStyle: { type: 'default' } } },
          data: sortedData,
          markPoint: {
            data: [{
              type: 'max',
              name: 'Max'
            }, {
              type: 'min',
              name: 'Min'
            }]
          }
        })
      }
      return options
    }
  }
}
</script>
