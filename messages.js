// =============================================================================
// CAMADA DE MENSAGENS — SleepWell
// =============================================================================
// Esta camada gerencia o envio e recebimento de mensagens na interface.
//
// FUTURA INTEGRAÇÃO WHATSAPP:
// As funções 'sendMessage' e 'receiveMessage' abaixo são os dois únicos
// pontos que precisarão ser conectados à WhatsApp Business API.
//
//  sendMessage  → Hoje: renderiza na interface local.
//                 Futuro: POST para https://graph.facebook.com/v18.0/{phone_id}/messages
//                 com o token de acesso da sua aplicação Meta.
//
//  receiveMessage → Hoje: chamada diretamente pelo código do chatbot.
//                   Futuro: acionada pelo servidor ao receber o webhook
//                   POST /webhook com o payload da Meta.
// =============================================================================

// --- Estado global da conversa ---
var msgCount       = 0;
var activeConvId   = 1;
var currentStage   = 0;
var stageNames     = ['Saudação', 'Tamanho', 'Posição', 'Conforto', 'Orçamento', 'Proposta', 'Encerrado'];

// Perfil coletado durante a conversa (tamanho, posição, firmeza, orçamento)
var profile = { size: null, position: null, firmness: null, budget: null };

// ---------------------------------------------------------------------------
// ENVIO DE MENSAGEM DO CLIENTE (saída)
// ---------------------------------------------------------------------------
// FUTURA INTEGRAÇÃO WHATSAPP:
// Após renderizar localmente, esta função deverá chamar a API para
// registrar a mensagem enviada no histórico da conversa do WhatsApp.
// ---------------------------------------------------------------------------
function sendMessage(text) {
  addOutgoingMsg(text);
  // TODO (WhatsApp): registrar mensagem no histórico via API
}

// ---------------------------------------------------------------------------
// RECEBIMENTO DE MENSAGEM DO CHATBOT (entrada)
// ---------------------------------------------------------------------------
// FUTURA INTEGRAÇÃO WHATSAPP:
// Esta função será invocada pelo servidor quando chegar um POST no webhook.
// O servidor extrairá o campo 'body' do payload e chamará receiveMessage().
// ---------------------------------------------------------------------------
function receiveMessage(text) {
  var intent = detectIntent(text);
  routeIntent(intent, text);
  // TODO (WhatsApp): enviar resposta do bot via POST graph.facebook.com
}

// ---------------------------------------------------------------------------
// ROTEAMENTO DE INTENÇÕES
// ---------------------------------------------------------------------------
// Mapeia a intenção detectada para o handler correto.
// ---------------------------------------------------------------------------
function routeIntent(intent, originalText) {
  switch (intent.type) {
    case 'catalogo':
      showTyping();
      setTimeout(function() {
        addBotBubble('Com certeza! Abrindo nosso <strong>catálogo completo</strong> com os 8 modelos disponíveis para você... 🛏️✨');
        setTimeout(function() { openCatalogModal(); }, 600);
      }, 1000);
      break;
    case 'vendedor':    handleVendedor();               break;
    case 'size':        respondToSize(intent.value);    break;
    case 'position':    respondToPosition(intent.value);break;
    case 'firmness':    respondToFirmness(intent.value);break;
    case 'question':    respondToQuestion(intent.value);break;
    case 'saudacao':    handleSaudacao();               break;
    case 'afirmativo':
      if      (currentStage >= 5) setTimeout(showProducts,     300);
      else if (currentStage >= 4) setTimeout(botOfferProducts, 300);
      else if (currentStage >= 3) setTimeout(botBudget,        300);
      else if (currentStage >= 2) setTimeout(botComfort,       300);
      else                        setTimeout(botGreet,         300);
      break;
    case 'budget':
      profile.budget = intent.value;
      showTyping();
      setTimeout(function() {
        addBotBubble('Anotado! 👍 Vou buscar as melhores opções para a faixa de <strong>' + intent.value + '</strong>.');
        if (!profile.size) setTimeout(botGreet,         700);
        else               setTimeout(botOfferProducts, 700);
      }, 1400);
      break;
    case 'intent':
      if (intent.value === 'produtos') {
        if (currentStage >= 2) setTimeout(showProducts, 300);
        else                   setTimeout(botGreet,     300);
      }
      break;
    default:
      handleDesconhecido(originalText);
  }
}

