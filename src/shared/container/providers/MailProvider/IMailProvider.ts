

//Refatorando essa interface para receber o template "html/hbs - handlebars"
//variables e path

interface IMailProvider {
  sendMail(to: string, subject: string, variables: any, path: string): Promise<void>
}

export { IMailProvider }