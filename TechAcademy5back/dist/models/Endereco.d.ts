import { Model, Optional } from "sequelize";
interface EnderecoAttributes {
    id_endereco: number;
    id_cliente: number;
    numero?: string | null;
    complemento?: string | null;
    bairro?: string | null;
    cidade?: string | null;
    estado?: string | null;
    cep?: string | null;
}
interface EnderecoCreationAttributes extends Optional<EnderecoAttributes, "id_endereco"> {
}
declare class Endereco extends Model<EnderecoAttributes, EnderecoCreationAttributes> implements EnderecoAttributes {
    id_endereco: number;
    id_cliente: number;
    numero: string | null;
    complemento: string | null;
    bairro: string | null;
    cidade: string | null;
    estado: string | null;
    cep: string | null;
}
export default Endereco;
//# sourceMappingURL=Endereco.d.ts.map