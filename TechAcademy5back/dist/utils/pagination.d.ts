import { Request } from "express";
export interface PaginationParams {
    page: number;
    limit: number;
    offset: number;
}
export interface PaginatedResponse<T> {
    dados: T[];
    paginacao: {
        paginaAtual: number;
        porPagina: number;
        totalItens: number;
        totalPaginas: number;
    };
}
export declare const getPaginationParams: (req: Request) => PaginationParams;
export declare const buildPaginatedResponse: <T>(dados: T[], totalItens: number, page: number, limit: number) => PaginatedResponse<T>;
//# sourceMappingURL=pagination.d.ts.map