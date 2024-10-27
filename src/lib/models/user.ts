import { Model, DataTypes, HasOne, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import db from '../database';
import { generateRandomString } from '../helpers';

export enum UserRole {
    USER = 'client',
    ORGANIZER = 'organizer',
    ADMIN = 'admin',
    CLIENT = 'client',
}

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare publicId: CreationOptional<string>;
    declare email: string;
    declare password?: string;
    declare role: 'user' | 'organizer' | 'admin' | 'client';
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
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;


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
        publicId: {
            type: DataTypes.STRING(12),
            allowNull: false,
            unique: true,
            defaultValue: () => generateRandomString(12, { type: 'alphanumericLower' }),
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
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
            allowNull: false,
            defaultValue: 'user',
        },
        fullName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        emailVerified: {
            type: DataTypes.DATE,
        },
        phone: {
            type: DataTypes.STRING,
        },
        image: {
            type: DataTypes.STRING,
        },

        organizationName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        organizationWebsite: {
            type: DataTypes.STRING,
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
        createdAt: '',
        updatedAt: ''
    },
    {
        sequelize: db,
        tableName: 'users',
        modelName: 'User',
        timestamps: true,
    }
);

export default User;
