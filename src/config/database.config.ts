import { DataSource, DataSourceOptions } from 'typeorm';
import { Account } from '../account/account.entity'; // Importar suas entidades aqui
import { Transaction } from '../transaction/transaction.entity';

export const databaseConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.MYSQLDB_HOST || 'localhost',
  port: Number(process.env.MYSQLDB_PORT) || 3306,
  username: process.env.MYSQLDB_USER || 'root',
  password: process.env.MYSQLDB_PASSWORD || 'senha_root_123',
  database: process.env.MYSQLDB_DATABASE || 'banking',
  entities: [Account, Transaction],
  synchronize: true,
};

const dataSource = new DataSource(databaseConfig);

// Função para testar a conexão
export const connectToDatabase = async () => {
  try {
    await dataSource.initialize();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
};
