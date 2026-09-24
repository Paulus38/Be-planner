import {
  Controller, Get, Post, Put, Delete,
  Req, Query, Body, Param, BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { CrudService } from './crud.service';

@Controller()
export class CrudController {
  constructor(private readonly crudService: CrudService) {}

  @Get(':table')
  async getAll(
    @Param('table') table: string,
    @Query() query: any,
    @Req() req: Request,
  ) {
    const token = req.headers.authorization?.substring(7) || '';
    return this.crudService.getAll(table, query, token);
  }

  @Post(':table')
  async insert(
    @Param('table') table: string,
    @Body() body: any,
    @Req() req: Request,
  ) {
    const token = req.headers.authorization?.substring(7) || '';
    return this.crudService.insert(table, body, token);
  }

  @Put(':table')
  async update(
    @Param('table') table: string,
    @Query() query: any,
    @Body() body: any,
    @Req() req: Request,
  ) {
    const token = req.headers.authorization?.substring(7) || '';
    return this.crudService.update(table, query, body, token);
  }

  @Delete(':table')
  async remove(
    @Param('table') table: string,
    @Query() query: any,
    @Req() req: Request,
  ) {
    const token = req.headers.authorization?.substring(7) || '';
    return this.crudService.remove(table, query, token);
  }
}
