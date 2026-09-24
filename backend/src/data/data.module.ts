import { Module } from '@nestjs/common';
import { DataController } from './data.controller';
import { DataService } from './data.service';
import { SupabaseService } from '../common/supabase.service';

@Module({
  controllers: [DataController],
  providers: [DataService, SupabaseService],
})
export class DataModule {}
