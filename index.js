const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

const CategoryDownloader = require('./lib/category_downloader');

const downloader = new CategoryDownloader(985);
downloader.retrieveAllRecords({ pageSize: 100 })
  .then(store => console.log(store.getStore()[0]));
