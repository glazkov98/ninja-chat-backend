import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUserRequestDto } from './dto/auth-user.request.dto';
import { TokenResponseDto } from './dto/token.response.dto';
import { UserResponseDto } from 'src/user/dto/user.response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Авторизация' })
  @ApiOkResponse({
    type: TokenResponseDto,
  })
  @Post('/login')
  login(
    @Body() authDto: AuthUserRequestDto,
  ): Promise<boolean | TokenResponseDto> {
    return this.authService.login(authDto);
  }

  @ApiOperation({ summary: 'Получение нового токена' })
  @ApiOkResponse({
    type: TokenResponseDto,
  })
  @Post('/refresh')
  refreshToken(@Body() userDto: UserResponseDto): TokenResponseDto {
    return this.authService.generateToken(userDto);
  }

  @ApiOperation({ summary: 'Обновление токена и проверка юзера' })
  @ApiOkResponse({
    type: TokenResponseDto,
  })
  @Post('/verify')
  verify(@Body() jwt: TokenResponseDto): Promise<TokenResponseDto> {
    return this.authService.verify(jwt);
  }
}
