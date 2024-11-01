import {
    Model,
    DataTypes,
    HasOne,
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from 'sequelize';
import db from '../database';
import { generateRandomString } from '../helpers';

export enum UserRole {
    USER = 'user',
    ORGANIZER = 'organizer',
    ADMIN = 'admin',
    CLIENT = 'client',
}

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare email: string;
    declare password?: string;
    declare role?: 'user' | 'organizer' | 'admin' | 'client';
    declare fullName?: string;
    declare lastName?: string;
    declare emailVerified?: Date;
    declare phone?: string;
    declare image?: string;
    declare organizationName?: string;
    declare organizationWebsite?: string;
    declare adminNote?: string;
    declare provider?: string;
    declare providerId?: string;
    declare static associations: {
        User: HasOne<User>;
    };
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        role: {
            type: DataTypes.ENUM('user', 'client', 'organizer', 'admin'),
            allowNull: true,

        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        emailVerified: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        organizationName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        organizationWebsite: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true,
            },
        },
        adminNote: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        provider: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        providerId: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
    },
    {
        sequelize: db,
        tableName: 'users',
        modelName: 'User',
        timestamps: true,
    }
);

export default User;
