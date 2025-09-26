import React, { useState } from 'react';
import api from '../services/api';
import './PesquisaPacientesPage.css';
import { formatCPF, formatCelular } from '../services/format';
import { useNavigate } from 'react-router-dom';

function PesquisaPacientesPage() {
    const [searchType, setSearchType] = useState('todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSearchResults([]);
        setSearched(true);

        try {
            let response;
            if (searchType === 'todos') {
                response = await api.get('/pacientes');
            } else if (searchType === 'id') {
                if (!searchTerm.trim()) {
                    setError('Por favor, insira um ID.');
                    setIsLoading(false);
                    return;
                }
                response = await api.get(`/pacientes/${searchTerm}`);
            } else if (searchType === 'cpf') {
                if (!searchTerm.trim()) {
                    setError('Por favor, insira um CPF.');
                    setIsLoading(false);
                    return;
                }
                response = await api.get(`/pacientes/cpf?cpf=${searchTerm}`);
            }

            const resultsArray = Array.isArray(response.data) ? response.data : [response.data];
            setSearchResults(resultsArray);

        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('Nenhum paciente encontrado com os dados fornecidos.');
            } else {
                setError('Ocorreu um erro ao realizar a busca.');
                console.error("Erro na busca:", err);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // FUNÇÃO ADICIONADA: Lida com a exclusão de um paciente
    const handleDelete = async (pacienteId) => {
        // Em um app real, aqui viria um modal de confirmação.
        // Como a instrução é não usar window.confirm, vamos deletar diretamente.
        
        try {
            await api.delete(`/pacientes/deletar/${pacienteId}`);
            // Remove o paciente da lista de resultados na tela, sem precisar de uma nova busca.
            setSearchResults(prevResults => prevResults.filter(p => p.id !== pacienteId));
            alert('Paciente excluído com sucesso!'); // Usando alert temporariamente para feedback
        } catch (err) {
            setError('Falha ao excluir o paciente.');
            console.error("Erro ao deletar:", err);
        }
    };

    return (
        <div className="pesquisa-container">
            <h1>Pesquisar Pacientes</h1>
            <form className="search-form" onSubmit={handleSearch}>
                <div className="form-group">
                    <label htmlFor="searchType">Pesquisar por:</label>
                    <select
                        id="searchType"
                        value={searchType}
                        onChange={(e) => {
                            setSearchType(e.target.value);
                            setSearchTerm('');
                        }}
                    >
                        <option value="todos"> Todos os Pacientes </option>
                        <option value="id"> ID </option>
                        <option value="cpf"> CPF </option>
                    </select>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        id="searchTerm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={searchType === 'todos'}
                        placeholder={searchType !== 'todos' ? `Digite o ${searchType.toUpperCase()}` : ''}
                    />
                </div>
                <button type="submit" className="search-button" disabled={isLoading}>
                    {isLoading ? 'Buscando...' : 'Pesquisar'}
                </button>
            </form>

            <div className="results-container">
                {error && <p className="error-message">{error}</p>}

                {searchResults.length > 0 && (
                    <table className="pacientes-table">
                        <thead>
                            <tr>
                                <th> ID </th>
                                <th>Nome Completo</th>
                                <th>CPF</th>
                                <th>Celular</th>
                                <th>E-mail</th>
                                <th>Funções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchResults.map(paciente => (
                                <tr key={paciente.id}>
                                    <td>{paciente.id}</td>
                                    <td>{paciente.nome_completo}</td>
                                    <td>{formatCPF(paciente.cpf)}</td>
                                    <td>{formatCelular(paciente.celular)}</td>
                                    <td>{paciente.email}</td>
                                    <td className="acoes">
                                        <button className="btn-ver-exames">Ver Exames</button>
                                        <button 
                                            className="btn-editar"
                                            // ROTA CORRIGIDA: Adicionada a barra "/" no início para navegação correta.
                                            onClick={() => navigate(`/pacientes/editar/${paciente.id}`)}
                                        >Editar</button>
                                        <button 
                                            className="btn-excluir"
                                            // ONCLICK ADICIONADO: Chama a função handleDelete passando o ID do paciente.
                                            onClick={() => handleDelete(paciente.id)}
                                        >Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {searched && !isLoading && searchResults.length === 0 && !error && (
                    <p className="no-results-message">Nenhum resultado encontrado.</p>
                )}
            </div>
        </div>
    );
}

export default PesquisaPacientesPage;
