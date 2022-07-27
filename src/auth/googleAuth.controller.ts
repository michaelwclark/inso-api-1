import { Controller, Get, Post, UseGuards, Request, Body, Req } from "@nestjs/common";
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
    @ApiTags('User')
    googleAuthRedirect(@Req() req) {
        return this.authService.googleLogin(req)
    }
}