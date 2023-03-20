import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/db/interfaces/user.interface';
import { UserService } from 'src/user/user.service';
import { AuthUserRequestDto } from './dto/auth-user.request.dto';
import { TokenResponseDto } from './dto/token.response.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(authDto: AuthUserRequestDto): Promise<boolean | TokenResponseDto> {
    let user = await this.userService.getUserBySocialId(authDto.type, authDto.socialId);
    if (!user) user = await this.userService.createUser({ socialId: authDto.socialId, type: authDto.type });

    return this.generateToken(user);
  }

  generateToken(user: User): TokenResponseDto {
    const payload = { id: user.id };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async verify(jwt: TokenResponseDto): Promise<TokenResponseDto> {
    const { token } = jwt;
    const userJwt = this.jwtService.verify(token);
    const user = await this.userService.getUserById(userJwt.id);
    if (!user) throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);

    return this.generateToken(user);
  }

}
