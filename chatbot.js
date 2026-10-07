// =============================================================================
// LÓGICA DO CHATBOT — SleepBot (SleepWell)
// =============================================================================
// Este arquivo concentra toda a inteligência conversacional do assistente:
// - Reconhecimento de intenções (processamento de texto em pt-BR)
// - Fluxos de qualificação (tamanho, posição de dormir, firmeza, orçamento)
// - Recomendação inteligente de produtos baseada nas preferências
// - Respostas a dúvidas frequentes (preço, parcelamento, garantia, entrega)
// - Encaminhamento qualificado para consultor humano (vendedor)
//
// FUTURA INTEGRAÇÃO WHATSAPP:
// 1. O método 'detectIntent' pode ser substituído ou potencializado por
//    um modelo de linguagem (LLM) ou NLP (ex.: Dialogflow / Meta Llama).
// 2. Quando o cliente solicita um vendedor ('handleVendedor'), uma mensagem
//    de alerta com os dados do cliente pode ser disparada automaticamente
//    via WhatsApp para o telefone da equipe de vendas cadastrado em StoreConfig.
// =============================================================================

// Normalização de texto: remove acentos e converte para minúsculas
function norm(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// ---------------------------------------------------------------------------
// DETECÇÃO DE INTENÇÃO (NLP Baseado em Regras em Português)
// ---------------------------------------------------------------------------
// FUTURA INTEGRAÇÃO WHATSAPP:
// Aqui você pode plugar a chamada para uma API de IA generativa (ex.: Gemini / OpenAI)
// caso deseje processamento de linguagem natural aberto além das regras abaixo.
// ---------------------------------------------------------------------------
function detectIntent(text) {
  var t = norm(text);

  // Vendedor / Atendimento humano — prioridade alta
  if (/\b(falar com (um |uma )?(vendedor|atendente|consultor|pessoa|humano)|quero (um |uma )?(vendedor|atendente|consultor)|atendimento humano|atendente|vendedor|consultor|preciso de ajuda (humana|de alguem)|humano)\b/.test(t))
    return { type: 'vendedor' };

  // Identificação de tamanho
  if (/\bsolteiro\b/.test(t))  return { type: 'size', value: 'Solteiro' };
  if (/\bcasal\b/.test(t))     return { type: 'size', value: 'Casal' };
  if (/\bqueen\b/.test(t))     return { type: 'size', value: 'Queen' };
  if (/\bking\b/.test(t))      return { type: 'size', value: 'King' };

  // Posição de dormir
  if (/\b(de lado|durmo de lado|durmo no lado|lateral(mente)?|ombro|quadril)\b/.test(t))
    return { type: 'position', value: 'lado' };
  if (/\b(de costas|durmo de costas|barriga (para|pra) cima|posicao de costas)\b/.test(t))
    return { type: 'position', value: 'costas' };
  if (/\b(de brucos?|durmo de brucos?|barriga (para|pra) baixo|de bruço)\b/.test(t))
    return { type: 'position', value: 'bruço' };
  if (/\b(vario|mudo|varia(s|m)?|qualquer posicao|nao tenho posicao|todas as posicoes)\b/.test(t))
    return { type: 'position', value: 'varia' };

  // Firmeza
  if (/\b(macio|mole|suave|fofo|confortavel|super macio|bem macio)\b/.test(t))
    return { type: 'firmness', value: 'Macio' };
  if (/\b(medio|intermediario|nem mole nem duro|nem macio nem firme|equilibrado|no meio)\b/.test(t))
    return { type: 'firmness', value: 'Médio' };
  if (/\b(firme|duro|rigido|resistente|ortopedico|mais duro|bem firme|mais firme)\b/.test(t))
    return { type: 'firmness', value: 'Firme' };

  // Orçamento
  if (/\b(1[.,]?500\s*(a|ate|–|-)\s*3[.,]?000|entre\s*(r\$\s*)?1[.,]?5\s*(e|a)\s*(r\$\s*)?3)\b/.test(t))
    return { type: 'budget', value: 'R$ 1.500 – R$ 3.000' };
  if (/\b(3[.,]?000|5[.,]?000|acima de|mais de (r\$\s*)?3)\b/.test(t))
    return { type: 'budget', value: 'R$ 3.000 – R$ 5.000' };
  if (/\b(ate\s*(r\$\s*)?(1[.,]?5(00)?|1500|1\.500)|menos de\s*(r\$\s*)?1[.,]?5|economico|mais barato|mais em conta)\b/.test(t))
    return { type: 'budget', value: 'Até R$ 1.500' };
  if (/\b(sem limite|qualquer preco|nao importa o preco|tanto faz|preco nao e problema)\b/.test(t))
    return { type: 'budget', value: 'Sem limite' };

  // Dúvidas frequentes (FAQ)
  if (/\b(quanto (custa|cust|vale)|qual (o|a) (preco|valor|custo)|preco|precos|valores?|caro|orcamento)\b/.test(t))
    return { type: 'question', value: 'preco' };
  if (/\b(parcel\w*|divid\w*|cartao|credito|12x|10x|vezes|pagar em|pix|boleto)\b/.test(t))
    return { type: 'question', value: 'parcelamento' };
  if (/\b(promoc\w*|desconto\w*|oferta\w*|mais barato|economiz\w*|campanha\w*|promo\b|tem alguma promoc\w*)\b/.test(t))
    return { type: 'question', value: 'promocao' };
  if (/\b(garanti\w*|durabilid\w*|dura\b|qualidade|material|fabricacao|quanto dura)\b/.test(t))
    return { type: 'question', value: 'garantia' };
  if (/\b(entrega\w*|frete\w*|prazo\w*|receber|chegada|quando chega|envio)\b/.test(t))
    return { type: 'question', value: 'entrega' };
  if (/\b(tamanho\w*|medida\w*|dimens\w*|quais tamanhos|tem.*tamanho)\b/.test(t))
    return { type: 'question', value: 'tamanhos' };
  if (/\b(troca\w*|devolv\w*|devolucao|nao gostei|nao gostar)\b/.test(t))
    return { type: 'question', value: 'devolucao' };

  // Intenção de ver catálogo completo
  if (/\b(catalogo|ver catalogo|abrir catalogo|cardapio|lista de colchoes|ver todos|modelos disponiveis)\b/.test(t))
    return { type: 'catalogo' };

  // Intenção de ver produtos
  if (/\b(mostrar|quero ver|ver (opcoes|produtos|modelos|colchoes)|opcoes|produtos|modelos|recomend\w*|indica\w*|sugere|sugira|mostra|apresenta)\b/.test(t))
    return { type: 'intent', value: 'produtos' };

  // Confirmação / Afirmativo
  if (/^(sim|pode|claro|ok|quero|ótimo|otimo|isso|com certeza|vai|bora|perfeito|show|topo|vamos|s|s\.?)\b/.test(t))
    return { type: 'afirmativo' };

  // Saudação
  if (/^(ola|oi|bom dia|boa tarde|boa noite|hello|hi|opa|ei|e ai|eai|olá)\b/.test(t))
    return { type: 'saudacao' };

  return { type: 'desconhecido' };
}

// ---------------------------------------------------------------------------
// ETAPAS DO FUNIL DE CONVERSAÇÃO
// ---------------------------------------------------------------------------

function botGreet() {
  setStage(1);
  addBotWithReplies(
    'Olá! 😊 Sou o <strong>' + StoreConfig.botName + '</strong>, seu consultor especialista de colchões da ' + StoreConfig.nome + '.<br>Vou te ajudar a encontrar o <strong>colchão perfeito</strong> para o seu descanso!<br><br>Qual <strong>tamanho</strong> você está procurando?',
    ['Solteiro', 'Casal', 'Queen', 'King', 'Não tenho certeza'],
    function(choice) {
      addOutgoingMsg(choice);
      if (choice !== 'Não tenho certeza') {
        profile.size = choice;
        setStage(2);
        updateSizeTag(choice);
      }
      setTimeout(botPosition, 400);
    }
  );
}

function botPosition() {
  setStage(2);
  addBotWithReplies(
    'Perfeito! 👍 E para indicar o melhor modelo:<br><strong>Como você costuma dormir?</strong>',
    ['De lado 🌙', 'De costas 💤', 'De bruço 😴', 'Varia muito'],
    function(choice) {
      addOutgoingMsg(choice);
      if (choice.includes('lado'))        profile.position = 'lado';
      else if (choice.includes('costas')) profile.position = 'costas';
      else if (choice.includes('bruço'))  profile.position = 'bruço';
      else                                profile.position = 'varia';
      setTimeout(botComfort, 400);
    }
  );
}

function botComfort() {
  setStage(3);
  var dica = '';
  if (profile.position === 'lado')
    dica = '<br><small style="color:var(--accent)">💡 Dica: para quem dorme de lado, colchões macios a intermediários aliviam a pressão nos ombros e quadril mantendo a coluna alinhada.</small>';
  else if (profile.position === 'costas')
    dica = '<br><small style="color:var(--accent)">💡 Dica: para quem dorme de costas, firmeza intermediária a firme dá o suporte correto para a lombar.</small>';
  else if (profile.position === 'bruço')
    dica = '<br><small style="color:var(--accent)">💡 Dica: para quem dorme de bruço, colchões mais firmes evitam curvatura excessiva da coluna.</small>';

  addBotWithReplies(
    'Qual sensação de <strong>firmeza</strong> você prefere?' + dica,
    ['Macio 🌥️', 'Médio 🌤️', 'Firme 🏋️', 'Não sei ainda'],
    function(choice) {
      addOutgoingMsg(choice);
      if (choice.includes('Macio'))       profile.firmness = 'Macio';
      else if (choice.includes('Médio'))  profile.firmness = 'Médio';
      else if (choice.includes('Firme'))  profile.firmness = 'Firme';
      setTimeout(botBudget, 400);
    }
  );
}

function botBudget() {
  setStage(4);
  addBotWithReplies(
    'Excelente! 💰 E qual é a sua <strong>faixa de orçamento</strong> aproximada?',
    ['Até R$ 1.500', 'R$ 1.500 – R$ 3.000', 'R$ 3.000 – R$ 5.000', 'Sem limite'],
    function(choice) {
      addOutgoingMsg(choice);
      profile.budget = choice;
      setTimeout(botOfferProducts, 400);
    }
  );
}

function botOfferProducts() {
  setStage(5);
  addBotWithReplies(
    'Maravilha! 🎯 Com base no seu perfil, selecionei os colchões mais recomendados para você.<br>Quer conhecer as opções agora?',
    ['Sim, quero ver! 🛏️', 'Me conta sobre garantia e frete'],
    function(choice) {
      addOutgoingMsg(choice);
      if (choice.startsWith('Sim')) {
        setTimeout(showProducts, 400);
      } else {
        showTyping();
        setTimeout(function() {
          addBotBubble(
            'Com certeza! 😊 Todos os colchões ' + StoreConfig.nome + ' contam com:<br>' +
            '✅ <strong>' + StoreConfig.garantia + ' de garantia</strong> de fábrica<br>' +
            '🚚 <strong>Frete grátis</strong> para todo o Brasil<br>' +
            '🌙 <strong>' + StoreConfig.noitesExperiencia + ' de experiência</strong> no conforto da sua casa<br>' +
            '💳 Parcelamento em até <strong>' + StoreConfig.parcelasMaxSemJuros + 'x sem juros</strong> ou ' + StoreConfig.descontoPix + '% OFF no Pix'
          );
          setTimeout(function() {
            addBotWithReplies('Pronto para ver as opções?', ['Sim, pode mostrar! 🛏️', 'Falar com um vendedor'], function(c2) {
              addOutgoingMsg(c2);
              if (c2.includes('vendedor')) handleVendedor();
              else setTimeout(showProducts, 400);
            });
          }, 600);
        }, 1800);
      }
    }
  );
}

// ---------------------------------------------------------------------------
// RECOMENDAÇÃO INTELIGENTE DE PRODUTOS
// ---------------------------------------------------------------------------
function showProducts() {
  setStage(5);
  showTyping();
  setTimeout(function() {
    var selSize = profile.size;
    var filtered = catalog.slice();

    // Filtra pelo tamanho se o cliente tiver escolhido um específico
    if (selSize && selSize !== 'Não tenho certeza') {
      var match = catalog.filter(function(p) { return p.sizeCategory === selSize; });
      if (match.length > 0) filtered = match;
    }

    // Filtra por firmeza se houver preferência e mais de 2 produtos
    if (profile.firmness && filtered.length > 2) {
      var firmMatch = filtered.filter(function(p) {
        return norm(p.firmness) === norm(profile.firmness);
      });
      if (firmMatch.length > 0) filtered = firmMatch;
    }

    // Limita a exibição inicial no chat para 3 melhores opções recomendadas
    var displayed = filtered.slice(0, 3);

    var intro = '🛏️ Aqui estão as melhores recomendações';
    if (profile.size && profile.size !== 'Não tenho certeza') intro += ' no tamanho <strong>' + profile.size + '</strong>';
    if (profile.firmness) intro += ' com sensação <strong>' + profile.firmness + '</strong>';
    intro += ' do nosso catálogo:';
    addBotBubble(intro);

    var wrap = document.getElementById('messagesWrap');
    var row = document.createElement('div');
    row.className = 'products-row';

    displayed.forEach(function(p) {
      var wrapper = document.createElement('div');
      wrapper.innerHTML = renderProductCardHtml(p, false).trim();
      var card = wrapper.firstChild;
      card.querySelector('.product-cta').addEventListener('click', function(e) {
        var name = e.currentTarget.getAttribute('data-name');
        onProductSelect(name);
      });
      row.appendChild(card);
    });

    wrap.appendChild(row);
    scrollBottom();

    setTimeout(function() {
      addBotWithReplies(
        '💳 Todas as opções contam com <strong>frete grátis</strong>, <strong>' + StoreConfig.noitesExperiencia + ' de experiência</strong> e parcelamento em <strong>' + StoreConfig.parcelasMaxSemJuros + 'x sem juros</strong>.<br><br>Qual delas mais chamou sua atenção? Ou prefere ver todos os 8 modelos do nosso catálogo completo?',
        ['Quero ver o Catálogo Completo 📖', 'Falar com um vendedor', 'Tenho uma dúvida'],
        function(choice) {
          addOutgoingMsg(choice);
          if (choice.includes('Catálogo')) {
            openCatalogModal();
          } else if (choice.includes('vendedor')) {
            handleVendedor();
          } else {
            showTyping();
            setTimeout(function() {
              addBotBubble('Pode perguntar! Qual é a sua dúvida sobre garantia, entrega ou pagamento? 😊');
            }, 1200);
          }
        }
      );
    }, 600);
  }, 2000);
}

// Quando o cliente escolhe um colchão
function onProductSelect(name) {
  var step6 = document.getElementById('flowStep6');
  if (step6) {
    for (var i = 1; i <= 5; i++) {
      var el = document.getElementById('flowStep' + i);
      if (el) { el.classList.remove('active'); el.classList.add('completed'); }
    }
    step6.classList.add('active');
  }
  addOutgoingMsg('Quero o ' + name + '! 🎉');
  showTyping();
  setTimeout(function() {
    addBotBubble(
      '🎉 Excelente escolha! O <strong>' + esc(name) + '</strong> é um colchão excepcional!<br><br>' +
      'Já registrei seu interesse e passei os detalhes para nossa equipe. Um consultor entrará em contato em até <strong>15 minutos</strong> pelo WhatsApp para confirmar o endereço e detalhes de entrega. 🚚<br><br>' +
      'Obrigado por escolher a <strong>' + StoreConfig.nome + '</strong>! Boas noites de sono esperam por você 🌙✨'
    );
    setStage(6);
    var c = conversations.find(function(x) { return x.id === 1; });
    if (c) { c.preview = '🤖 Pedido registrado: ' + name; c.time = getTime(); renderConversations(); }

    // FUTURA INTEGRAÇÃO WHATSAPP:
    // Aqui um webhook/notificação pode ser enviado para a equipe de vendas
    // com o lead qualificado contendo o modelo escolhido.
  }, 2000);
}

// ---------------------------------------------------------------------------
// RESPOSTAS A PERGUNTAS E INTENÇÕES ESPECÍFICAS
// ---------------------------------------------------------------------------

function respondToSize(value) {
  profile.size = value;
  setStage(2);
  updateSizeTag(value);
  showTyping();
  setTimeout(function() {
    var intro = 'Ótimo! Tamanho <strong>' + value + '</strong> anotado. 👍';
    if (value === 'King') {
      intro = 'Temos sim! Nossos colchões no tamanho <strong>King (193 x 203 cm)</strong> oferecem o máximo de espaço, estabilidade e conforto. 👑';
    } else if (value === 'Queen') {
      intro = 'Excelente escolha! O tamanho <strong>Queen (158 x 198 cm)</strong> é o nosso modelo mais vendido, perfeito para casais. ✨';
    } else if (value === 'Casal') {
      intro = 'Perfeito! No tamanho <strong>Casal padrão (138 x 188 cm)</strong> temos opções com excelente custo-benefício e conforto. 🛏️';
    } else if (value === 'Solteiro') {
      intro = 'Ótimo! No tamanho <strong>Solteiro (88 x 188 cm)</strong> temos modelos confortáveis e muito duráveis. 👍';
    }
    addBotBubble(intro + '<br><br>Para eu te indicar o colchão certo: <strong>como você costuma dormir?</strong>');
    setTimeout(function() {
      addQuickReplies(['De lado 🌙', 'De costas 💤', 'De bruço 😴', 'Varia muito'], function(choice) {
        addOutgoingMsg(choice);
        if (choice.includes('lado'))        profile.position = 'lado';
        else if (choice.includes('costas')) profile.position = 'costas';
        else if (choice.includes('bruço'))  profile.position = 'bruço';
        else                                profile.position = 'varia';
        setTimeout(botComfort, 400);
      });
    }, 400);
  }, 1400);
}

function respondToPosition(value) {
  profile.position = value;
  var rec = '';
  if (value === 'lado')
    rec = 'Para quem <strong>dorme de lado</strong>, recomendamos colchões <strong>intermediários a macios</strong> (como molas ensacadas com espuma viscoelástica), pois aliviam os pontos de pressão nos ombros e quadril mantendo a coluna alinhada. 😊';
  else if (value === 'costas')
    rec = 'Para quem <strong>dorme de costas</strong>, colchões de <strong>firmeza intermediária a firme</strong> são os mais indicados, garantindo sustentação uniforme na lombar. 💪';
  else if (value === 'bruço')
    rec = 'Para quem <strong>dorme de bruço</strong>, colchões mais <strong>firmes</strong> são essenciais para evitar que o quadril afunde e cause dores na coluna. 🏋️';
  else
    rec = 'Para quem <strong>varia bastante de posição</strong> durante a noite, os colchões de <strong>firmeza intermediária equilibrada</strong> são os mais adaptáveis. 😴';

  showTyping();
  setTimeout(function() {
    if (!profile.size) {
      addBotBubble(rec + '<br><br>Você já tem em mente o <strong>tamanho desejado</strong> (Solteiro, Casal, Queen ou King)?');
      setTimeout(function() {
        addQuickReplies(['Solteiro', 'Casal', 'Queen', 'King', 'Não tenho certeza'], function(sz) {
          addOutgoingMsg(sz);
          if (sz !== 'Não tenho certeza') {
            profile.size = sz;
            updateSizeTag(sz);
          }
          setStage(2);
          setTimeout(botComfort, 400);
        });
      }, 400);
    } else {
      addBotBubble(rec + '<br><br>Você tem preferência sobre a <strong>firmeza</strong> do colchão?');
      setTimeout(function() {
        addQuickReplies(['Macio 🌥️', 'Médio 🌤️', 'Firme 🏋️', 'Sem preferência'], function(choice) {
          addOutgoingMsg(choice);
          if (choice.includes('Macio'))       profile.firmness = 'Macio';
          else if (choice.includes('Médio'))  profile.firmness = 'Médio';
          else if (choice.includes('Firme'))  profile.firmness = 'Firme';
          setStage(3);
          setTimeout(botBudget, 400);
        });
      }, 400);
    }
  }, 1500);
}

function respondToFirmness(value) {
  profile.firmness = value;
  var msg = '';
  if (value === 'Macio')
    msg = 'Colchões com toque <strong>macio</strong> proporcionam aquela sensação acolhedora de nuvem, ideal para alívio de pontos de pressão. 🌥️';
  else if (value === 'Médio')
    msg = 'A firmeza <strong>média / intermediária</strong> é a mais versátil e procurada, combinando suporte e maciez na medida certa. 🌤️';
  else if (value === 'Firme')
    msg = 'Colchões mais <strong>firmes</strong> oferecem excelente sustentação ortopédica para a coluna e maior durabilidade. 🏋️';

  showTyping();
  setTimeout(function() {
    if (!profile.size) {
      addBotBubble(msg + '<br><br>E qual <strong>tamanho</strong> você está buscando?');
      setTimeout(function() {
        addQuickReplies(['Solteiro', 'Casal', 'Queen', 'King'], function(sz) {
          addOutgoingMsg(sz);
          profile.size = sz;
          setStage(2);
          updateSizeTag(sz);
          setTimeout(botBudget, 400);
        });
      }, 400);
    } else {
      addBotBubble(msg);
      setTimeout(botBudget, 600);
    }
  }, 1400);
}

function respondToQuestion(qtype) {
  var respostas = {
    preco:
      'Nossos colchões vão de <strong>R$ 899</strong> a <strong>R$ 3.890</strong>, todos com frete grátis, 5 anos de garantia e parcelamento em até <strong>12x sem juros</strong>. 💰<br><br>Gostaria de ver as opções que cabem no seu orçamento?',
    parcelamento:
      'Sim! Parcelamos em até <strong>12x sem juros</strong> no cartão de crédito. 💳 Também aceitamos <strong>Pix com 5% de desconto</strong> e boleto bancário.<br><br>Quer conhecer os modelos disponíveis?',
    promocao:
      '🎉 Sim, temos vantagens ativas!<br>• <strong>Frete grátis</strong> para todo o Brasil<br>• <strong>100 noites de experiência</strong> em casa<br>• <strong>5% de desconto à vista no Pix</strong><br><br>Quer dar uma olhada nos modelos em destaque?',
    garantia:
      'Todos os nossos colchões possuem <strong>5 anos de garantia oficial</strong> de fábrica contra defeitos ou deformações. 🛡️<br>Além disso, você tem <strong>100 noites de experiência</strong>: se não se adaptar, recolhemos o colchão e devolvemos 100% do seu dinheiro!',
    entrega:
      'A entrega é <strong>100% grátis</strong> para todo o Brasil! 🚚<br>O prazo médio é de <strong>5 a 10 dias úteis</strong>, com agendamento prévio para a sua comodidade.',
    tamanhos:
      'Trabalhamos com todos os tamanhos padrão brasileiros:<br>' +
      '📐 <strong>Solteiro</strong> — 88 x 188 cm<br>' +
      '📐 <strong>Casal</strong> — 138 x 188 cm<br>' +
      '📐 <strong>Queen</strong> — 158 x 198 cm<br>' +
      '📐 <strong>King</strong> — 193 x 203 cm<br><br>' +
      'Qual tamanho você gostaria para a sua cama?',
    devolucao:
      'Pode testar com total tranquilidade! Oferecemos <strong>100 noites de experiência</strong>. Se dentro desse período você não amar o colchão, nossa equipe busca o produto na sua casa <strong>sem taxa alguma</strong> e estorna o valor integral. 🙂'
  };

  showTyping();
  setTimeout(function() {
    addBotBubble(respostas[qtype] || 'Posso te ajudar com essa e outras dúvidas! O que mais você gostaria de saber? 😊');
    if (['preco', 'parcelamento', 'promocao'].includes(qtype)) {
      setTimeout(function() {
        addQuickReplies(['Ver opções de colchões 🛏️', 'Falar com um vendedor'], function(choice) {
          addOutgoingMsg(choice);
          if (choice.includes('Ver')) {
            if (currentStage < 2) setTimeout(botGreet, 400);
            else setTimeout(showProducts, 400);
          } else {
            handleVendedor();
          }
        });
      }, 400);
    } else if (qtype === 'tamanhos') {
      setTimeout(function() {
        addQuickReplies(['Solteiro', 'Casal', 'Queen', 'King'], function(sz) {
          addOutgoingMsg(sz);
          respondToSize(sz);
        });
      }, 400);
    }
  }, 1500);
}

// ---------------------------------------------------------------------------
// ATENDIMENTO HUMANO / ENCAMINHAMENTO PARA VENDEDOR
// ---------------------------------------------------------------------------
// FUTURA INTEGRAÇÃO WHATSAPP:
// Esta função dispara um alerta via API para a equipe comercial ou
// atribui o chat a um atendente no painel de atendimento multiagente.
// ---------------------------------------------------------------------------
function handleVendedor() {
  showTyping();
  setTimeout(function() {
    addBotBubble('Com certeza! 😊 Vou transferir você para um de nossos especialistas em sono agora mesmo.<br>⏳ Só um momento...');
    setTimeout(function() {
      showTyping();
      setTimeout(function() {
        addBotBubble(
          '✅ <strong>Pronto!</strong> Um consultor especialista da ' + StoreConfig.nome + ' já foi notificado e responderá aqui neste chat em até <strong>' + StoreConfig.tempoRespostaVendedor + '</strong>. 📲<br><br>' +
          'Enquanto isso, você prefere dar uma olhada nos modelos disponíveis?'
        );
        setTimeout(function() {
          addQuickReplies(['Ver colchões disponíveis 🛏️', 'Tudo bem, vou aguardar!'], function(choice) {
            addOutgoingMsg(choice);
            if (choice.includes('Ver')) {
              if (currentStage < 2) setTimeout(botGreet, 400);
              else setTimeout(showProducts, 400);
            } else {
              showTyping();
              setTimeout(function() {
                addBotBubble('Perfeito! 😊 Nosso consultor já está a caminho. Tenha um excelente dia!');
              }, 1400);
            }
          });
        }, 400);
      }, 2000);
    }, 1200);
  }, 1200);
}

function handleSaudacao() {
  showTyping();
  setTimeout(function() {
    addBotBubble('Olá! 😊 Que bom ter você aqui na ' + StoreConfig.nome + '!<br>Como posso te ajudar hoje?');
    setTimeout(function() {
      addQuickReplies(['Quero comprar um colchão 🛏️', 'Tirar uma dúvida', 'Ver promoções 🎉', 'Falar com vendedor'], function(choice) {
        addOutgoingMsg(choice);
        if (choice.includes('comprar'))        setTimeout(botGreet, 400);
        else if (choice.includes('promoç'))    respondToQuestion('promocao');
        else if (choice.includes('vendedor'))  handleVendedor();
        else {
          showTyping();
          setTimeout(function() {
            addBotBubble('Pode perguntar! Estou aqui para esclarecer qualquer dúvida sobre nossos colchões. 😊');
          }, 1400);
        }
      });
    }, 400);
  }, 1200);
}

function handleDesconhecido(text) {
  showTyping();
  setTimeout(function() {
    addBotBubble('Entendido! 😊 Posso te ajudar a encontrar o colchão ideal ou esclarecer qualquer dúvida.<br>Por onde você prefere começar?');
    setTimeout(function() {
      addQuickReplies(['Encontrar meu colchão 🛏️', 'Ver preços e condições', 'Falar com vendedor'], function(choice) {
        addOutgoingMsg(choice);
        if (choice.includes('Encontrar')) {
          if (currentStage < 2) setTimeout(botGreet, 400);
          else setTimeout(showProducts, 400);
        } else if (choice.includes('preços')) {
          respondToQuestion('preco');
        } else if (choice.includes('vendedor')) {
          handleVendedor();
        }
      });
    }, 400);
  }, 1400);
}
