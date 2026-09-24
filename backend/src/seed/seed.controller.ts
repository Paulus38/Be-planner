import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  async seed(@Req() req: Request) {
    const token = req.headers.authorization?.substring(7) || '';
    return this.seedService.seedDefaultData(token);
  }
}
