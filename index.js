const CategoryDownloader = require('./lib/category_downloader');

const categoryId = process.argv[process.argv.length - 1];

if (!categoryId.match(/^\d+$/)) {
  console.log('Please specify categoryId.')
  console.log('Usage: node ./index.js <categoryId>');
  process.exit(1);
}

const downloader = new CategoryDownloader(categoryId);
downloader.downloadAllFiles();
