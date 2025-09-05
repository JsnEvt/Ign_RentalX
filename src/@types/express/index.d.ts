//sobrescrevendo tipagens
//nesse caso, estamos adicionando a tipagem user/id no request para podermos trabalhar no arquivo de 
//ensureAuthenticated.ts

declare namespace Express {
  export interface Request {
    user: {
      id: string
    }
  }
}