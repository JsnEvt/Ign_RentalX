import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory'
import { SpecificationsRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory'
import { AppError } from '@shared/errors/AppError'
import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase'

let createCarSpecificationUseCase: CreateCarSpecificationUseCase
let carsRepositoryInMemory: CarsRepositoryInMemory
let specificationRepositoryInMemory: SpecificationsRepositoryInMemory

describe('Create car specification', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory()
    specificationRepositoryInMemory = new SpecificationsRepositoryInMemory
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(carsRepositoryInMemory, specificationRepositoryInMemory)
  })


  it('should not be able to add a new specification to a non-existent car', async () => {
    expect(async () => {
      const car_id = '1234'
      const specifications_id = ['54321']
      await createCarSpecificationUseCase.execute({
        car_id,
        specifications_id
      })
    }).rejects.toBeInstanceOf(AppError)
  })


  it('should be able to add a new specification to the car', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'CarZ',
      description: "description carZ",
      daily_rate: 100,
      license_plate: 'ZZZ-1234',
      fine_amount: 60,
      brand: 'Brand',
      category_id: 'category'

    })
    const specifications_id = ['54321']
    await createCarSpecificationUseCase.execute({ car_id: car.id, specifications_id })
  })


})