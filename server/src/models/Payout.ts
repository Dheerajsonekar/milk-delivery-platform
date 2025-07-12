import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db'

const Payout = sequelize.define(
    'Payout',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        vendorId: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'vendor_id', 
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('requested', 'paid', 'rejected'),
            defaultValue: 'requested',
        },
        bankDetails: {
            type: DataTypes.JSONB,
            allowNull: true,
            field: 'bank_details',
        },
    },
    {
        tableName: 'payouts',
        timestamps: true,
    }
)

export default Payout
