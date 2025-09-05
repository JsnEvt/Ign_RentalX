import { ICarRepository } from '@modules/cars/repositories/ICarRepository';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';


interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

@injectable()
class CreateRentalUseCase {

  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
    @inject('CarsRepository')
    private carsRepository: ICarRepository

  ) { }
  async execute({ car_id, expected_return_date, user_id }: IRequest): Promise<Rental> {
    const minimumHour = 24
    //Nao deve ser possivel cadastrar um aluguel novo caso ja exista um aberto para o mesmo carro.
    const carUnavailable = await this.rentalsRepository.findOpenRentalByCar(car_id)
    if (carUnavailable) {
      throw new AppError('Car is unavailable')
    }
    //Nao deve ser possivel cadastrar um novo aluguel caso exista um aberto para o mesmo usuario
    const rentalOpenToUser = await this.rentalsRepository.findOpenRentalByUser(user_id)
    if (rentalOpenToUser) {
      throw new AppError('There is a rental in progress for user!')
    }

    //O aluguel deve ter duracao minima de 24 horas

    const dateNow = this.dateProvider.dateNow()

    const compare = this.dateProvider.compareInHours(dateNow, expected_return_date)

    if (compare < minimumHour) {
      throw new AppError('Invalid return time!')
    }

    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date,
    })

    await this.carsRepository.updateAvailable(car_id, false)

    return rental
  }
}
export { CreateRentalUseCase }