var program = require('blessed')()

var writeMode = false

program.reset()
program.alternateBuffer()
program.setTitle('Test tty app')
program.write('Hello world!\n\nThis is a multiline test.\n\n\n\n\nTry to move in this area!\n\nI am going to write something very long, so that we will see how espeakup handles sentences extending over multiple lines. How will it manage multiple sentences on the same line?')
program.move(0, 0)

program.on('keypress', function (ch, key) {
  if (key.full === '&') {
    program.resetColors()
    program.newline()
    program.normalBuffer()
    process.exit(0)
  }

  if (['left', 'up', 'right', 'down'].indexOf(key.full) > -1) {
    program[key.full]()
  }

  if (key.full === 'é') {
    writeMode = !writeMode
  } else if (writeMode) {
    if (key.full === 'enter') {
      program.newline()
    } else if (ch) {
      program.write(ch)
    }
  }
})
