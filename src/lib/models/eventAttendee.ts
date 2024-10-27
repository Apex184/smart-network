import { Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import db from '../database';
import { Event } from './event';
import { User } from './user';

export class EventAttendee extends Model<InferAttributes<EventAttendee>, InferCreationAttributes<EventAttendee>> {
    declare id: number;
    declare userId: number;
    declare eventId: string;
    declare status: 'registered' | 'attended' | 'cancelled';
}

EventAttendee.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        eventId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('registered', 'attended', 'cancelled'),
            defaultValue: 'registered',
        },
    },
    {
        sequelize: db,
        tableName: 'event_attendees',
        modelName: 'EventAttendee',
    }
);


User.belongsToMany(Event, {
    through: EventAttendee,
    foreignKey: 'userId',
    otherKey: 'eventId',
    as: 'attendedEvents'
});
Event.belongsToMany(User, {
    through: EventAttendee,
    foreignKey: 'eventId',
    otherKey: 'userId',
    as: 'attendees'
});
