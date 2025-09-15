import React, { useState, useEffect } from 'react';
import { IMaskInput } from 'react-imask';
import api from '../services/api';
import './CadastroPaciente.css';

function CadastroPacientePage() {
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

    useEffect(() => {
        api.get('/exames')
            .then(response => {
                setExamesDisponiveis(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar exames:", error);
                setMessage('Erro ao carregar lista de exames.');
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
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

        const submissionData = {
            ...formData,
            cpf: formData.cpf.replace(/\D/g, ''),
            celular: formData.celular.replace(/\D/g, ''),
            exames: Array.from(selectedExames)
        };

        try {
            const response = await api.post('/pacientes', submissionData);
            setMessage(response.data.message);
            setFormData({ nome_completo: '', celular: '', cpf: '', email: '' });
            setSelectedExames(new Set());
        } catch (error) {
            setMessage(error.response?.data?.error || 'Erro ao cadastrar paciente.');
            console.error("Erro no cadastro:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cadastro-container">
            <h1>Cadastro Paciente</h1>
            <form onSubmit={handleSubmit} className="cadastro-form">
                <input name="nome_completo" value={formData.nome_completo} onChange={handleChange} placeholder="Nome Completo *" required />
                
                <IMaskInput
                    mask="(00) 00000-0000"
                    value={formData.celular}
                    onChange={handleChange}
                    type='tel'
                    name="celular"
                    placeholder='Celular'
                    onAccept={(value) => handleChange({ target: { name: 'celular', value } })}
                />

                <IMaskInput
                    mask="000.000.000-00"
                    value={formData.cpf}
                    onChange={handleChange}
                    name="cpf"
                    type='text'
                    placeholder='CPF *'
                    required
                    onAccept={(value) => handleChange({ target: { name: 'cpf', value } })}
                />

                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                
                <details className="exames-accordion">
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
                        {loading ? 'Cadastrando...' : 'Cadastrar Paciente'}
                    </button>
                </div>
            </form>
            {message && <p className="feedback-message">{message}</p>}
        </div>
    );
};

export default CadastroPacientePage;
