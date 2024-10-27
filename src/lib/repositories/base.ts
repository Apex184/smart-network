import {
    Attributes,
    CreationAttributes,
    FindOptions,
    Includeable,
    InferAttributes,
    Model,
    ModelStatic,
    Transaction,
    WhereOptions,
} from 'sequelize';

import { logger, RequireAtLeastOne, StringKeys } from '@/lib';

export type FindManyOptions<T extends Model> = {
    include?: Includeable | Includeable[];
    limit?: number;
    page?: number;
    sort?:
    | Exclude<`${'' | '-'}${StringKeys<InferAttributes<T>>}`, 'undefined' | '-undefined'>
    | Exclude<`${'' | '-'}${StringKeys<InferAttributes<T>>}`, 'undefined' | '-undefined'>[];
    fields?: Exclude<`${'' | '-'}${StringKeys<InferAttributes<T>>}`, 'undefined' | '-undefined'>[];
    transaction?: Transaction;
};

export abstract class BaseRepository<T extends Model = Model> {
    constructor(protected model: ModelStatic<T>) { }

    create(payload: CreationAttributes<T>, options?: FindOptions<InferAttributes<T>>): Promise<T> {
        return this.model.create(payload, options);
    }

    createMany(payload: CreationAttributes<T>[], options?: FindOptions<InferAttributes<T>>): Promise<T[]> {
        return this.model.bulkCreate(payload, options);
    }

    findOne(where: WhereOptions<T>, options: FindOptions<InferAttributes<T>> = {}): Promise<T | null> {
        return this.model.findOne({ where, ...options });
    }

    findOneWithLock(where: WhereOptions<T>, options: FindOptions<InferAttributes<T>> = {}) {
        return this.model.findOne({ where, ...options, lock: Transaction.LOCK.UPDATE });
    }

    findByPk(id: number | string, options: FindOptions<InferAttributes<T>> = {}) {
        return this.model.findByPk(id, options);
    }

    findMany(where: WhereOptions<T>, options: FindManyOptions<T> = {}) {
        return this.model.findAll({ where, ...this.getSortingAndPaginationOptions(options) });
    }

    findManyAndCount(where: WhereOptions<T>, options: FindManyOptions<T> = {}) {
        return this.model.findAndCountAll({ where, ...this.getSortingAndPaginationOptions(options) });
    }

    findOrCreate(where: WhereOptions<T>, payload: CreationAttributes<T>, options: FindOptions<InferAttributes<T>> = {}) {
        if (options.transaction) {
            return this.model.findOrCreate({ where, defaults: payload, ...options });
        }
        return this.model.findCreateFind({ where, defaults: payload, ...options });
    }

    update(where: WhereOptions<T>, payload: Partial<Attributes<T>>, options: FindOptions<InferAttributes<T>> = {}) {
        return this.model.update(payload, { where, ...options, returning: true });
    }

    async updateOrCreate(
        payload: CreationAttributes<T>,
        options: FindOptions<InferAttributes<T>> & { conflictFields?: (keyof Attributes<T>)[] } = {},
    ) {
        return this.model.upsert(payload, { ...options, returning: true });
    }

    destroy(where: WhereOptions<T>, options: { transaction?: Transaction | null } = {}) {
        return this.model.destroy({ where, ...options });
    }

    async exists(where: WhereOptions<T>) {
        const count = await this.model.count({ where });
        return count > 0;
    }

    private formatSortOptions(sort?: FindManyOptions<T>['sort']): [string, 'ASC' | 'DESC'][] | undefined {
        logger.info('sort %s', sort);
        if (sort && Array.isArray(sort) && sort.length > 0) {
            return sort.map((s) => [s.replace(/^-/, ''), s.startsWith('-') ? 'DESC' : 'ASC']);
        } else if (typeof sort === 'string') {
            return [[sort.replace(/^-/, ''), sort.startsWith('-') ? 'DESC' : 'ASC']];
        }
        return;
    }

    private formatFields(fields?: FindManyOptions<T>['fields']) {
        type AttributesFilter = RequireAtLeastOne<{
            include?: string[];
            exclude?: string[];
        }>;
        logger.info('fields %o', fields);

        if (!fields?.some((field) => field.startsWith('-'))) return fields;

        return fields?.reduce<AttributesFilter>((acc, field) => {
            if (field.startsWith('-')) {
                acc['exclude'] ? acc['exclude'].push(field.replace(/^-/, '')) : (acc['exclude'] = [field.replace(/^-/, '')]);
            } else {
                acc['include'] ? acc['include'].push(field) : (acc['include'] = [field]);
            }
            return acc;
        }, {} as AttributesFilter);
    }

    private getSortingAndPaginationOptions(options: FindManyOptions<T>) {
        const { limit = 25, page = 1, sort, fields } = options;
        const offset = (page - 1) * limit;
        const order = this.formatSortOptions(sort);
        const attributes = this.formatFields(fields);

        return { limit, offset, order, attributes };
    }
}
