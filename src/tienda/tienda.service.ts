import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { TiendaEntity } from './tienda.entity';

@Injectable()
export class TiendaService {

    constructor(
        @InjectRepository(TiendaEntity)
        private readonly tiendaRepository: Repository<TiendaEntity>
    ){}

    async create(tienda: TiendaEntity): Promise<TiendaEntity> {
        if (tienda.telefono.length !== 10) {
            throw new BusinessLogicException("El telefono de la tienda debe tener 10 caracteres", BusinessError.NOT_FOUND);
        }
        return await this.tiendaRepository.save(tienda);
    }

    async findOne(id: string): Promise<TiendaEntity> {
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id}, relations: ["cafes"] } );
        if (!tienda)
          throw new BusinessLogicException("La tienda con el ID dado no existe", BusinessError.NOT_FOUND);
   
        return tienda;
    }
}
