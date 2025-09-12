import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './PacientesListPage.css';
import { formatCPF, formatCelular } from '../services/format';

function PacientesListPage() {
    const [pacientes, setPacientes] = useState([]);

    useEffect(() => {
        async function fetchPacientes() {
            try {
                const response = await api.get('/pacientes');
                setPacientes(response.data);
            } catch (error) {
                console.error("Erro ao buscar pacientes:", error);
                alert("Não foi possível carregar a lista de pacientes.");
            }
        }
        fetchPacientes();
    }, []);

    return (
        <div className="pacientes-container">
            <h1>Lista de Pacientes</h1>
            <table className="pacientes-table">
                <thead>
                    <tr>
                        <th>Nome Completo</th>
                        <th>CPF</th>
                        <th>Celular</th>
                        <th>Email</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {}
                    {pacientes.map(paciente => (
                        <tr key={paciente.id}>
                            <td>{paciente.nome_completo}</td>
                            <td>{formatCPF(paciente.cpf)}</td>
                            <td>{formatCelular(paciente.celular)}</td>
                            <td>{paciente.email}</td>
                            <td className="acoes">
                                <button className="btn-ver-exames">Ver Exames</button>
                                <button className="btn-editar">Editar</button>
                                <button className="btn-excluir">Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PacientesListPage;
