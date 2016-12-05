const request = require('request');
const fs = require('fs');

const DL_DIR = 'downloads';

const ENDPOINT = 'http://117.56.91.94/KMPublic/searchresult/searchservice.aspx'
  + '?region=documentcategory'
  + '&searchcategory=207'
  + '&desc=true'
  + '&sort=_l_last_modified_datetime'
  + '&pageindex=0'
  + '&pagesize=10';


// Get category list
request({ url: ENDPOINT, jar: true }, (err, response, body) => {
  if (response.statusCode === 200) {
    const result = JSON.parse(body);
    const records = result.Data[0];

    // Get array of records
    records.forEach((document) => {
      const { UniqueKey, Title } = document;
      console.log(`[${UniqueKey}] ${Title}`);
    });
  }
});
