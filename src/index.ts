import * as WebDriverio from "webdriverio"
import { Client } from "webdriverio"

const client = WebDriverio.remote({desiredCapabilities: {browserName: "chrome"}})

client
   // sessions method have been given never type in original webdriverio types file, you need to 
   // remove never type to make typescript happy, otherwise next .then method will show a red squigel.
   .sessions()
   // this line of code deletes any previous running browser window
   .then((s: any) => s.value.forEach((session: any) => client.session("DELETE", session.id)))
   .init()
   .then(() => scrape(client))
   .catch((error: any) => console.log(error))
   // this is a good practice to end browser in all cases. Just to avoid any unended sessions
   .then(() => client.end())

function scrape(client: Client<void>): Client<void> {
   return client
      .url("https://www.yahoo.com")
      .getSource()
      .then((source: string) => console.log(source.match(/<title>(.*?)<\/title>/)[1]))
}