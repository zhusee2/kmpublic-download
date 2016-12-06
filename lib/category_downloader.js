const request = require('request').defaults({ jar: true });

const Record = require('./record');
const RecordsStore = require('./records_store');

const { BASE_URL } = require('./constants');

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
      store.add(currentRecords.map(rawRecord => new Record(rawRecord.UniqueKey, rawRecord.Title)));

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

function downloadRecordFromQueue(queue = []) {
  const record = queue.pop();

  if (record) {
    record.downloadAllFiles().then(() => downloadRecordFromQueue(queue));
  }
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

  downloadAllFiles(options) {
    return this.retrieveAllRecords(options).then((recordsStore) => {
      const queue = recordsStore.getStore();
      downloadRecordFromQueue(queue);
    })
  }
}

module.exports = CategoryDownloader;
