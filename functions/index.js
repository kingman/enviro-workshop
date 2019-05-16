const {BigQuery} = require('@google-cloud/bigquery');
const bigquery = new BigQuery();

exports.enviro = (event, context) => {
  const pubsubMessage = event.data;
  const deviceId = event.attributes.deviceId;
  const objStr = Buffer.from(pubsubMessage, 'base64').toString()
  const msgObj = JSON.parse(objStr);
  const timestamp = BigQuery.timestamp(new Date());
  let rows = [{
    device_id: deviceId,
    time: timestamp,
    pressure: msgObj.pressure,
    ambient_light: msgObj.ambient_light,
    temperature: msgObj.temperature,
    humidity: msgObj.humidity
  }];
  insertRowsAsStream(rows)
};

function insertRowsAsStream(rows) {
  bigquery
    .dataset(process.env.DATASET)
    .table(process.env.TABLE)
    .insert(rows);
}
