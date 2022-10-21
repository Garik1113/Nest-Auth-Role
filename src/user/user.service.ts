import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(userData: any): Promise<User> {
    const user = new User();
    user.email = userData.email;
    user.password = userData.password;
    user.permissions = {
      roles: userData.roles,
    };
    await this.userRepository.save(user);
    return user;
  }

  async findOne(user: Partial<User>): Promise<User | null> {
    const { email } = user;
    return await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(email) = :email', { email: email.toLowerCase() })
      .getOne();
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async updateUser(updateUserParams: any) {
    const { id, roles } = updateUserParams;
    if (!roles || !roles.length) return;
    const userResult = await this.userRepository.findOne({
      where: { id },
      select: ['permissions'],
    });
    if (!userResult) throw new BadRequestException('User not found');
    userResult.permissions.roles = roles;
    await this.userRepository
      .createQueryBuilder('user')
      .update()
      .set({ permissions: userResult.permissions })
      .where('id = :id', { id: id })
      .execute();
  }
}
