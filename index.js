const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

const CategoryDownloader = require('./lib/category_downloader');

const downloader = new CategoryDownloader(874);
downloader.downloadAllFiles();
