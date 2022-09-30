import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CafeEntity } from './cafe.entity';

@Injectable()
export class CafeService {

    constructor(
        @InjectRepository(CafeEntity)
        private readonly cafeRepository: Repository<CafeEntity>
    ){}

    async create(cafe: CafeEntity): Promise<CafeEntity> {
        if (cafe.precio <= 0) {
            throw new BusinessLogicException("El precio del cafe debe ser positivo", BusinessError.PRECONDITION_FAILED);
        }
        return await this.cafeRepository.save(cafe);
    }

    async findOne(id: string): Promise<CafeEntity> {
        const cafe: CafeEntity = await this.cafeRepository.findOne({where: {id}, relations: ["tiendas"] } );
        if (!cafe)
          throw new BusinessLogicException("El cafe con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
        return cafe;
    }

}

