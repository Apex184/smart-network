import { Transaction } from 'sequelize';

import db from './database';

export const databaseTransaction = <T>(fn: (t: Transaction) => Promise<T>): Promise<T> => {
    return db.transaction<T>(async (transaction) => {
        return await fn(transaction);
    });
};
