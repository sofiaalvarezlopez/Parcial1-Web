import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CafeEntity } from './cafe.entity';
import { CafeService } from './cafe.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CafeService', () => {
  let service: CafeService;
  let repository: Repository<CafeEntity>;
  let cafesList: CafeEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CafeService],
    }).compile();

    service = module.get<CafeService>(CafeService);
    repository = module.get<Repository<CafeEntity>>(getRepositoryToken(CafeEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    cafesList = [];
    for(let i = 0; i < 5; i++){
        const cafe: CafeEntity = await repository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        precio: 12,  // Tomo precision 0 para que sea un entero
        tiendas: []
      })
        cafesList.push(cafe);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  
  it('create debe retornar un nuevo cafe', async () => {
    const cafe: CafeEntity = {
      id: "",
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      precio: 12, //faker.datatype.float({ min: 1, precision: 0 }),
      tiendas: []
    }
 
    const newCafe: CafeEntity = await service.create(cafe);
    expect(newCafe).not.toBeNull();
 
    const storedCafe: CafeEntity = await repository.findOne({where: {id: newCafe.id}})
    expect(storedCafe).not.toBeNull();
    expect(storedCafe.nombre).toEqual(newCafe.nombre)
    expect(storedCafe.descripcion).toEqual(newCafe.descripcion)
    expect(storedCafe.precio).toEqual(newCafe.precio)
  });

  it('create debe lanzar una excepcion si el precio del cafe es menor o igual a 0', async () => {
    const cafe: CafeEntity = {
      id: "",
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      precio: -30, 
      tiendas: []
    }
    await expect(() => service.create(cafe)).rejects.toHaveProperty("message", "El precio del cafe debe ser positivo")
  });
  

});
