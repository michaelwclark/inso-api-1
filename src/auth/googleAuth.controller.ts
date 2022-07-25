import { Controller, Get, Post, UseGuards, Request, Body, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller('google')
export class GoogleAuthController{
    constructor(
        private authService: AuthService
    ) {}

    @Get()
    @UseGuards(AuthGuard('google'))
    @ApiTags('User')
    async googleAuth(@Req() req) {}

    @Get('redirect')
    @UseGuards(AuthGuard('google'))
    @ApiTags('User')
    googleAuthRedirect(@Req() req) {
        return this.authService.googleLogin(req)
    }
}