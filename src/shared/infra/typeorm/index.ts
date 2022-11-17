import { Connection, createConnection, getConnectionOptions } from 'typeorm';

// interface IOptions {
//   host: string;
// }

// getConnectionOptions().then(options => {
//   const newOptions = options as IOptions;
//   newOptions.host = 'database_ignite'
//   createConnection({
//     ...options,
//   })
// })

export default async (host = 'database_ignite'): Promise<Connection> => {
  const defaulOptions = await getConnectionOptions()

  return createConnection(
    Object.assign(defaulOptions, {
      host,
    })
  )
}