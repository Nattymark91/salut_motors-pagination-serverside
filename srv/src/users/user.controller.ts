import { UserService } from './users.service';
import { Controller, Get, Logger, Query } from '@nestjs/common';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(@Query('page') page:number, @Query('limit') limit:number) {
    this.logger.log('Get all users');
    const users = await this.userService.findAll(+page, +limit);
    return users;
  }
}
