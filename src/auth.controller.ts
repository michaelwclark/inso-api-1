import { Controller, Get, Post, UseGuards, Request, Body, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { LocalAuthGuard } from "./auth/guards/local-auth.guard";

@Controller()
export class AuthController{
    constructor() {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiTags('User')
  async login(@Request() req){
    //console.log(req);
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  @ApiTags('User')
  getProfile(@Request() req){
    console.log('returned: ' + req.user);
    return req.user;
  }
}