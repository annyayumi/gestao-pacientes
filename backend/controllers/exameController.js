const db = require('../db');

exports.listarExames = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM exames ORDER BY nome_exame ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
