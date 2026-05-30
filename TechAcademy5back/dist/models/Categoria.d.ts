import { Model, Optional } from "sequelize";
interface CategoriaAttributes {
    id_categoria: number;
    nome: string;
    descricao?: string;
    ativo: boolean;
}
interface CategoriaCreationAttributes extends Optional<CategoriaAttributes, "id_categoria"> {
}
declare class Categoria extends Model<CategoriaAttributes, CategoriaCreationAttributes> implements CategoriaAttributes {
    id_categoria: number;
    nome: string;
    descricao?: string;
    ativo: boolean;
}
export default Categoria;
//# sourceMappingURL=Categoria.d.ts.map