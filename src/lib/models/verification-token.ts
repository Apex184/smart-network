import {
    Association,
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
} from 'sequelize';

import db from '../database';
import { User } from './user';

export class VerificationToken extends Model<
    InferAttributes<VerificationToken>,
    InferCreationAttributes<VerificationToken>
> {
    declare id: CreationOptional<number>;
    declare email: ForeignKey<string>;
    declare token: string;
    declare expires: Date;

    declare user?: NonAttribute<User>;

    declare static associations: {
        User: Association<VerificationToken, User>;
    };
}

VerificationToken.init(
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },

        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expires: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize: db,
        tableName: 'verification_tokens',
    },
);

User.hasOne(VerificationToken, { foreignKey: 'email', sourceKey: 'email', as: 'verificationToken' });
VerificationToken.associations.User = VerificationToken.belongsTo(User, {
    foreignKey: 'email',
    targetKey: 'email',
    as: 'user',
});
