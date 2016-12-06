const path = require('path');
const fs = require('fs');
const request = require('request').defaults({ jar: true });
const cheerio = require('cheerio');

const ensureWritableDir = require('./ensure_writable_dir');

const { BASE_URL } = require('./constants');

function getRecordUrl(key) {
  return `${BASE_URL}/readdocument.aspx?documentId=${key}`
}

class Record {
  constructor(uniqueKey, title) {
    this.uniqueKey = uniqueKey;
    this.title = title;
    this.url = getRecordUrl(uniqueKey);
    this.attachements = [];
    this.writeDir = null;
    return this;
  }

  getWriteDir() {
    if (!this.writeDir) {
      this.writeDir = ensureWritableDir([
        path.resolve(__dirname, '../downloads'),
        `[${this.uniqueKey}] ${this.title}`
      ]);
    }

    return this.writeDir;
  }

  retrieveAttachementsList() {
    console.log(`\nReading: [${this.uniqueKey}] ${this.title}`);

    const webpageDownloadPath = path.join(
      this.getWriteDir(),
      'summary.html'
    );
    const writeFile = fs.createWriteStream(webpageDownloadPath);

    return new Promise((resolve, reject) => {
      request(this.url, (err, response, body) => {
        if (err) {
          return reject(err);
        }

        if (response.statusCode === 200) {
          const $ = cheerio.load(body);
          const $attachmentRows = $('.AttachFileTable tr');

          $attachmentRows.each((index, row) => {
            const fileTitleDiv = $(row).find('td.listmode.zx > div');
            fileTitleDiv.find('span').remove();

            const fileUrl = $(row).find('td.listmode.zw a').attr('href');
            const fileTitle = fileUrl.match(/fileName=([^&]+)/)[1];

            this.attachements.push({ title: fileTitle, url: `${BASE_URL}/${fileUrl}` });
          })

          return resolve(this.attachements);
        }

        return reject('Unknown response');
      }).pipe(writeFile);
    });
  }

  downloadAllFiles() {
    return this.retrieveAttachementsList().then((filesList) => {
      filesList.forEach((file) => {
        const downloadPath = path.join(
          this.getWriteDir(),
          file.title.trim()
        );
        const writeFile = fs.createWriteStream(downloadPath);

        return new Promise((resolve, reject) => {
          console.log(`  Downloading: ${file.title}`);

          request(file.url)
            .on('response', resolve)
            .on('error', reject)
            .pipe(writeFile);
        });
      })
    })
  }
}

module.exports = Record;
