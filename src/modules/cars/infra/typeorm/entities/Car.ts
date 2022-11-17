import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid'
import { Category } from './Category';

@Entity('cars')
class Car {
  @PrimaryColumn()
  id: string;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  daily_rate: number;
  @Column()
  available: boolean;
  @Column()
  license_plate: string;
  @Column()
  fine_amount: number;
  @Column()
  brand: string;

  //Por estarmos trabalhando com chave estrangeira, 
  //prosseguiremos criando uma JoinColumn com o nome da coluna desta tabela.
  //Com o TypeORM

  @ManyToOne(() => Category) //Muitos carros poderao pertencer a um categoria
  @JoinColumn({ name: 'category_id' })
  category: Category

  @Column()
  category_id: string;

  @CreateDateColumn()
  created_at: Date

  constructor() {
    if (!this.id) {
      this.id = uuidv4()
      this.available = true
    }
  }

}

export { Car }