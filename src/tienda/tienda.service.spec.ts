import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { TiendaEntity } from './tienda.entity';
import { TiendaService } from './tienda.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TiendaService', () => {
  let service: TiendaService;
  let repository: Repository<TiendaEntity>;
  let tiendasList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
    await seedDatabase();
  });
    
  const seedDatabase = async () => {
    repository.clear();
    tiendasList = [];
    for(let i = 0; i < 5; i++){
        const tienda: TiendaEntity = await repository.save({
        nombre: faker.company.name(), 
        direccion: faker.address.secondaryAddress(), 
        telefono: faker.phone.number('##########')})
        tiendasList.push(tienda);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create debe retornar una nueva tienda', async () => {
    const tienda: TiendaEntity = {
      id: "",
      nombre: faker.company.name(),
      direccion: faker.address.secondaryAddress(), 
      telefono: faker.phone.number('##########'),
      cafes: []
    }
 
    const newTienda: TiendaEntity = await service.create(tienda);
    expect(newTienda).not.toBeNull();
 
    const storedTienda: TiendaEntity = await repository.findOne({where: {id: newTienda.id}})
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toEqual(newTienda.nombre)
    expect(storedTienda.direccion).toEqual(newTienda.direccion)
    expect(storedTienda.telefono).toEqual(newTienda.telefono) 
  });

  it('create debe lanzar una excepcion si un telefono de tienda no tiene 10 caracteres', async () => {
    const tienda: TiendaEntity = {
      id: "",
      nombre: faker.company.name(),
      direccion: faker.address.secondaryAddress(), 
      telefono: faker.phone.number('###'),
      cafes: []
    }
    await expect(() => service.create(tienda)).rejects.toHaveProperty("message", "El telefono de la tienda debe tener 10 caracteres")
  });

});
