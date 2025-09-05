import { CarImage } from '../entities/CarImage';

class ICarsImagesRepository {
  async create(car_id: string, image_name: string): Promise<CarImage> {
    return
  }
  // async updateAvailable(car_id: string, available: boolean): Promise<CarImage> {
  //   return
  // }

}

export { ICarsImagesRepository }