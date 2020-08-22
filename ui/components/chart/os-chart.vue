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
  data () {
    return {
      yProp: 'count'
    }
  },
  computed: {
    yAxisName () {
      return this.yProp === 'count' ? 'Count' : 'Duration (min)'
    },
    options () {
      const self = this
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
          x: 0,
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
            myFeature: {
              show: true,
              title: self.yProp === 'count' ? 'Duration' : 'Count',
              icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
              onclick () {
                self.yProp = (self.yProp === 'count' ? 'duration' : 'count')
              }
            },
            saveAsImage: { show: true, title: 'Save as Image' }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: 120,
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
          type: 'value',
          name: self.yAxisName,
          nameTextStyle: {
            fontWeight: 'bold',
            padding: [0, 0, 0, -40], // [top, right, bottom, left]
            align: 'left'
          }
        },
        series: []
      }
      this.items.forEach((r) => {
        const key = r._id.key || 'n/a'
        if (!data[key]) {
          data[key] = []
        }
        data[key].push([new Date(`${r._id.year}-${r._id.month}-${r._id.day}`), r[self.yProp]])
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
          data: sortedData
        })
      }
      return options
    }
  }
}
</script>
