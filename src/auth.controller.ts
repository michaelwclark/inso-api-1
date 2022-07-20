import { Controller, Get, Post, UseGuards, Request, Body, Req } from "@nestjs/common";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { LocalAuthGuard } from "./auth/local-auth.guard";

@Controller()
export class AuthController{
    constructor() {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req){
    console.log(req);
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req){
    console.log('returned: ' + req.user);
    return req.user;
  }
}