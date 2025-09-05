import { AppError } from '@shared/errors/AppError';
import { UsersRepository } from '@modules/accounts/infra/typeorm/repositories/UsersRepository';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken'
import { UsersTokensRepository } from '@modules/accounts/infra/typeorm/repositories/UsersTokensRepository';
import auth from '@config/auth';

interface IPayload {
  sub: string
}

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization
  //alteracao por causa do refresh Token

  if (!authHeader) {
    throw new AppError("Token missing", 401)
  }
  //Pegando o token atraves do Bearer informado na aba Bearer do Insomnia
  const [, token] = authHeader.split(' ')
  try {
    const { sub: user_id } = verify(token, auth.secret_token) as IPayload
    //o sub veio como resposta da requisicao do Insomnia na aba Bearer
    // const usersRepository = new UsersRepository()

    request.user = {
      id: user_id
    }

    next()
  } catch (e) {
    throw new AppError('Invalid token!', 401)
  }
}