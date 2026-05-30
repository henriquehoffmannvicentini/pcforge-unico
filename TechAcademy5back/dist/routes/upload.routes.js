"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_1 = require("../config/upload");
const auth_middleware_1 = require("../config/auth.middleware");
const router = (0, express_1.Router)();
router.post("/imagem", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, upload_1.upload.single("imagem"), (req, res) => {
    if (!req.file) {
        res.status(400).json({ mensagem: "Nenhuma imagem enviada." });
        return;
    }
    const url = `/uploads/${req.file.filename}`;
    res.status(201).json({ mensagem: "Upload realizado com sucesso.", url });
});
exports.default = router;
//# sourceMappingURL=upload.routes.js.map