"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Cliente extends sequelize_1.Model {
}
Cliente.init({
    id_cliente: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    senha: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    telefone: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null,
    },
    cpf: {
        type: sequelize_1.DataTypes.STRING(14),
        allowNull: false,
        unique: true,
    },
    ativo: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    admin: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize: database_1.default,
    tableName: "cliente",
    timestamps: false,
});
exports.default = Cliente;
//# sourceMappingURL=Cliente.js.map