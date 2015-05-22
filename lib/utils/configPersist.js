var fs = require('fs');

module.exports = {
  save: function save(path, config) {
    fs.writeFileSync(path, JSON.stringify(config, null, 2));
  }
}
