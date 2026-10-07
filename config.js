// =============================================================================
// CONFIGURAÇÕES DA LOJA — SleepWell
// =============================================================================
// Ponto de integração futura: estas configurações poderão ser lidas
// de um banco de dados ou painel administrativo via API REST.
// =============================================================================

var StoreConfig = {

  // --- Identidade da loja ---
  nome:    'SleepWell',
  slogan:  'Colchões Inteligentes',
  botName: 'SleepBot',

  // --- Contato e localização ---
  // FUTURA INTEGRAÇÃO WHATSAPP:
  // Substitua o número abaixo pelo número real registrado na WhatsApp Business API.
  // Formato obrigatório: código do país + DDD + número, sem espaços ou símbolos.
  // Exemplo: '5511999990000'
  whatsappNumber: '5511999990000', // TODO: substituir pelo número real da loja

  // --- Política comercial ---
  // Estes textos são usados pelo chatbot em respostas automáticas.
  garantia:            '5 anos',
  noitesExperiencia:   '100 noites',
  parcelasMaxSemJuros: 12,
  descontoPix:         5, // porcentagem

  // --- Tempo de resposta do vendedor (exibido ao cliente) ---
  tempoRespostaVendedor: '5 minutos', // mensagem informativa apenas

  // --- Horário de funcionamento (informativo) ---
  horarioFuncionamento: 'Segunda a Sábado, das 9h às 18h',

  // FUTURA INTEGRAÇÃO WHATSAPP:
  // Aqui será possível verificar o horário atual e decidir entre
  // resposta automática (fora do horário) ou notificação ao vendedor.
  fora_do_horario_msg: 'Estamos fora do horário de atendimento. Responderemos assim que possível! 🌙',
};
