import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-naver";
import { Provider } from "src/user/entities/provider.enum";
import { UserService } from "src/user/user.service";





@Injectable()
export class NaverAuthStrategy extends PassportStrategy(
    Strategy,
    Provider.NAVER) {


        constructor(
            private readonly configService : ConfigService,
            private readonly userService : UserService
        ) {

            super({
                clientID : configService.get('NAVER_AUTH_CLIENTID'),
                clientSecret : configService.get('NAVER_AUTH_CLIENT_SECRET'),
                callbackURL : configService.get('NAVER_AUTH_CALLBACK_URL'),

            })
        }
   
   
        async validate(
            _accesstoken : string,
            _refreshtoken : string,
            profile : any,
            done : any,)

        {
            const {provider} = profile
            const {email, nickname, profile_image} = profile._json

            try {

                const user = await this.userService.findUserByEmail(email)
                done(null, user)

            } catch(e) {
                if (e.status === 404) {
                    const newuser = await this.userService.createUser({
                        nickname,
                        email,
                        provider,
                        profileImge : profile_image})
                      
                    done(null, newuser)
                }
            }
        }
  
    }


