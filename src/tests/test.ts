import { WebdriveioClient, Client } from "../index"

const client = new WebdriveioClient({
   desiredCapabilities: {
      browserName: "chrome"
   }
})

client
   .initClient()
   .then((t: Array<Client<void>>) => scrape(t[0]))
   .then(() => console.log("Done!"))
   .catch((error: any) => console.error(error))

function scrape(client: Client<void>): Client<void> {
   return client
      .pause(5 * 1000) // this will avoid errors
      .url("https://www.yahoo.com")
      .getSource()
      .then((source: string) => console.log(source.match(/<title>(.*?)<\/title>/)[1]))
      .then(() => client.end())
}