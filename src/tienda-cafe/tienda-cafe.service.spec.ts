import { Test, TestingModule } from '@nestjs/testing';
import { CafeEntity } from '../cafe/cafe.entity';
import { Repository } from 'typeorm';
import { TiendaEntity } from '../tienda/tienda.entity';
import { TiendaCafeService } from './tienda-cafe.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('TiendaCafeService', () => {
  let service: TiendaCafeService;
  let tiendaRepository: Repository<TiendaEntity>;
  let cafeRepository: Repository<CafeEntity>;
  let tienda: TiendaEntity;
  let cafesList : CafeEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaCafeService],
    }).compile();

    service = module.get<TiendaCafeService>(TiendaCafeService);
    tiendaRepository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
    cafeRepository = module.get<Repository<CafeEntity>>(getRepositoryToken(CafeEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    cafeRepository.clear();
    tiendaRepository.clear();

    cafesList = [];
    for(let i = 0; i < 5; i++){
      const cafe: CafeEntity = await cafeRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      precio: 12
    })
      cafesList.push(cafe);
  }
    tienda = await tiendaRepository.save({
      nombre: faker.company.name(),
      direccion: faker.address.secondaryAddress(), 
      telefono: faker.phone.number('##########'),
      cafes: cafesList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addCafeToTienda debe agregar un cafe a una tienda', async () => {
    const newCafe: CafeEntity = await cafeRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      precio: 12
    });
 
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      direccion: faker.address.secondaryAddress(), 
      telefono: faker.phone.number('##########'),
    })
 
    const result: TiendaEntity = await service.addCafeToTienda(newTienda.id, newCafe.id);
   
    expect(result.cafes.length).toBe(1);
    expect(result.cafes[0]).not.toBeNull();
    expect(result.cafes[0].nombre).toBe(newCafe.nombre)
    expect(result.cafes[0].descripcion).toBe(newCafe.descripcion)
    expect(result.cafes[0].precio).toBe(newCafe.precio)
  });

  it('addCafeToTienda debe arrojar una excepcion si el telefono de la tienda es invalido', async () => {
    const newCafe: CafeEntity = await cafeRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      precio: 12
    });
 
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      direccion: faker.address.secondaryAddress(), 
      telefono: faker.phone.number('###'),
    })
 
    await expect(() => service.addCafeToTienda(newTienda.id, newCafe.id)).rejects.toHaveProperty("message", "El telefono de la tienda debe tener 10 caracteres");
  });

  it('addCafeToTienda debe arrojar una excepcion si el precio del cafe no es positivo', async () => {
    const newCafe: CafeEntity = await cafeRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      precio: -28
    });
 
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      direccion: faker.address.secondaryAddress(), 
      telefono: faker.phone.number('###'),
    })
 
    await expect(() => service.addCafeToTienda(newTienda.id, newCafe.id)).rejects.toHaveProperty("message", "El precio del cafe debe ser positivo");
  });

});
