import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { ICarRepository } from '@modules/cars/repositories/ICarRepository';
import { getRepository, Repository } from 'typeorm';
import { Car } from '../entities/Car';


class CarsRepository implements ICarRepository {

  private repository: Repository<Car>

  constructor() {
    this.repository = getRepository(Car)
  }
  async create(
    {
      brand,
      category_id,
      daily_rate,
      description,
      fine_amount,
      license_plate,
      name
    }: ICreateCarDTO): Promise<Car> {

    const car = this.repository.create({
      brand,
      category_id,
      daily_rate,
      description,
      fine_amount,
      license_plate,
      name

    })
    await this.repository.save(car)

    return car
  }
  async findByLicensePlate(license_plate: string): Promise<Car> {
    const car = await this.repository.findOne({
      license_plate
    })
    return car
  }

}

export { CarsRepository }