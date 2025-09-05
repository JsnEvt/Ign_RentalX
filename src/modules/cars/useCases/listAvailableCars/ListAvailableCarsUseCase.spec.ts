import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory'
import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase'

let carsRepositoryInMemory: CarsRepositoryInMemory
let listAvailableCarsUseCase: ListAvailableCarsUseCase

describe('List cars', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory()
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(carsRepositoryInMemory)

  })
  it('should be able to list all available cars', async () => {

    const car = await carsRepositoryInMemory.create(
      {
        name: "Kombi1",
        description: "Utilitario medio",
        daily_rate: 110,
        license_plate: "KOM-4321",
        fine_amount: 70,
        brand: "VW",
        category_id: "category_id"
      }
    )
    const cars = await listAvailableCarsUseCase.execute({})
    //  console.log(cars) // nao esta gerando um id?!?!? .... pq?!?
    // console.log(cars.length) OK
    expect(cars).toEqual([car])
  })

  it('should be able to list all available cars by brand', async () => {

    const car = await carsRepositoryInMemory.create(
      {
        name: "Car3",
        description: "Simple car",
        daily_rate: 110,
        license_plate: "SIM-4321",
        fine_amount: 70,
        brand: "Car_brand_test",
        category_id: "category_id"
      }
    )
    const cars = await listAvailableCarsUseCase.execute({
      brand: 'Car_brand_test'
    })
    console.log(cars)
    expect(cars).toEqual([car])
  })

  it('should be able to list all available cars by name', async () => {

    const car = await carsRepositoryInMemory.create(
      {
        name: "Car5",
        description: "Simple car",
        daily_rate: 110,
        license_plate: "CAR-1212",
        fine_amount: 70,
        brand: "Car_brand_test",
        category_id: "category_id"
      }
    )
    const cars = await listAvailableCarsUseCase.execute({
      name: 'Car5'
    })
    expect(cars).toEqual([car])
  })


  it('should be able to list all available cars by category', async () => {

    const car = await carsRepositoryInMemory.create(
      {
        name: "Car5",
        description: "Simple car",
        daily_rate: 110,
        license_plate: "CAR-1212",
        fine_amount: 70,
        brand: "Car_brand_test",
        category_id: "12345"
      }
    )
    const cars = await listAvailableCarsUseCase.execute({
      category_id: '12345'
    })
    expect(cars).toEqual([car])
  })

})