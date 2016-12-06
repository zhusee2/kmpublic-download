const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

const RecordsStore = require('./records_store');

const BASE_URL = 'http://117.56.91.94/KMPublic';

function getCategoryQueryUrl(categoryId, pageIndex, pageSize) {
  return `${BASE_URL}/searchresult/searchservice.aspx`
    + '?region=documentcategory'
    + `&searchcategory=${categoryId}`
    + '&desc=true'
    + '&sort=_l_last_modified_datetime'
    + `&pageindex=${pageIndex}`
    + `&pagesize=${pageSize}`;
}

function retrieveCategoryPage({ catId, pageIndex = 0, pageSize = 50, store, resolve, reject }) {
  const queryUrl = getCategoryQueryUrl(catId, pageIndex, pageSize);

  request({ url: queryUrl, jar: true }, (err, response, body) => {
    if (err) {
      reject(err);
      return;
    }

    if (response.statusCode === 200) {
      const result = JSON.parse(body);
      const currentRecords = result.Data[0];

      const totalRecordsCount = result.Data[3];
      const totalPages = Math.floor(totalRecordsCount / pageSize);

      console.log(`Reading page ${pageIndex}/${totalPages}`);

      // Cache records from current page to store
      store.add(currentRecords);

      // Determine if it needs to fetch next page
      if (store.getSize() < totalRecordsCount) {
        // Fire self again for next page
        retrieveCategoryPage({ catId, pageIndex: pageIndex + 1, pageSize, store, resolve, reject });
      } else {
        resolve(store);
      }
      return;
    }

    reject('Unknown resonse');
  });
}

class CategoryDownloader {
  constructor(categoryId) {
    this.categoryId = categoryId;
    this.recordsStore = new RecordsStore();
    return this;
  }

  retrieveAllRecords({ pageSize = 50 } = {}) {
    return new Promise((resolve, reject) => {
      retrieveCategoryPage({ catId: this.categoryId, store: this.recordsStore, resolve, reject });
    });
  }
}

module.exports = CategoryDownloader;
