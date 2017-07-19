import * as WebDriverio from "webdriverio"
import { Client, RawResult } from "webdriverio"

const client = WebDriverio.remote({desiredCapabilities: {browserName: "chrome"}})

client
   // sessions method have been given never type in original webdriverio types file, you need to 
   // remove never type to make typescript happy, otherwise next .then method will show a red squigel.
   .sessions()
   .then((r: RawResult<any>) => {
      if (r.value.length) {
         const oldClient = WebDriverio.remote(r.value[0].id)
         return oldClient
            .getSource()
            .then(() => scrape(oldClient))
            .catch(() => client.session("DELETE", r.value[0].id).then(() => scrape(client.init())))
      } else {
         return scrape(client.init())
      }
   })
   .catch((error: any) => console.log(error))
   .then(() => console.log("Done!"))
   // this line of code deletes any previous running browser window
   // .then((s: any) => s.value.forEach((session: any) => client.session("DELETE", session.id)))

function scrape(client?: Client<any>): Client<void> {
   return client
      .url("https://www.yahoo.com")
      .getSource()
      .then((source: string) => console.log(source.match(/<title>(.*?)<\/title>/)[1]))
      // this is a good practice to end browser in all cases. Just to avoid any unended sessions
      .then(() => client.end())
}