const db = require('../db');

exports.criarPaciente = async (req, res) => {
    const { nome_completo, celular, cpf, email, exames } = req.body;

    if (!nome_completo || !cpf || !exames || exames.length === 0) {
        return res.status(400).json({ error: 'Nome, CPF e ao menos um exame são obrigatórios.' });
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

exports.pacienteCpf = async (req, res) => {
    const {cpf} = req.query;
    try{
        const result = await db.query(
            'SELECT * FROM pacientes WHERE cpf = $1',
            [cpf]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Paciente não encontrado' });
            }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
        }
};

exports.pacientId = async (req, res) => {
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
}

exports.atualizarDados = async (req, res) => {
    const { id } = req.params;
    const campos = req.body;

    try {
        const pacienteExistente = await db.query(
            'SELECT * FROM pacientes WHERE id = $1',
            [id]
        );

        if (pacienteExistente.rows.length === 0) {
            return res.status(404).json({ message: 'Paciente não encontrado' });
        }

        const chaves = Object.keys(campos);
        if (chaves.length === 0) {
            return res.status(400).json({ message: 'Nenhum dado para atualizar' });
        }

        const setClause = chaves.map((campo, index) => `${campo} = $${index + 1}`).join(', ');
        const valores = Object.values(campos);

        await db.query(
            `UPDATE pacientes SET ${setClause} WHERE id = $${chaves.length + 1}`,
            [...valores, id]
        );

        res.status(200).json({ message: 'Dados do paciente atualizados com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deletarPaciente = async (req, res) => {
  try {
    const { id } = req.params;

    const idNum = Number(id);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const existe = await db.query('SELECT id FROM pacientes WHERE id = $1', [idNum]);
    if (existe.rowCount === 0) {
      return res.status(404).json({ message: 'Paciente não encontrado' });
    }

    const deletado = await db.query(
      `DELETE FROM pacientes 
       WHERE id = $1 
       RETURNING id, nome_completo, cpf, data_nascimento, celular, email`,
      [idNum]
    );

    return res.status(200).json({
      message: 'Paciente excluído com sucesso',
      paciente: deletado.rows[0]
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
