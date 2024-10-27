import { Model, DataTypes, CreationOptional, InferAttributes, InferCreationAttributes, ForeignKey } from 'sequelize';
import db from '../database';
import { generateRandomString } from '../helpers';
import { User } from './user';

export enum EventStatus {
    UPCOMING = 'upcoming',
    ONGOING = 'ongoing',
    COMPLETED = 'completed',
    CANCELED = 'canceled',
}

export enum EventVisibility {
    PUBLIC = 'public',
    PRIVATE = 'private',
}

export class Event extends Model<InferAttributes<Event>, InferCreationAttributes<Event>> {
    declare id: CreationOptional<number>;
    declare eventId: CreationOptional<string>;
    declare eventCode: CreationOptional<string>;
    declare eventName: string;
    declare eventDescription?: string;
    declare date: Date;
    declare eventQrCodeUrl?: string;
    declare eventLocation?: string;
    declare eventStatus: EventStatus;
    declare eventVisibility: EventVisibility;
    declare organizerId: ForeignKey<User['id']>;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Event.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        eventId: {
            type: DataTypes.STRING(12),
            allowNull: false,
            unique: true,
            defaultValue: () => generateRandomString(12, { type: 'alphanumericLower' }),
        },
        eventCode: {
            type: DataTypes.STRING(8),
            allowNull: false,
            unique: true,
            defaultValue: () => generateRandomString(8, { type: 'alphanumericUpper' }), // Generates a unique code
        },
        eventName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        eventDescription: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        eventLocation: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        eventQrCodeUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        eventStatus: {
            type: DataTypes.ENUM('upcoming', 'ongoing', 'completed', 'canceled'),
            allowNull: false,
            defaultValue: EventStatus.UPCOMING,
        },
        eventVisibility: {
            type: DataTypes.ENUM('public', 'private'),
            allowNull: false,
            defaultValue: EventVisibility.PUBLIC,
        },
        organizerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        createdAt: '',
        updatedAt: ''
    },
    {
        sequelize: db,
        tableName: 'events',
        modelName: 'Event',
        timestamps: true,
    }
);

User.hasMany(Event, { foreignKey: 'organizerId', as: 'organizedEvents' });
Event.belongsTo(User, { foreignKey: 'organizerId', as: 'organizer' });

export default Event;


