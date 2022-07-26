import { Controller, Get, Post, UseGuards, Request, Body, Req, Patch, Query, Param, HttpException, HttpStatus } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiProperty, ApiResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { PasswordResetDTO } from "src/entities/user/password-reset";
import { UserReadDTO } from "src/entities/user/read-user";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";

class LoginDTO {
  @ApiProperty({
    name: 'email',
    description: 'The email of the user',
    required: true,
    type: String,
    example: 'example@example.com'
  })
  "email": string;

  @ApiProperty({
    name: 'password',
    description: 'The password of the user',
    required: true,
    type: String,
    example: 'Password#23333'
  })
  "password": string;
}

class TokenDTO {
  @ApiProperty({
    name: 'access_token',
    description: 'The bearer token that was created for the user',
    required: true,
    type: String
  })
  "access_token": string;
}

@Controller()
export class AuthController {
    constructor(
      private authService: AuthService
    ) {}

    // Returns JWT token to be used by the client
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiBody({ type: LoginDTO })
  @ApiOkResponse({ type: TokenDTO })
  @ApiUnauthorizedResponse({ description: 'The password is not correct'})
  @ApiBadRequestResponse({ description: 'User is signed up with SSO'})
  @ApiNotFoundResponse({ description: 'Account does not exist for email'})
  @ApiTags('User')
  async login(@Request() req){
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  @ApiTags('User')
  @ApiOkResponse({ description: 'Profile found!', type: UserReadDTO})
  async getProfile(@Request() req): Promise<UserReadDTO> {
    const user = await this.authService.fetchUserAndStats(req.user.userId);
    return user;
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