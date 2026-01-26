/**
 * Aplica a máscara de CPF: 000.000.000-00
 */
export const formatCPF = (value) => {
    if (!value) return "";
    let val = value.replace(/\D/g, "");
    if (value.length > 14) {
        return value.substring(0, 14);
    }
    val = val.replace(/(\d{3})(\d)/, "$1.$2");
    val = val.replace(/(\d{3})(\d)/, "$1.$2");
    val = val.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
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

/**
 * Formata o Telefone: (99) 99999-9999 ou (99) 9999-9999
 */
export const formatPhoneNumber = (value) => {
    if (!value) return "";
    let val = value.replace(/\D/g, ""); 
    val = val.replace(/^(\d{2})(\d)/g, "($1) $2");
    val = val.replace(/(\d{5})(\d)/, "$1-$2");
    return val.substring(0, 15);
};