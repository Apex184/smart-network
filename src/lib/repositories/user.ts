import { FindOptions, UpdateOptions, WhereOptions, } from 'sequelize';

import { User } from '@/lib/models';

import { BaseRepository } from './base';
import { Fn, Literal } from 'sequelize/types/utils';

export class UserRepository extends BaseRepository<User> {
    constructor() {
        super(User);
    }

    findByEmail(email: string, options: FindOptions<User> = {}) {
        return this.findOne({ email }, options);
    }

    findByGoogleId(providerId: string, options: FindOptions<User> = {}) {
        return this.findOne({ providerId }, options);
    }

    // async updateRole(userId: number, role: 'user' | 'organizer' | 'admin' | 'client', options: UpdateOptions<User> = {
    //     where: new Fn()
    // }) {
    //     const updateOptions: UpdateOptions<User> = {
    //         ...options,
    //         where: { id: userId },
    //     };

    //     return this.update({ role }, updateOptions);
    // }


}
