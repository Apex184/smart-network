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

export class TwoFactorToken extends Model<InferAttributes<TwoFactorToken>, InferCreationAttributes<TwoFactorToken>> {
    declare id: CreationOptional<number>;
    declare email: ForeignKey<string>;
    declare token: string;
    declare expires: Date;

    declare user?: NonAttribute<User>;

    declare static associations: {
        User: Association<TwoFactorToken, User>;
    };
}

TwoFactorToken.init(
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
        tableName: 'two_factor_tokens',
    },
);

TwoFactorToken.associations.User = TwoFactorToken.belongsTo(User, {
    as: 'user',
    foreignKey: 'email',
    targetKey: 'email',
});
User.hasOne(TwoFactorToken, { as: 'twoFactorToken', foreignKey: 'email', sourceKey: 'email' });
