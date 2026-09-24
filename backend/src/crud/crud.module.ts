import { Module } from '@nestjs/common';
import { CrudController } from './crud.controller';
import { CrudService } from './crud.service';
import { SupabaseService } from '../common/supabase.service';

@Module({
  controllers: [CrudController],
  providers: [CrudService, SupabaseService],
})
export class CrudModule {}
