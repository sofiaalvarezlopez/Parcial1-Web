import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CafeEntity } from '../cafe/cafe.entity';
import { TiendaEntity } from '../tienda/tienda.entity';

@Injectable()
export class TiendaCafeService {

    constructor(
        @InjectRepository(CafeEntity)
        private readonly cafeRepository: Repository<CafeEntity>,
    
        @InjectRepository(TiendaEntity)
        private readonly tiendaRepository: Repository<TiendaEntity>
    ) {}

    async addCafeToTienda(tiendaId: string, cafeId: string): Promise<TiendaEntity> {
        const cafe: CafeEntity = await this.cafeRepository.findOne({where: {id: cafeId}});
        if (!cafe)
          throw new BusinessLogicException("El cafe con el ID dado no fue encontrado", BusinessError.NOT_FOUND);

        if (cafe.precio <= 0)
          throw new BusinessLogicException("El precio del cafe debe ser positivo", BusinessError.NOT_FOUND);
      
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}, relations: ["cafes"]})
        if (!tienda)
          throw new BusinessLogicException("La tienda con el id dado no fue encontrada", BusinessError.NOT_FOUND);
        
        if (tienda.telefono.length !== 10)
          throw new BusinessLogicException("El telefono de la tienda debe tener 10 caracteres", BusinessError.NOT_FOUND);
    
        tienda.cafes = [...tienda.cafes, cafe];
        return await this.tiendaRepository.save(tienda);
      }
}
