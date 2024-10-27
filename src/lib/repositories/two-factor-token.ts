import { CreationAttributes, FindOptions } from 'sequelize';

import { TwoFactorToken } from '@/lib/models';

import { compareHash } from '..';
import { BaseRepository } from './base';

export class TwoFactorTokenRepository extends BaseRepository<TwoFactorToken> {
    constructor() {
        super(TwoFactorToken);
    }

    updateOrCreate(payload: CreationAttributes<TwoFactorToken>, options?: FindOptions<TwoFactorToken>) {
        return super.updateOrCreate(payload, { ...options, conflictFields: ['email'] });
    }

    findByEmail(email: string, options?: FindOptions<TwoFactorToken>) {
        return this.findOne({ email }, options);
    }

    deleteByEmail(email: string) {
        return this.destroy({ email });
    }

    async compareToken(token: string, email: string) {
        const twoFactorToken = await this.findByEmail(email, { include: [TwoFactorToken.associations.User] });
        if (!twoFactorToken) return false;

        const isTokenValid = await compareHash(token, twoFactorToken.token);
        return isTokenValid ? twoFactorToken : false;
    }
}
