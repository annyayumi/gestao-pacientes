export function formatCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');

  if (cpf.length === 11) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return cpf;
}

export function formatCelular(celular) {
  celular = celular.replace(/\D/g, '');
  if (celular.length === 11) {
    return celular.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
  }
  return celular;
}