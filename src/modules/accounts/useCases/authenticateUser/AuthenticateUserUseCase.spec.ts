import { AppError } from '@shared/errors/AppError'
import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory'
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase'
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory'
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/Implementations/DayjsDateProvider'

let authenticateUserUseCase: AuthenticateUserUseCase
let usersRepositoryInMemory: UsersRepositoryInMemory
let userTokensRepositoryInMemory: UsersTokensRepositoryInMemory
let createUserUseCase: CreateUserUseCase
let dateProvider: DayjsDateProvider

describe('Authentiate User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory()
    userTokensRepositoryInMemory = new UsersTokensRepositoryInMemory()
    dateProvider = new DayjsDateProvider()
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      userTokensRepositoryInMemory,
      dateProvider)

    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })

  //AQUI ELE VERIFICA SE O EMAIL E EXISTENTE.
  it('should be able to authenticate an user', async () => {
    const user: ICreateUserDTO = {
      driver_license: '000123',
      email: 'user@teste.com',
      password: '1234',
      name: 'User Teste'
    }
    await createUserUseCase.execute(user)

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })
    expect(result).toHaveProperty('token')
  })

  it('should not be able to authenticate a nonexistent user', async () => {
    await expect(authenticateUserUseCase.execute({
      email: 'false@email.com',
      password: '1234',
    })

    ).rejects.toEqual(new AppError('Email or password incorrect!'))
  })

  //verificando se a senha e invalida
  it('should not be able to authenticated with incorrect password', async () => {
    const user: ICreateUserDTO = {
      driver_license: '9999',
      email: 'user@user.com',
      password: '1234',
      name: 'User Test Error'
    }
    await createUserUseCase.execute(user)

    await expect(authenticateUserUseCase.execute({
      email: user.email,
      password: 'incorrectPassword'
    })
    ).rejects.toEqual(new AppError('Email or password incorrect!'))
  })
})

