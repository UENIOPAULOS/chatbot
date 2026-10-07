// =============================================================================
// CLIENTES E CONVERSAS — SleepWell
// =============================================================================
// Ponto de integração futura: esta lista de conversas será substituída pelos
// contatos reais recebidos via WhatsApp Business API (webhook).
//
// FUTURA INTEGRAÇÃO WHATSAPP:
// Quando uma mensagem chegar via webhook, o payload terá o formato:
// {
//   "from": "5511999990000",       // número do cliente
//   "name": "Maria Clara",         // nome (se disponível no perfil WhatsApp)
//   "body": "Olá, quero um colchão" // texto da mensagem
// }
// Este objeto deverá ser convertido para o formato abaixo e inserido
// na lista 'conversations' para exibição na interface.
// =============================================================================

var conversations = [
  {
    id: 1,
    name: 'Maria Clara',
    initials: 'MC',
    phone: '+55 11 99876-5432',
    gradient: 'linear-gradient(135deg,#6c5ce7,#a29bfe)',
    preview: 'Olá, quero comprar um colchão.',
    time: '20:31',
    unread: 1
  },
  {
    id: 2,
    name: 'João Pereira',
    initials: 'JP',
    phone: '+55 21 98765-4321',
    gradient: 'linear-gradient(135deg,#00b894,#55efc4)',
    preview: '🤖 Quais tamanhos vocês têm?',
    time: '19:47',
    unread: 0
  },
  {
    id: 3,
    name: 'Ana Beatriz',
    initials: 'AB',
    phone: '+55 31 97654-3210',
    gradient: 'linear-gradient(135deg,#e17055,#fab1a0)',
    preview: '🤖 Seu pedido foi confirmado!',
    time: '18:22',
    unread: 0
  },
  {
    id: 4,
    name: 'Carlos Eduardo',
    initials: 'CE',
    phone: '+55 85 96543-2109',
    gradient: 'linear-gradient(135deg,#fdcb6e,#e17055)',
    preview: 'O Queen está disponível na versão firme?',
    time: '17:55',
    unread: 2
  },
  {
    id: 5,
    name: 'Letícia Souza',
    initials: 'LS',
    phone: '+55 41 95432-1098',
    gradient: 'linear-gradient(135deg,#74b9ff,#0984e3)',
    preview: '🤖 Veja as opções disponíveis:',
    time: '16:30',
    unread: 0
  }
];
