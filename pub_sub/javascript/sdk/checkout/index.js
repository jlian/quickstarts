import { DaprClient } from '@dapr/dapr';

const DAPR_HOST = process.env.DAPR_HOST || "http://localhost";
const DAPR_HTTP_PORT = process.env.DAPR_HTTP_PORT || "3500";
const PUBSUB_NAME = "orderpubsub";
const PUBSUB_TOPIC = "temp-measurements";

async function main() {
  const client = new DaprClient(DAPR_HOST, DAPR_HTTP_PORT);

  for(var i = 1; i <= 1000000; i++) {
    const temperature = Math.floor(Math.random() * (50 ));

    // Publish an event using Dapr pub/sub
    await client.pubsub.publish(PUBSUB_NAME, PUBSUB_TOPIC, temperature);
    console.log("Published data: " + JSON.stringify(temperature));

    await sleep(100);
  }
}
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main().catch(e => console.error(e))