var fs = require('fs')
var path = require('path')
var glob = require('glob')
var R = require('ramda')

// const rootPath = path.resolve(`${__dirname}/../i18n/messages`)
// const outputPath = path.resolve(`${__dirname}/../i18n/aggregate`)
// const outputFilename = 'en.json'

// glob(rootPath + '/**/*.json', null, function (error, files) {
//   if (error) {
//     console.log('Error :' + error)
//   } else {
//     const f = o => ({[o.id]: o.defaultMessage})
//     const r = R.map(f, R.flatten(R.map(require, files)))
//     fs.writeFile(outputPath + '/' + outputFilename, JSON.stringify(r, null, 2))
//   }
// })

const rootPath = path.resolve(`${__dirname}/../src`)
const outputPath = rootPath + '/assets/locales'
const outputFilename = 'en.json'
const regexIntlImport = new RegExp(/.+from['" ]+react-intl['" ]+/)
const regexIntlComponent = new RegExp(/(<FormattedMessage[^>]+\/>|<FormattedHtmlMessage[^>]+\/>)/, 'gm')
const regexIntlId = new RegExp(/id='([^']+)'/)
const regexIntlMessage = new RegExp(/defaultMessage='([^']+)'/)
var result = {}

glob(rootPath + '/**/*.js', null, function (error, files) {
  if (error) {
    console.log('Error :' + error)
  } else {
    R.map(extractIntlComponent, files)
    outputFile()
  }
})

const extractIntlComponent = (file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.log('ERROR: ' + err)
      return
    }
    let importSearchResults = data.match(regexIntlImport)
    if (!R.isNil(importSearchResults)) {
      let componentSearchResults = data.match(regexIntlComponent)
      if (!R.isNil(componentSearchResults)) {
        let elements = R.take(componentSearchResults.length, componentSearchResults)
        R.map(element => {
          let id = element.match(regexIntlId)
          let message = element.match(regexIntlMessage)
          if (R.isNil(id) | R.isNil(message)) console.log('Could not add the key.')
          console.log(id[1], message[1])
          result = R.assoc(id[1], message[1], result)
          outputFile()
        }, elements)
      }
    }
  })
}

const outputFile = () => {
  console.log('RESULT', result)
  fs.writeFile(outputPath + '/' + outputFilename, JSON.stringify(result, null, 2))
  console.log(outputPath + '/' + outputFilename + ' generated !')
}
