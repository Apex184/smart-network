import { CreationAttributes, FindOptions } from 'sequelize';

import { VerificationToken } from '@/lib/models';

import { compareHash } from '..';
import { BaseRepository } from './base';

export class VerificationTokenRepository extends BaseRepository<VerificationToken> {
    constructor() {
        super(VerificationToken);
    }

    updateOrCreate(payload: CreationAttributes<VerificationToken>, options?: FindOptions<VerificationToken>) {
        return super.updateOrCreate(payload, { ...options, conflictFields: ['email'] });
    }

    findByEmail(email: string, options?: FindOptions<VerificationToken>) {
        return this.findOne({ email }, options);
    }

    deleteByEmail(email: string) {
        return this.destroy({ email });
    }

    async compareToken(token: string, email: string) {
        const verificationToken = await this.findByEmail(email, { include: [VerificationToken.associations.User] });
        if (!verificationToken) return false;

        const isTokenValid = await compareHash(token, verificationToken.token);
        return isTokenValid ? verificationToken : false;
    }
}
