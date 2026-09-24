import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { DataService } from './data.service';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get()
  async getAll(@Req() req: Request) {
    const token = req.headers.authorization?.substring(7) || '';
    return this.dataService.loadAll(token);
  }
}
