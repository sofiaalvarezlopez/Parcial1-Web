import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeEntity } from './cafe.entity';
import { CafeService } from './cafe.service';

@Module({
  imports: [TypeOrmModule.forFeature([CafeEntity])],
  providers: [CafeService]
})
export class CafeModule {}
