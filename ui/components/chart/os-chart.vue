<template>
  <base-chart :options="options" />
</template>

<script>
import echarts from 'echarts/lib/echarts'
import BaseChart from '@/components/chart/base-chart'

export default {
  components: {
    BaseChart
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
          text: 'OS'
        },
        legend: {
          type: 'scroll',
          layout: 'horizontal',
          align: 'right',
          selector: [
            {
              type: 'all',
              // can be any title you like
              title: 'All'
            },
            {
              type: 'inverse',
              title: 'Inv'
            }
          ],
          verticalAlign: 'bottom',
          backgroundColor: '#fff',
          borderColor: '#ccc',
          borderWidth: 0.5,
          padding: [20, 30],
          y: 30,
          x: 30,
          // width: '100%',
          itemWidth: 135,
          itemStyle: {
            fontWeight: 'bold'
          },
          itemHiddenStyle: {
            fontWeight: 'bold'
          },
          data: []
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            restore: { show: true, title: 'Reset' },
            dataZoom: { show: true, title: { zoom: 'Zoom', back: 'Back' } },
            dataView: { show: true, title: 'View data', lang: ['Data view', 'Turn off', 'Refresh'] },
            saveAsImage: { show: true, title: 'Save as Image' }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: 100,
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
          type: 'bar',
          stack: 'total',
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
