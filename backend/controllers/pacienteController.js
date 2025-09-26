const db = require('../db.js');

exports.criarPaciente = async (req, res) => {
    const { nome_completo, celular, cpf, email, exames } = req.body;

    if (!nome_completo || !cpf || !exames || exames.length === 0) {
        return res.status(400).json({ error: 'Selecione pelo menos um exame' });
    }

    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        const cpfExistente = await client.query('SELECT id FROM pacientes WHERE cpf = $1', [cpf]);
        if (cpfExistente.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ error: 'CPF já cadastrado no sistema.' });
        }

        const pacienteQuery = 'INSERT INTO pacientes (nome_completo, celular, cpf, email) VALUES ($1, $2, $3, $4) RETURNING id';
        const pacienteResult = await client.query(pacienteQuery, [nome_completo, celular, cpf, email]);
        const novoPacienteId = pacienteResult.rows[0].id;

        const exameQuery = 'INSERT INTO paciente_exames (paciente_id, exame_id) VALUES ($1, $2)';
        
        for (const exameId of exames) {
            await client.query(exameQuery, [novoPacienteId, exameId]);
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Paciente cadastrado com sucesso!', pacienteId: novoPacienteId });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao criar paciente:', error);
        res.status(500).json({ error: 'Ocorreu um erro interno ao cadastrar o paciente.' });
    } finally {
        client.release();
    }
};

exports.listarPacientes = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM pacientes ORDER BY nome_completo ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.pacientId = async (req, res) => {
    const { id } = req.params;
    try {
        // Busca dados do paciente
        const pacienteResult = await db.query(
            'SELECT * FROM pacientes WHERE id = $1',
            [id]
        );
        
        if (pacienteResult.rows.length === 0) {
            return res.status(404).json({ message: 'Paciente não encontrado' });
        }

        // Busca os exames associados
        const examesResult = await db.query(
            'SELECT exame_id FROM paciente_exames WHERE paciente_id = $1',
            [id]
        );

        const paciente = pacienteResult.rows[0];
        // Extrai apenas os IDs dos exames para um array [1, 3, 5]
        const exames = examesResult.rows.map(row => row.exame_id);

        // Retorna o paciente junto com seu array de exames
        res.status(200).json({ ...paciente, exames });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.pacienteCpf = async (req, res) => {
    const {cpf} = req.query;
    const cpfLimpo = cpf.replace(/\D/g, '');
    try{
        const result = await db.query(
            'SELECT * FROM pacientes WHERE cpf = $1',
            [cpfLimpo]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Paciente não encontrado' });
            }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
        }
};

/*exports.pacientId = async (req, res) => {
    const {id} = req.params;
    try{
        const result = await db.query(
            'SELECT * FROM pacientes WHERE id = $1',
            [id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Paciente não encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}*/

exports.deletarPaciente = async (req, res) => {
    // A função agora pega o 'id' dos parâmetros da rota
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'ID do paciente é obrigatório.' });
    }

    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Deletar os registros de exames associados a este paciente
        // Usamos o 'id' diretamente, que é mais eficiente.
        await client.query('DELETE FROM paciente_exames WHERE paciente_id = $1', [id]);

        // 2. Deletar o paciente da tabela de pacientes
        const deleteResult = await client.query('DELETE FROM pacientes WHERE id = $1', [id]);
        
        // Verificamos se alguma linha foi realmente deletada para dar um retorno 404 caso o ID não exista
        if (deleteResult.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Paciente não encontrado.' });
        }

        // 3. Efetivar a transação
        await client.query('COMMIT');

        res.status(200).json({ message: 'Paciente deletado com sucesso!' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao deletar paciente:', error);
        res.status(500).json({ error: 'Ocorreu um erro interno ao deletar o paciente.' });
    } finally {
        client.release();
    }
};

exports.atualizarPaciente = async (req, res) => {
    const { id } = req.params;
    const { nome_completo, celular, email, exames } = req.body;

    // Validação básica
    if (!nome_completo || !exames || exames.length === 0) {
        return res.status(400).json({ error: 'Nome e pelo menos um exame são obrigatórios.' });
    }

    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Atualizar os dados na tabela 'pacientes'
        const updatePacienteQuery = `
            UPDATE pacientes 
            SET nome_completo = $1, celular = $2, email = $3 
            WHERE id = $4
        `;
        await client.query(updatePacienteQuery, [nome_completo, celular, email, id]);

        // 2. Deletar todos os exames antigos associados a este paciente
        await client.query('DELETE FROM paciente_exames WHERE paciente_id = $1', [id]);

        // 3. Inserir a nova lista de exames
        const insertExameQuery = 'INSERT INTO paciente_exames (paciente_id, exame_id) VALUES ($1, $2)';
        for (const exameId of exames) {
            await client.query(insertExameQuery, [id, exameId]);
        }

        // 4. Efetivar a transação
        await client.query('COMMIT');

        res.status(200).json({ message: 'Paciente atualizado com sucesso!' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao atualizar paciente:', error);
        res.status(500).json({ error: 'Ocorreu um erro interno ao atualizar o paciente.' });
    } finally {
        client.release();
    }
};