// ---------------------------------------------------------------------------
// ENTRADA MANUAL DO USUÁRIO (campo de texto)
// ---------------------------------------------------------------------------
function handleSend() {
  var input = document.getElementById('msgInput');
  var text  = input.value.trim();
  if (!text) return;
  input.value      = '';
  input.style.height = '';
  sendMessage(text);        // renderiza na tela
  receiveMessage(text);     // processa intenção e gera resposta do bot
}

// ---------------------------------------------------------------------------
// HELPERS DE UI — mensagens e rolagem
// ---------------------------------------------------------------------------
function getTime() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function esc(s) {
  return String(s)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}

function scrollBottom() {
  var w = document.getElementById('messagesWrap');
  requestAnimationFrame(function() { w.scrollTop = w.scrollHeight; });
}

function incMsg() {
  msgCount++;
  var el = document.getElementById('msgCount');
  if (el) el.textContent = msgCount;
}

function setStage(s) {
  currentStage = Math.min(s, stageNames.length - 1);
  var el = document.getElementById('stageLabel');
  if (el) el.textContent = stageNames[currentStage];
  updateVisualFlow(currentStage);
}

function updateSizeTag(size) {
  var tag = document.getElementById('sizeTag');
  if (tag) { tag.textContent = size; tag.style.display = 'inline-flex'; }
}

// ---------------------------------------------------------------------------
// RENDERIZAÇÃO DE MENSAGENS NA INTERFACE
// ---------------------------------------------------------------------------
function addOutgoingMsg(text) {
  var wrap = document.getElementById('messagesWrap');
  var div  = document.createElement('div');
  div.className = 'msg outgoing';
  div.innerHTML =
    '<div class="bubble">' +
      '<div class="bubble-text">' + esc(text) + '</div>' +
      '<div class="bubble-meta">' +
        '<span class="bubble-time">' + getTime() + '</span>' +
        '<svg class="tick-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>' +
        '<svg class="tick-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-left:-10px"><polyline points="20 6 9 17 4 12"/></svg>' +
      '</div>' +
    '</div>';
  wrap.appendChild(div);
  incMsg();
  scrollBottom();
}

function showTyping() {
  removeTyping();
  var wrap = document.getElementById('messagesWrap');
  var div  = document.createElement('div');
  div.className = 'msg incoming';
  div.id = 'typing-indicator';
  div.innerHTML = '<div class="bubble typing-bubble"><div class="typing-dots"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>';
  wrap.appendChild(div);
  scrollBottom();
}

function removeTyping() {
  var t = document.getElementById('typing-indicator');
  if (t) t.remove();
}

function addBotBubble(html) {
  removeTyping();
  var wrap = document.getElementById('messagesWrap');
  var div  = document.createElement('div');
  div.className = 'msg incoming';
  div.innerHTML =
    '<div class="bubble">' +
      '<div class="bubble-text">' + html + '</div>' +
      '<div class="bubble-meta"><span class="bubble-time">' + getTime() + '</span></div>' +
    '</div>';
  wrap.appendChild(div);
  incMsg();
  scrollBottom();
}

function addQuickReplies(replies, onSelect) {
  var wrap   = document.getElementById('messagesWrap');
  var qrWrap = document.createElement('div');
  qrWrap.className = 'quick-replies';
  replies.forEach(function(r) {
    var btn = document.createElement('button');
    btn.className   = 'qr-btn';
    btn.textContent = r;
    btn.addEventListener('click', function() {
      qrWrap.querySelectorAll('.qr-btn').forEach(function(b) {
        b.disabled = true;
        b.classList.remove('selected');
      });
      btn.classList.add('selected');
      onSelect(r);
    });
    qrWrap.appendChild(btn);
  });
  wrap.appendChild(qrWrap);
  scrollBottom();
}

function addBotWithReplies(html, replies, onSelect) {
  showTyping();
  setTimeout(function() {
    addBotBubble(html);
    setTimeout(function() { addQuickReplies(replies, onSelect); }, 300);
  }, 1700);
}

// ---------------------------------------------------------------------------
// NOTIFICAÇÃO TOAST
// ---------------------------------------------------------------------------
function showToast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 3000);
}

// ---------------------------------------------------------------------------
// CONFIGURAÇÃO DOS LISTENERS DE INPUT
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('sendBtn').addEventListener('click', handleSend);

  document.getElementById('msgInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  });

  document.getElementById('msgInput').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });
});
