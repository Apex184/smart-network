import { FindOptions } from 'sequelize';

import { User } from '@/lib/models';

import { BaseRepository } from './base';

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
