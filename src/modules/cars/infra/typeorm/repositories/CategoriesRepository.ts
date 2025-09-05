import { getRepository, Repository } from 'typeorm';
import { ICategoriesRepository, ICreateCategoryDTO } from '@modules/cars/infra/typeorm/repositories/ICategoriesRepository';
import { Category } from '../entities/Category';

//DTO = Data Transfer Object para criar objetos que estao vindo das rotas

// SINGLETON - INSTANCIA UNICA 

class CategoriesRepository implements ICategoriesRepository {

  private repository: Repository<Category>

  // private static INSTANCE: CategoriesRepository

  constructor() {
    this.repository = getRepository(Category)
  }

  // public static getInstance(): CategoriesRepository {
  //   if (!CategoriesRepository.INSTANCE) {
  //     CategoriesRepository.INSTANCE = new CategoriesRepository()
  //   }
  //   return CategoriesRepository.INSTANCE
  // }

  async create({ name, description }: ICreateCategoryDTO): Promise<void> {
    const category = this.repository.create({
      name,
      description,
    })
    await this.repository.save(category)
  }

  async list(): Promise<Category[]> {
    const categories = await this.repository.find()
    return categories
  }

  async findByName(name: string): Promise<Category> {
    const category = await this.repository.findOne({ name })
    return category
  }

}

export { CategoriesRepository }