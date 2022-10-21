import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: any): Promise<any> {
    const user = await this.userService.create(createUserDto);
    delete user.password;

    return user;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne({ email });

    if (!user) throw new UnauthorizedException();
    const passwordsMatch = await compare(password, user.password);
    if (passwordsMatch) {
      return {
        id: user.id,
      };
    }
    return null;
  }

  async createToken(user: any) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getUserById(id: number): Promise<any> {
    const user = await this.userService.findById(id);

    if (!user) throw new UnauthorizedException();

    return {
      id: user.id,
      email: user.email,
      roles: user.permissions.roles,
    };
  }

  async getUserByToken(access_token: string) {
    const decodeData = this.jwtService.decode(access_token);
    if (!decodeData) throw UnauthorizedException;
    const userId = decodeData.sub;
    return this.getUserById(userId);
  }
}
