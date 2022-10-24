import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/users-module/dto/create-user.dto';
import { AuthService } from '../auth-service/auth.service';
import { LoginUserDto } from 'src/users-module/dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private authService: AuthService
  ) {}

  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id })
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  // регистрация
  async create(userData: CreateUserDto) {
    // проверка, существует ли пользователь с таким email
    const existingUser = await this.usersRepository.findOneBy({ email: userData.email });
    if (existingUser) throw new UnauthorizedException('User with this email already exists');
    // шифровка пароля
    const hashedPw = await this.authService.hashPassword(userData.password);
    // сохраняем пользователя в бд
    const user = await this.usersRepository.save({
      username: userData.username,
      email: userData.email,
      password: hashedPw
    });
    return user;
  }

  // авторизация
  async login(userData: LoginUserDto) {
    // проверка, существует ли пользователь с таким email
    const user = await this.usersRepository.findOneBy({ email: userData.email });
    if (!user) throw new UnauthorizedException('No users with this email found');
    // проверка на идентичность паролей
    const isPwEqual = await this.authService.checkPwEquality(userData.password, user.password);
    if (!isPwEqual) throw new UnauthorizedException('Password is incorrect');
    const data = this.authService.getToken({
      userId: user.id,
      username: user.username
    });
    return data;
  }
}