import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  async findAll(page: number, limit: number): Promise<{ rows: UsersEntity[]; count: number }> {
    const [rows, count] = await this.usersRepo.findAndCount({
        take: limit,
        skip: (page - 1) * limit,
      });
      return {rows, count};
  }
}
