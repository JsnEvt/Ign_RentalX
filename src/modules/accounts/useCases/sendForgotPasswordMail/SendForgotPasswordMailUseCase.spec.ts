import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory'
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory'
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/Implementations/DayjsDateProvider'
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory'
import { AppError } from '@shared/errors/AppError'
import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase'

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase
let userRepositoryInMemory: UsersRepositoryInMemory
let dateProvider: DayjsDateProvider
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory
let mailProvider: MailProviderInMemory

describe('Send Forgot Mail', () => {
  beforeEach(() => {

    userRepositoryInMemory = new UsersRepositoryInMemory()
    dateProvider = new DayjsDateProvider()
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory()
    mailProvider = new MailProviderInMemory()
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      userRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider,
    )
  })

  // it('should be able to send a forgot password mail to user', async () => {
  //   //usando o spyOn para ver se algum metodo de alguma classe foi chamado.
  //   const sendMail = spyOn(mailProvider, 'sendMail')

  //   await userRepositoryInMemory.create({
  //     driver_license: '664168',
  //     email: 'js@email.com',
  //     name: 'Jason',
  //     password: '12345'

  //   })
  //   await sendForgotPasswordMailUseCase.execute('js@email.com')
  //   expect(sendMail).toHaveBeenCalled()
  // })

  it('should not be able to send an email if user does not exists', async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute('tata@email.com')
    ).rejects.toEqual(new AppError('User does not exists!'))
  })

  // it('should be able te create a an users token', async () => {
  //   const generateTokenMail = spyOn(usersTokensRepositoryInMemory, 'create')
  //   userRepositoryInMemory.create({

  //     driver_license: '111111',
  //     email: 'aa@email.com',
  //     name: 'AABB',
  //     password: '123456'
  //   })
  //   await sendForgotPasswordMailUseCase.execute('aa@email.com')
  //   expect(generateTokenMail).toBeCalled()
  // })
})