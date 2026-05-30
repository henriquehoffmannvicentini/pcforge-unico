"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadDir = path_1.default.resolve(__dirname, "..", "..", "uploads");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const nome = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, nome);
    },
});
const fileFilter = (_req, file, cb) => {
    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (tiposPermitidos.includes(file.mimetype)) {
        cb(null, true);
        return;
    }
    cb(new Error("Tipo de arquivo não permitido. Use JPEG, PNG, WEBP ou GIF."));
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});
//# sourceMappingURL=upload.js.map