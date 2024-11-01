import { FindOptions, UpdateOptions, literal } from 'sequelize';

import { User } from '@/lib/models';

import { BaseRepository } from './base';
import { Literal } from 'sequelize/types/utils';

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




}
