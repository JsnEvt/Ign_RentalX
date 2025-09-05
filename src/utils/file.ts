import fs from 'fs'

export const deleteFile = async (filename: string) => {
  //stat verifica se um arquivo existe na url/diretorio
  try {
    await fs.promises.stat(filename)

  } catch (e) {
    return
  }
  await fs.promises.unlink(filename) //unlink remove o arquivo caso exista.
}