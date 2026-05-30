import { Model, Optional } from "sequelize";
interface ClienteAttributes {
    id_cliente: number;
    nome: string;
    email: string;
    senha: string;
    telefone?: string | null;
    cpf?: string | null;
    ativo: boolean;
    admin: boolean;
}
interface ClienteCreationAttributes extends Optional<ClienteAttributes, "id_cliente"> {
}
declare class Cliente extends Model<ClienteAttributes, ClienteCreationAttributes> implements ClienteAttributes {
    id_cliente: number;
    nome: string;
    email: string;
    senha: string;
    telefone: string | null;
    cpf: string | null;
    ativo: boolean;
    admin: boolean;
}
export default Cliente;
//# sourceMappingURL=Cliente.d.ts.map