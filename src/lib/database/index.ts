import { Options, Sequelize } from 'sequelize';
import { logger } from '@/lib'
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


(async () => {
  try {
    await db.authenticate();
    logger.info(`[DATABASE STATUS ${new Date()}] - Connected with database.`);
  } catch (error) {
    logger.error(`[DATABASE ERROR ${new Date()}] - Unable to connect with the database:`, error);
  }
})();

export default db;
