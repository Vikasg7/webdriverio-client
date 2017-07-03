/// <reference path="../index.d.ts" />

import { del, get } from "request"
import * as Webdriverio from "webdriverio"
import { Options as WebDriverOptions, Client } from "webdriverio"

interface GetSessionResp {
   value: Array<{id: string}>
}

export class WebdriveioClient {
   private _SESSIONS_URL: string
   private _SESSION_URL_PREFIX: string
   
   constructor(private _options:  WebDriverOptions) {
      this._SESSIONS_URL = "http://127.0.0.1:4444/wd/hub/sessions"
      this._SESSION_URL_PREFIX = "http://127.0.0.1:4444/wd/hub/session"   
   }

   private _delSession(sessionId: string): Promise<void> {
      return new Promise<void>((reject, resolve) => {
         del(`${this._SESSION_URL_PREFIX}/${sessionId}`, {body: "{}"}, (err, resp, body) => {
            if (err) {
               reject(err.code)
            } else {
               resolve()
            }
         })
      })
   }

   private _getSession(): Promise<GetSessionResp> {
      return new Promise<GetSessionResp>((resolve, reject) => {
         get(this._SESSIONS_URL, (err, resp, body) => {
            if (err) {
               reject(err.code)
            } else if (resp.statusCode !== 200) {
               reject(resp.statusCode)
            } else { 
               resolve(JSON.parse(body))
            }
         })
      })
   }

   private _startNewClient(): Array<Client<any>> {
      return [Webdriverio.remote(this._options).init()]
   }

   private _getRunningClient(sessionId: string): Promise<Array<Client<any>>> { 
      const client = Webdriverio.remote(sessionId)
      return client
         .getTitle() // Checking if client window exists
         .then(() => [client]) // returing client if so
         .catch(() => {
            return this._delSession(sessionId) // del the current session with no browser window
               .then(() => this._startNewClient()) // returning new client
         })
   }
   
   public initClient(): Promise<Array<Client<any>>> {
      return this._getSession()
         .then((resp: GetSessionResp) => {
            // means no session exists
            if (!resp.value.length) {
               return this._startNewClient()
            } else {
               return this._getRunningClient(resp.value[0].id)         
            }
         })
   }
}