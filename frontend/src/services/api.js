import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api'
});

/*export const atualizarPorId = (id, dados) =>
  api.put(`/pacientes/atualizar/id/${id}`, dados);

export const atualizarPorCpf = (cpf, dados) =>
  api.put(`/pacientes/atualizar/cpf/${cpf}`, dados);*/

export default api;
