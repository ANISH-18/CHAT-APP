import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitmqService {
    constructor(@Inject('AUTH_SERVICE') private readonly authQueue: ClientProxy){}



    //*
    /* role
    /* parent_id
    /* conversationId, email, redirect-uri, state 
    //        */
    async getUriAndFcmTokens(payload: any){
        try {
            // Logger.log('Payload', payload)
            let prepPayload = {
                redirect_uri: "https://dev.ct.chat.onpointsoft.com",
                user_id: payload.user_id,
                conversationId: payload.conversationId,
                authorRole: payload.authorRole,
                state: "12345355",
                isActive: payload.isActive
            }
            const response = await this.authQueue.send({cmd: 'generate.chat.uri'}, prepPayload).toPromise();
            // Logger.log(response,"res")
            return response;
        } catch (error) {
            Logger.error("Error WHile Emit the event to get URI")
            throw error;
        }
    }


    //Verify API-Key with Auth Service
    async verifyAPIKey(apiKey: string) {
        try {
          //verify API KEY in AUTH SERVICE
          //Boolean Value
          const response = await this.authQueue
            .send<boolean>({ cmd: 'verify.api.key' }, { apiKey })
            .toPromise();
    
          return response;
        } catch (error) {
            Logger.error("Error WHile Emit the event to verify Api Key")
            throw error;
        }
      }
}
