"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStrongPassword = exports.isValidCpf = exports.isValidEmail = exports.sanitizeCpf = void 0;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CPF_REGEX = /^\d{11}$/;
const SENHA_FORTE_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const sanitizeCpf = (cpf) => cpf.replace(/\D/g, "");
exports.sanitizeCpf = sanitizeCpf;
const isValidEmail = (email) => EMAIL_REGEX.test(email);
exports.isValidEmail = isValidEmail;
const isValidCpf = (cpf) => CPF_REGEX.test((0, exports.sanitizeCpf)(cpf));
exports.isValidCpf = isValidCpf;
const isStrongPassword = (senha) => SENHA_FORTE_REGEX.test(senha);
exports.isStrongPassword = isStrongPassword;
//# sourceMappingURL=cliente.validation.js.map