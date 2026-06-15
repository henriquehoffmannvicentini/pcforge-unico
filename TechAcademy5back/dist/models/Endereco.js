"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Cliente_1 = __importDefault(require("./Cliente"));
class Endereco extends sequelize_1.Model {
}
Endereco.init({
    id_endereco: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_cliente: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "cliente",
            key: "id_cliente",
        },
    },
    numero: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null,
    },
    complemento: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null,
    },
    bairro: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null,
    },
    cidade: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null,
    },
    estado: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null,
    },
    cep: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null,
    },
}, {
    sequelize: database_1.default,
    tableName: "endereco",
    timestamps: false,
});
Endereco.belongsTo(Cliente_1.default, { foreignKey: "id_cliente", as: "cliente" });
Cliente_1.default.hasMany(Endereco, { foreignKey: "id_cliente", as: "enderecos" });
exports.default = Endereco;
//# sourceMappingURL=Endereco.js.map