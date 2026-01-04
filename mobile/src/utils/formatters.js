/**
 * Aplica a máscara de CPF: 000.000.000-00
 */
export const formatCPF = (value) => {
    // Remove tudo que não for dígito
    let val = value.replace(/\D/g, "");

    // Aplica a formatação progressivamente
    val = val.replace(/(\d{3})(\d)/, "$1.$2");
    val = val.replace(/(\d{3})(\d)/, "$1.$2");
    val = val.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    // Limita ao tamanho máximo de 14 caracteres (incluindo pontos e traço)
    return val.substring(0, 14);
};

/**
 * Remove a formatação para enviar apenas números ao backend
 */
export const stripNonDigits = (value) => {
    return value.replace(/\D/g, "");
};


// --- FORMATADORES DE DINHEIRO ---

/**
 * Transforma o input em apenas números para o estado (centavos)
 */
export const parseMoneyInput = (value) => {
    return Number(value.replace(/\D/g, ""));
};

/**
 * Formata centavos para exibição em R$ (ex: 100 -> 1,00)
 */
export const formatMoneyDisplay = (value) => {
    return (value / 100).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};