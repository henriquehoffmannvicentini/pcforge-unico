"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaginatedResponse = exports.getPaginationParams = void 0;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const parsePositiveInt = (value, fallback) => {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1) {
        return fallback;
    }
    return parsed;
};
const getPaginationParams = (req) => {
    const page = parsePositiveInt(req.query.page, DEFAULT_PAGE);
    const requestedLimit = parsePositiveInt(req.query.limit, DEFAULT_LIMIT);
    const limit = Math.min(requestedLimit, MAX_LIMIT);
    return {
        page,
        limit,
        offset: (page - 1) * limit,
    };
};
exports.getPaginationParams = getPaginationParams;
const buildPaginatedResponse = (dados, totalItens, page, limit) => ({
    dados,
    paginacao: {
        paginaAtual: page,
        porPagina: limit,
        totalItens,
        totalPaginas: totalItens === 0 ? 0 : Math.ceil(totalItens / limit),
    },
});
exports.buildPaginatedResponse = buildPaginatedResponse;
//# sourceMappingURL=pagination.js.map