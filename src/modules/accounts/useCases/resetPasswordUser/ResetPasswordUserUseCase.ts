import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { hash } from 'bcryptjs'


interface IRequest {
  token: string;
  password: string
}


@injectable()
class ResetPasswordUserUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {
  }
  async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.usersTokensRepository.findByRefreshToken(token)

    //comparando atraves da data de requisicao e data de validade do token 
    //verificando se a data esta expirada



    if (!userToken) {
      throw new AppError('Token invalid!')
    }

    // a linha abaixo verifica se o token ainda e valido por ter/ou nao, expirado. 
    // data de expiracao x data de agora
    // se retornar true, indica q o token esta expirado.
    if (this.dateProvider.compareIfBefore(userToken.expires_date, this.dateProvider.dateNow())) {
      throw new AppError('Token expired!')
    }
    // caso nao esteja expirado, podera fazer a alteracao:
    const user = await this.usersRepository.findById(userToken.user_id)
    user.password = await hash(password, 8)
    await this.usersRepository.create(user)
    await this.usersTokensRepository.deleteById(userToken.id)

  }
}

export { ResetPasswordUserUseCase }