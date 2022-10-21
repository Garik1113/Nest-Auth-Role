import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @MessagePattern('create_user')
  async createNewUser(data: any) {
    const newUser = await this.authService.register(data);
    return {
      id: newUser.id,
      email: newUser.email,
    };
  }

  @MessagePattern('login_with_credintails')
  async loginWithCredintails(data: any) {
    const user = await this.authService.validateUser(data.email, data.password);
    if (user) return this.authService.createToken(user);

    return { access_token: null };
  }

  @MessagePattern('get_user_roles')
  async getUserRoles(data: any) {
    const { access_token } = data;
    return await this.authService.getUserByToken(access_token);
  }

  @MessagePattern('update_user')
  async updateUser(userData: any) {
    await this.userService.updateUser(userData);
    return {
      message: 'updated',
    };
  }
}
