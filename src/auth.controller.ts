import { Controller, Get, Post, UseGuards, Request, Body, Req } from "@nestjs/common";
import { AuthService } from "./auth/auth.service";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { LocalAuthGuard } from "./auth/local-auth.guard";

@Controller()
export class AuthController{
    constructor(private authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  // @Post('auth/login')
  // async login(@Request() req){
  //   return this.authService.login(req.user);
  // }

  // //@UseGuards(JwtAuthGuard)
  // @Get('/profile')
  // getProfile(@Request() req){
  //   console.log('returned: ' + req.user);
  //   return req.user;
  // }
}