const fs = require('fs');
const path = require('path');

function ensureWritableDir(paths) {
  if (!paths) {
    return null;
  }

  let prevPath = '';

  paths.forEach((partialPath) => {
    const workingPath = path.join(prevPath, partialPath);

    if (!fs.existsSync(workingPath)) {
      fs.mkdirSync(workingPath);
    }

    prevPath = workingPath;
  })

  return path.join.apply(this, paths);
}

module.exports = ensureWritableDir;
