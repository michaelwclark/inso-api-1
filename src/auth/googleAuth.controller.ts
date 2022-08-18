import { Controller, Get, Post, UseGuards, Request, Body, Req, Res, Redirect } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";

@Controller('google')
export class GoogleAuthController{
    constructor(
        private authService: AuthService
    ) {}

    @Get()
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ description: 'If user is registered it will log the user in once authenticated through Google, if they are not registered they will be added to the database.'})
    @ApiTags('User')
    async googleAuth(@Req() req) {}

    @Get('redirect')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ description: 'Redirect from Google. Not used for anything else'})
    @Redirect(process.env.SSO_REDIRECT)
    @ApiTags('User')
    async googleAuthRedirect(@Req() req, @Res() res) {
        const jwt = await this.authService.googleLogin(req);
        return { url: process.env.SSO_REDIRECT + `?t=` + jwt.access_token};
    }
}