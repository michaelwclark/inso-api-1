import { Controller, Get, Post, UseGuards, Request, Body, Req, Patch, Query, Param, HttpException, HttpStatus } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { PasswordResetDTO } from "src/entities/user/password-reset";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller()
export class AuthController {
    constructor(
      private authService: AuthService
    ) {}

    // Returns JWT token to be used by the client
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiTags('User')
  async login(@Request() req){
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  @ApiTags('User')
  getProfile(@Request() req){
    return req.user;
  }


  @Patch('/users/:userId/reset-password')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ description: "New and old passwords to reset", type: PasswordResetDTO})
  @ApiOkResponse({ description: 'Password updated!'})
  @ApiBadRequestResponse({ description: 'Password is not correct format'})
  @ApiForbiddenResponse({ description: 'User is not permitted to reset password for another user'})
  @ApiTags('User')
  async resetPasswordLoggedIn(
    @Param('userId') userId: string,
    @Body() passwordReset: PasswordResetDTO,
    @Req() req
  ) {
    if(req.user.userId !== userId) {
      throw new HttpException('User is not permitted to reset password for another user', HttpStatus.FORBIDDEN);
    }
    await this.authService.resetPassword(userId, passwordReset.oldPassword, passwordReset.newPassword);
    return 'Password updated!'
  }

  @Patch('/users/reset-password/:ota')
  @ApiTags('User')
  async resetPasswordOta(
    @Param('ota') otaCode: string
  ) {
    // Verify OTA code
  }
  
}