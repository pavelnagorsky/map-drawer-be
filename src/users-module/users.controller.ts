import { Body, Controller, Get, Param, ParseIntPipe, Post, NotFoundException, UseGuards } from "@nestjs/common";

import { HttpAuthGuard } from "src/services/guards/http-auth.guard";
import { UsersService } from "src/users-module/users-service/users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get(':id')
  // @UseGuards(HttpAuthGuard)
  // async getOne(@Param('id', ParseIntPipe) id: number) {
  //   const user = await this.usersService.findOne(id);
  //   if (!user) throw new NotFoundException('No user found');
  //   return user;
  // }

  @Post('signup')
  async register(@Body() userInfo: CreateUserDto) {
    const newUser = await this.usersService.create(userInfo);
    return {
      message: 'New user successfully registered',
      _id: newUser.id
    };
  }

  @Post('login')
  async login(@Body() userInfo: LoginUserDto) {
    const { token, expiresIn, userId, username } = await this.usersService.login(userInfo);
    return {
      message: 'User successfully authenticated',
      token,
      expiresIn,
      userId,
      username
    }
  }
}