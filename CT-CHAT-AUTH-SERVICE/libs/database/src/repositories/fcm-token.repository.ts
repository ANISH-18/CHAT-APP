import { FCMTokenEntity } from "@database/entities";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";



@Injectable()
export class FcmTokenRepository extends Repository<FCMTokenEntity> {


    constructor(@InjectRepository(FCMTokenEntity) private fcmTokenRepository: Repository<FCMTokenEntity>){
        super(
            fcmTokenRepository.target,
            fcmTokenRepository.manager,
            fcmTokenRepository.queryRunner,
        )
    }

    
    async registerToken(user: any, fcmToken: any, deviceType: any){
        try {
            const newToken = this.fcmTokenRepository.create({
                user, // Pass the full user entity
                fcmToken,
                deviceType, // Use the DEVICE_TYPE enum here
                lastUsed: new Date(),
              });

            return await this.fcmTokenRepository.save(newToken);
        } catch (error) {
            Logger.error("Error while register token in repository")
            throw error;
        }
    }

    async getFcmToken(user_id: string){
        try {
            const tokens = await this.fcmTokenRepository.find({
                where: {
                    user: { user_id: user_id }
                }
            });

            return tokens;
        } catch (error) {
            Logger.error("error while getting fcm token", error)
            throw error;
        }
    }

    async getTokenByDeviceType(user_id: string, deviceType: number){
        try {
            return await this.fcmTokenRepository.findOne({
                where: {
                    user: {
                        user_id: user_id,
                    },
                    deviceType
                }
            })
        } catch (error) {
            Logger.error("Error while getting token")
            throw error;
        }
    }

    async deleteFcmByDeviceType(cred_id: string, deviceType: number)
    {
        console.log("user_id", cred_id);
        
        try {
            return await this.fcmTokenRepository.softDelete({
                user: { cred_id: cred_id},
                deviceType
            })
        } catch (error) {
            Logger.log("error while deleting the fcm token for devicetype in Repo")
            throw error;
        }
    }
}