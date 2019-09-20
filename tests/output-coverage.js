const pathLib = require('path')
const pti = require('puppeteer-coverage');

(async function () {
  const options = {
    nyc_output_path: pathLib.resolve(__dirname, '../.nyc_output/'),
    src_dir: pathLib.resolve(__dirname, '../.nuxt/'),
    source_map_dir: pathLib.resolve(__dirname, '../.nuxt/dist/ui/'),
    url_regexp: /promotion\/res\/htmledition\/js\/(.+\.(js|css))/,
    filterCoverageFile: (path) => {
      return !(path.includes('/src/js/') &&
        !path.includes('js/common/weixin-third') &&
        !path.includes('/js/common/weixin-ui') &&
        !path.includes('js/lib') &&
        !path.includes('campaign/manage') &&
        !path.includes('common/utils') &&
        !path.includes('rdcanvas') &&
        !path.includes('rdsns') &&
        !path.includes('moments/edit') &&
        !path.includes('campaign/email_edit') &&
        !path.includes('sns_assembly/revert') &&
        !path.includes('common/report') &&
        !path.includes('common/target') &&
        !path.includes('material_std') &&
        !path.includes('.scss') && !path.includes('.css'))
    }
  }
  console.log('options=', options)
  await pti.output(options)
})()
