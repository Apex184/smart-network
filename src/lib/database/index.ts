import { Options, Sequelize } from 'sequelize';

import { env } from '@/lib/config';

const config = {
  dialect: 'postgres',
  define: {
    timestamps: true,
    freezeTableName: true,
  },
  pool: {
    max: env.DATABASE_MAX_POOL,
    min: env.DATABASE_MIN_POOL,
  },
  logQueryParameters: true,
  logging: (sql: string) => {
    return env.SHOW_DATABASE_QUERIES ? console.log(`[DATABASE QUERY ${new Date()}] => ${sql}`) : null;
  },
} satisfies Options;


export const db = new Sequelize(env.DATABASE_URL, config);
export default db;
