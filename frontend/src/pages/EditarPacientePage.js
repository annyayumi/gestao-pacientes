import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IMaskInput } from 'react-imask';
import api from '../services/api';
import './CadastroPaciente.css';

function EditarPacientePage() {
    const { id } = useParams(); // Pega o 'id' da URL, ex: /pacientes/editar/12
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nome_completo: '',
        celular: '',
        cpf: '',
        email: ''
    });
    const [examesDisponiveis, setExamesDisponiveis] = useState([]);
    const [selectedExames, setSelectedExames] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Função para buscar todos os exames disponíveis
        const fetchExames = api.get('/exames').then(response => {
            setExamesDisponiveis(response.data);
        }).catch(err => {
            console.error("Erro ao buscar exames:", err);
            setError('Erro ao carregar lista de exames.');
        });

        // Função para buscar os dados do paciente específico que será editado
        const fetchPaciente = api.get(`/pacientes/${id}`).then(response => {
            const paciente = response.data;
            // Popula o formulário com os dados do paciente
            setFormData({
                nome_completo: paciente.nome_completo || '',
                celular: paciente.celular || '',
                cpf: paciente.cpf || '',
                email: paciente.email || ''
            });
            // Marca os checkboxes dos exames que o paciente já possui
            setSelectedExames(new Set(paciente.exames));
        }).catch(err => {
            console.error("Erro ao buscar dados do paciente:", err);
            setError('Paciente não encontrado ou erro ao carregar dados.');
        });
        
        // Executa as duas buscas em paralelo
        Promise.all([fetchExames, fetchPaciente]);

    }, [id]); // Este useEffect roda sempre que o ID na URL mudar

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleExameChange = (exameId) => {
        const newSelectedExames = new Set(selectedExames);
        if (newSelectedExames.has(exameId)) {
            newSelectedExames.delete(exameId);
        } else {
            newSelectedExames.add(exameId);
        }
        setSelectedExames(newSelectedExames);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        const submissionData = {
            ...formData,
            celular: formData.celular.replace(/\D/g, ''),
            exames: Array.from(selectedExames)
        };
        
        // Não enviamos o CPF pois ele não deve ser alterado
        delete submissionData.cpf;

        try {
            const response = await api.put(`/pacientes/editar/${id}`, submissionData);
            setMessage(response.data.message + " Redirecionando em 3 segundos...");
            
            // Redireciona o usuário de volta para a página de pesquisa após 3 segundos
            setTimeout(() => {
                navigate('/pacientes/pesquisar');
            }, 3000);

        } catch (error) {
            setError(error.response?.data?.error || 'Erro ao atualizar paciente.');
            console.error("Erro na atualização:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cadastro-container">
            <h1>Editar Paciente</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="cadastro-form">
                <input name="nome_completo" value={formData.nome_completo} onChange={handleChange} placeholder="Nome Completo *" required />
                
                <IMaskInput
                    mask="(00) 00000-0000"
                    value={formData.celular}
                    name="celular"
                    placeholder='Celular'
                    onAccept={(value) => handleChange({ target: { name: 'celular', value } })}
                />

                {/* Mostra o CPF, mas desabilitado para não permitir edição */}
                <IMaskInput
                    mask="000.000.000-00"
                    value={formData.cpf}
                    name="cpf"
                    placeholder='CPF *'
                    disabled 
                />

                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                
                <details className="exames-accordion" open>
                    <summary>Selecionar Exames ({selectedExames.size} selecionados) *</summary>
                    <div className="exames-list">
                        {examesDisponiveis.map(exame => (
                            <label key={exame.id} className="exame-item">
                                <input
                                    type="checkbox"
                                    checked={selectedExames.has(exame.id)}
                                    onChange={() => handleExameChange(exame.id)}
                                />
                                {exame.nome_exame}
                            </label>
                        ))}
                    </div>
                </details>
                <p>* Preenchimento obrigatório</p>
                <div className='botao-main'>
                    <button className='botao' type="submit" disabled={loading}>
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
            {message && <p className="success-message">{message}</p>}
        </div>
    );
};

export default EditarPacientePage;