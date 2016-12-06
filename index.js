const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

const DL_DIR = 'downloads';

const ENDPOINT = 'http://117.56.91.94/KMPublic/searchresult/searchservice.aspx'
  + '?region=documentcategory'
  + '&searchcategory=207'
  + '&desc=true'
  + '&sort=_l_last_modified_datetime'
  + '&pageindex=0'
  + '&pagesize=10';

const DOC_BASE_URL = 'http://117.56.91.94/KMPublic/';

function readDocumentByKey(docKey, docTitle) {
  const docUrl = `${DOC_BASE_URL}readdocument.aspx?documentId=${docKey}`

  request({ url: docUrl, jar: true }, (err, response, body) => {
    console.log(`\n[${docKey}] ${docTitle}`);

    if (response && response.statusCode === 200) {
      const $ = cheerio.load(body);

      const fileTitleDiv = $('.AttachFileTable td.listmode.zx > div');
      fileTitleDiv.find('span').remove();

      const fileTitle = fileTitleDiv.text();
      const fileUrl = $('.AttachFileTable td.listmode.zw a').attr('href');

      console.log(`  附件：${fileTitle}`);
      console.log(`  ${DOC_BASE_URL}/${fileUrl}\n`);
    }
  });
}

// Get category list
request({ url: ENDPOINT, jar: true }, (err, response, body) => {
  if (response.statusCode === 200) {
    const result = JSON.parse(body);
    const records = result.Data[0];

    // Get array of records
    records.forEach((document) => {
      const { UniqueKey, Title } = document;
      readDocumentByKey(UniqueKey, Title);
    });
  }
});
