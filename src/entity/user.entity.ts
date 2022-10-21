import { hash } from 'bcrypt';
import { IsEmail } from 'class-validator';
import { Entity, Column, Unique, BeforeInsert } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

export interface IUserPermissions {
  roles: string[];
}

export const defaultUserPermissions: IUserPermissions = {
  roles: ['buyer'],
};

@Entity({ name: 'users' })
@Unique(['email'])
export class User extends AbstractEntity {
  @IsEmail()
  @Column({ type: 'varchar', length: 300 })
  email: string;

  @Column({ type: 'varchar', length: 300 })
  password: string;

  @Column({ type: 'jsonb', default: defaultUserPermissions, nullable: true })
  permissions: IUserPermissions;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}
