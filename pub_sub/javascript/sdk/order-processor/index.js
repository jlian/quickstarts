import { DaprServer } from '@dapr/dapr';
import { DaprClient } from '@dapr/dapr';

const DAPR_HOST = process.env.DAPR_HOST || "http://localhost";
const DAPR_HTTP_PORT = process.env.DAPR_HTTP_PORT || "3501";
const SERVER_HOST = process.env.SERVER_HOST || "127.0.0.1";
const SERVER_PORT = process.env.APP_PORT || 5002;
const PUBSUB_NAME = "orderpubsub";
const SUB_TOPIC = "temp-measurements";
const PUB_TOPIC = "temp-alerts";
// const TEMP_THRESHOLD = process.env.TEMP_THRESHOLD
const TEMP_THRESHOLD = process.env.TEMP_THRESHOLD || 25;


async function main() {
  const server = new DaprServer(SERVER_HOST, SERVER_PORT, DAPR_HOST, DAPR_HTTP_PORT);
  const client = new DaprClient(DAPR_HOST, DAPR_HTTP_PORT);

  // Dapr subscription routes orders topic to this route
  server.pubsub.subscribe(PUBSUB_NAME, SUB_TOPIC, (data) => {
    console.log("Subscriber received: " + JSON.stringify(data));
    var alert = filterMessage(data);
    if (alert) {
      client.pubsub.publish(PUBSUB_NAME, PUB_TOPIC, "Alert!");
      console.log("Published alert")
    }
  });

  await server.start();
}

function filterMessage(msg) {
  var temperature = parseInt(JSON.stringify(msg));
  if (temperature > parseInt(TEMP_THRESHOLD)) {
    console.log(`Temperature ${temperature} exceeds threshold ${TEMP_THRESHOLD}`);
    var alert = true;
    return alert;
  }
  var alert = false;
  return alert;
}

main().catch(e => console.error(e));