"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selfOrAdminMiddleware = exports.adminMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("./jwt");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ mensagem: "Token nao fornecido." });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, (0, jwt_1.getJwtSecret)());
        if (typeof decoded === "string") {
            res.status(401).json({ mensagem: "Token invalido." });
            return;
        }
        req.cliente = decoded;
        next();
    }
    catch {
        res.status(401).json({ mensagem: "Token invalido ou expirado." });
    }
};
exports.authMiddleware = authMiddleware;
const adminMiddleware = (req, res, next) => {
    if (!req.cliente?.admin) {
        res.status(403).json({ mensagem: "Acesso restrito a administradores." });
        return;
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
const selfOrAdminMiddleware = (paramName = "id") => (req, res, next) => {
    const clienteLogado = req.cliente;
    const routeId = Number(req.params[paramName]);
    if (!clienteLogado) {
        res.status(401).json({ mensagem: "Usuario nao autenticado." });
        return;
    }
    if (Number.isNaN(routeId)) {
        res.status(400).json({ mensagem: "ID invalido." });
        return;
    }
    if (clienteLogado.id_cliente !== routeId && !clienteLogado.admin) {
        res.status(403).json({ mensagem: "Voce nao tem permissao para acessar este recurso." });
        return;
    }
    next();
};
exports.selfOrAdminMiddleware = selfOrAdminMiddleware;
//# sourceMappingURL=auth.middleware.js.map