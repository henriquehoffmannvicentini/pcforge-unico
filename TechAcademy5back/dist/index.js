"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = startServer;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("./config/database/index"));
const cliente_routes_1 = __importDefault(require("./routes/cliente.routes"));
const produto_routes_1 = __importDefault(require("./routes/produto.routes"));
const categoria_routes_1 = __importDefault(require("./routes/categoria.routes"));
const endereco_routes_1 = __importDefault(require("./routes/endereco.routes"));
const pedido_routes_1 = __importDefault(require("./routes/pedido.routes"));
const itempedido_routes_1 = __importDefault(require("./routes/itempedido.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const pagamento_routes_1 = __importDefault(require("./routes/pagamento.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static(path_1.default.resolve(__dirname, "..", "uploads")));
// Rotas
app.use("/clientes", cliente_routes_1.default);
app.use("/produtos", produto_routes_1.default);
app.use("/categorias", categoria_routes_1.default);
app.use("/enderecos", endereco_routes_1.default);
app.use("/pedidos", pedido_routes_1.default);
app.use("/itens-pedido", itempedido_routes_1.default);
app.use("/upload", upload_routes_1.default);
app.use("/pagamentos", pagamento_routes_1.default);
async function startServer() {
    try {
        await index_1.default.sync();
        return app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    }
    catch (error) {
        console.error("Erro ao sincronizar banco de dados:", error);
        throw error;
    }
}
if (require.main === module) {
    void startServer();
}
exports.default = app;
//# sourceMappingURL=index.js.map