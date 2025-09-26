const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

router.post('/pacientes', pacienteController.criarPaciente);
router.get('/pacientes', pacienteController.listarPacientes);
router.get('/pacientes/cpf', pacienteController.pacienteCpf);
router.get('/pacientes/:id', pacienteController.pacientId);
router.put('/pacientes/editar/:id', pacienteController.atualizarPaciente);
router.delete('/pacientes/deletar/:id', pacienteController.deletarPaciente);

module.exports = router;
