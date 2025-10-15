import {
  Controller,
  Get,
  Query,
  Logger,
  Res,
  HttpStatus,
  Body,
  UseGuards,
  Post,
  Req,
} from '@nestjs/common';
import { ApiKeyService, OauthService } from './oauth.service';
import { AuthorizeRequestDto } from './dto/create-oauth.dto';
import { ExchangeAuthCode } from './dto/exchange_auth_code.dto';
import { AuthorizationCode, AuthorizeGuard } from '@jwt_auth';
import { Request } from 'express';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Controller('oauth')
export class OauthController {
  constructor(
    private readonly oauthService: OauthService,
    private readonly apiKeyService: ApiKeyService,
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @UseGuards(AuthorizeGuard)
  @Get('/authorize')
  async handelAuthorize(
    @Query() authorizeRequest: AuthorizeRequestDto,
    @Req() req: Request,
  ) {
    const { redirect_uri, state, conversationId, authorRole } =
      authorizeRequest;

    const userIp = req.ip;
    const authorizationCode = await this.oauthService.handelAuthorize(
      authorizeRequest,
      userIp,
    );

    if (conversationId) {
      const redirect_url = `${redirect_uri}?authorization_code=${authorizationCode.auth_code}&state=${state}&user_id=${authorizationCode.user_id}&conversationId=${conversationId}&authorRole=${authorRole}`;
      return {
        message: 'Success',
        data: redirect_url,
      };
    }

    const redirect_url = `${redirect_uri}?authorization_code=${authorizationCode.auth_code}&state=${state}&user_id=${authorizationCode.user_id}`;

    return {
      message: 'Success',
      data: redirect_url,
    };
  }

  @UseGuards(AuthorizationCode)
  @Get('/token')
  async handelToken(@Query() exchangeAuthCode: ExchangeAuthCode) {
    try {
      return await this.oauthService.handelToken(exchangeAuthCode);
    } catch (error) {
      throw error;
    }
  }

  @Get('/ip')
  async getIp(@Req() req: Request) {
    const userIP = req.ip;
    Logger.log(`NEW IP`);

    Logger.log(`USER IP ${userIP}`);
    return userIP;
  }

  @MessagePattern({ cmd: 'verify.api.key' })
  async verifyAPIKey(@Payload() data: any, @Ctx() context: RmqContext) {
    return await this.apiKeyService.verifyAPIkey(data);
  }

  @MessagePattern({ cmd: 'generate.chat.uri' })
  async generateOauthUri(@Payload() payload: any, @Ctx() context: RmqContext) {
    Logger.log('Payload from notification for internalUri', payload);
    try {

      const verifyChatEnable = await this.userService.verifyChatEnable(payload.user_id);
      if (!verifyChatEnable.chatEnabled) {
        Logger.warn(`Chat is not enabled for user_id: ${payload.user_id}`);
        return { chatEnable: verifyChatEnable.chatEnabled };
      }

      const { redirect_uri, conversationId, authorRole, state, isActive } = payload;
      const [authorizationCode, FcmTokens] = await Promise.all([
        this.apiKeyService.generateInternalUri(payload),
        this.authService.getFcmTokens({user_id: payload.user_id})
      ]);
      // Logger.log("FCM TOKENS", FcmTokens)

      let redirect_url: string;
      
      if (conversationId) {
        Logger.log('Conve');
        redirect_url = `${redirect_uri}?authorization_code=${authorizationCode.auth_code}&state=${state}&user_id=${authorizationCode.user_id}&conversationId=${conversationId}&authorRole=${authorRole}`;
        Logger.log('URI with conversationId', redirect_url);
      } else {
        redirect_url = `${redirect_uri}?authorization_code=${authorizationCode.auth_code}&state=${state}&user_id=${authorizationCode.user_id}`;
        Logger.log('URI without conversationId', redirect_url);
      }

      if(isActive)
      {
        redirect_url = null;
      }
      return { redirect_url: redirect_url,  FcmTokens };
    } catch (error) {
      Logger.error('Error While Generating Auth-Code');
      throw error;
    }
  }
}
