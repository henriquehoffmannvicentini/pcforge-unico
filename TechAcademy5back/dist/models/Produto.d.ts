import { Model, Optional } from "sequelize";
interface ProdutoAttributes {
    id_produto: number;
    nome: string;
    descricao?: string | null;
    valor: number;
    ativo: boolean;
    id_categoria?: number | null;
    imagem?: string | null;
    destaque: boolean;
    estoque: number;
}
interface ProdutoCreationAttributes extends Optional<ProdutoAttributes, "id_produto"> {
}
declare class Produto extends Model<ProdutoAttributes, ProdutoCreationAttributes> implements ProdutoAttributes {
    id_produto: number;
    nome: string;
    descricao: string | null;
    valor: number;
    ativo: boolean;
    id_categoria: number | null;
    imagem: string | null;
    destaque: boolean;
    estoque: number;
}
export default Produto;
//# sourceMappingURL=Produto.d.ts.map