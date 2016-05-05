var program = require('commander')
var http = require('superagent')
var html = require('htmlparser2')
var blessed = require('blessed')

var screen = blessed.screen({
  smartCSR: true,
  width:'100%',
  height: '100%'
})

var box = blessed.box({
  width: '100%',
  height: '100%',
  content: ''
})

screen.append(box)

var noContent = {
  'html': true,
  'head': true,
  'title': true,
  'meta': true,
  'link': true,
  'script': true,
  'style': true
}

var block = {
  'div': true,
  'form': true,
  'ul': true,
  'ol': true,
  'main': true,
  'section': true,
  'header': true,
  'footer': true
}

var inContent = false
var inTitle = false

var parser = new html.Parser({
  onopentag: function (name, attrs) {
    if (!noContent[name]) {
      inContent = true
    }
    if (name === 'title') {
      inTitle = true
    }
  },
  ontext: function (text) {
    text = text.replace(/\s+/, ' ')
    if (inTitle) {
      screen.title = text.trim()
    }
    if (inContent) {
      box.insertBottom(text)
    }
  },
  onclosetag: function (name) {
    if (!noContent[name]) {
      inContent = false
    }
    if (name === 'title') {
      inTitle = false
    }
  }
})

program
  .arguments('<url>')
  .action(function (url) {
     screen.title = url
     box.setContent('Loading...')
     screen.render()
     inContent = false
     http
      .get(url)
      .end(function (err, res) {
        if (err) return console.error('Http err')
        box.setContent('')
        parser.write(res.text)
        parser.done()
        screen.render()
      })
  })
  .parse(process.argv)
