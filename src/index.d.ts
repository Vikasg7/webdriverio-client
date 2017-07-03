declare namespace WebdriverIO {
   function remote(sessionId?: string): Client<void>;
   
   interface Client<T> {      
      then<P>(
         onFulfilled?: (value: T) => P | Promise<P>,
         onRejected?: (error: any) => P | Promise<P>
      ): Promise<P>;

      catch<P>(
         onRejected?: (error: any) => P | Promise<P>
      ): Promise<P>;
   }
}