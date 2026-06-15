"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarPreferenciaMercadoPago = criarPreferenciaMercadoPago;
exports.buscarPagamentoMercadoPago = buscarPagamentoMercadoPago;
const pedido_service_1 = require("./pedido.service");
function getMercadoPagoAccessToken() {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!accessToken) {
        throw new pedido_service_1.HttpError(500, "MERCADO_PAGO_ACCESS_TOKEN nao configurado no backend.");
    }
    return accessToken;
}
function resolveFrontendUrl(frontendUrl) {
    if (frontendUrl) {
        return frontendUrl.replace(/\/$/, "");
    }
    if (process.env.FRONTEND_URL) {
        return process.env.FRONTEND_URL.replace(/\/$/, "");
    }
    return "http://localhost:3001";
}
function buildBackUrls(frontendBaseUrl, idPedido) {
    const retornoUrl = new URL("/checkout/retorno", frontendBaseUrl);
    retornoUrl.searchParams.set("pedido", String(idPedido));
    return {
        success: retornoUrl.toString(),
        failure: retornoUrl.toString(),
        pending: retornoUrl.toString(),
    };
}
async function parseMercadoPagoResponse(response) {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        return response.json();
    }
    return response.text();
}
async function criarPreferenciaMercadoPago(pedido, frontendUrl) {
    const accessToken = getMercadoPagoAccessToken();
    const frontendBaseUrl = resolveFrontendUrl(frontendUrl);
    const itens = Array.isArray(pedido.itens) ? pedido.itens : [];
    if (itens.length === 0) {
        throw new pedido_service_1.HttpError(400, "O pedido nao possui itens para gerar o checkout.");
    }
    const body = {
        external_reference: String(pedido.id_pedido),
        back_urls: buildBackUrls(frontendBaseUrl, pedido.id_pedido),
        payer: {
            name: pedido.cliente?.nome || undefined,
            email: pedido.cliente?.email || undefined,
        },
        items: itens.map((item, index) => {
            const pictureUrl = typeof item.produto?.imagem === "string" &&
                /^https?:\/\//i.test(item.produto.imagem)
                ? item.produto.imagem
                : undefined;
            return {
                id: String(index + 1),
                title: item.produto?.nome || `Produto ${index + 1}`,
                quantity: Number(item.quantidade),
                currency_id: "BRL",
                unit_price: Number(item.preco_unitario),
                ...(pictureUrl ? { picture_url: pictureUrl } : {}),
            };
        }),
    };
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    const data = await parseMercadoPagoResponse(response);
    if (!response.ok) {
        const detail = typeof data === "string" ? data : JSON.stringify(data);
        throw new pedido_service_1.HttpError(502, `Mercado Pago rejeitou a criacao da preferencia: ${detail}`);
    }
    return data;
}
async function buscarPagamentoMercadoPago(paymentId) {
    const accessToken = getMercadoPagoAccessToken();
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });
    const data = await parseMercadoPagoResponse(response);
    if (!response.ok) {
        const detail = typeof data === "string" ? data : JSON.stringify(data);
        throw new pedido_service_1.HttpError(502, `Nao foi possivel consultar o pagamento no Mercado Pago: ${detail}`);
    }
    return data;
}
//# sourceMappingURL=mercadoPago.service.js.map