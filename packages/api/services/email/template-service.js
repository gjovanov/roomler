const path = require('path')
const fs = require('fs')
const handlebars = require('handlebars')
const config = require('roomler.config')

class TemplateService {
  render (template, model) {
    // add global model properties
    model.platform = config.appSettings.name
    model.email = config.emailSettings.supportEmail
    model.codeValidityInMinutes = config.authSettings.codeValidityInMinutes

    // render
    const html = handlebars.compile(
      fs.readFileSync(path.join(__dirname, '..', '..', 'resources', 'email', template))
        .toString('utf-8')
    )(model)
    return html
  }
}

module.exports = new TemplateService()
