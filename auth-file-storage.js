const fs = require('fs')

class FileStorage {
  constructor(filename) {
    this.tokenFilename = filename
  }

  readToken() {
    return fs.promises.readFile(this.tokenFilename).then(body => JSON.parse(body))
  }

  writeToken(token) { 
    return fs.promises.writeFile(this.tokenFilename, JSON.stringify(token))
  }
}

module.exports = {
  FileStorage
}