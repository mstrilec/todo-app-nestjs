import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const createDataSourceOptions = async (
  configService: ConfigService,
): Promise<DataSourceOptions> => {
  return {
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port: +configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrations: ['dist/db/migrations/*.{js,ts}'],
    synchronize: false,
  };
};

const configService = new ConfigService();
const dataSourceOptions = await createDataSourceOptions(configService);

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
