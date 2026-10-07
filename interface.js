// =============================================================================
// INTERFACE E APRESENTAÇÃO — SleepWell
// =============================================================================
// Este arquivo gerencia todos os componentes de interface da aplicação:
// - Renderização de cards de produtos do catálogo
// - Painel lateral de conversas ativas (WhatsApp inbox)
// - Modal do catálogo completo com filtros dinâmicos de tamanho e preço
// - Modal de apresentação executiva para donos de lojas (Pitch SaaS)
// - Controlador dos 3 cenários interativos de vendas para demonstrações
//
// FUTURA INTEGRAÇÃO WHATSAPP:
// - A lista lateral de conversas ('renderConversations') será alimentada
//   diretamente pelas mensagens reais recebidas pelo webhook da Meta.
// - Ações como 'Quero este' poderão gerar um link de pagamento direto
//   (ex.: PIX Copia-e-Cola ou link de checkout) enviado pelo WhatsApp.
// =============================================================================

// ---------------------------------------------------------------------------
// RENDERIZADOR DE CARDS DE PRODUTO
// ---------------------------------------------------------------------------
function renderProductCardHtml(p, inCatalog) {
  var firmnessClass = 'firmness-' + norm(p.firmness).replace(/\s+/g, '');
  return `
    <div class="product-card" data-id="${p.id}">
      <div class="product-img" style="background:${p.gradient};">
        ${p.svgBed}
        <div class="product-badge">${esc(p.badge)}</div>
      </div>
      <div class="product-body">
        <div class="product-header-line">
          <div class="product-name">${esc(p.name)}</div>
          <div class="stars">${p.stars}</div>
        </div>
        <div class="product-desc">${esc(p.desc)}</div>
        <div class="product-specs-row">
          <span class="spec-chip">📐 ${esc(p.size)}</span>
          <span class="spec-chip">📏 Altura: ${esc(p.height)}</span>
          <span class="spec-chip ${firmnessClass}">🛡️ Firmeza: ${esc(p.firmness)}</span>
        </div>
        <div class="product-pricing">
          <div class="price-old">${esc(p.oldPrice)}</div>
          <div class="price-promo"><span class="price-prefix">por</span> ${esc(p.price)}</div>
          <div class="price-terms">${esc(p.terms)}</div>
        </div>
        <button class="product-cta" data-name="${esc(p.name)}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Quero este
        </button>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// LISTA DE CONVERSAS NA SIDEBAR (ESTILO WHATSAPP BUSINESS)
// ---------------------------------------------------------------------------
function renderConversations() {
  var list = document.getElementById('conversationList');
  if (!list) return;
  list.innerHTML = '';
  conversations.forEach(function(c) {
    var el = document.createElement('div');
    el.className = 'conv-item' + (c.id === activeConvId ? ' active' : '');
    var isBot = c.preview.startsWith('🤖');
    el.innerHTML =
      '<div class="avatar ' + (c.id === activeConvId ? 'avatar-online' : '') + '" style="background:' + c.gradient + '; color:#fff; font-size:14px; font-weight:700;">' + c.initials + '</div>' +
      '<div class="conv-info">' +
        '<div class="conv-top"><span class="conv-name">' + c.name + '</span><span class="conv-time">' + c.time + '</span></div>' +
        '<div class="conv-bottom">' +
          '<span class="conv-preview' + (isBot ? ' bot' : '') + '">' + c.preview + '</span>' +
          '<div style="display:flex;align-items:center;gap:6px;">' +
            (c.unread > 0 ? '<span class="unread-badge">' + c.unread + '</span>' : '') +
            (c.id === activeConvId ? '<div class="bot-indicator"><div class="bot-dot"></div>BOT</div>' : '') +
          '</div>' +
        '</div>' +
      '</div>';
    el.addEventListener('click', function() { onConvClick(c.id); });
    list.appendChild(el);
  });
}

function onConvClick(id) {
  if (id !== 1) {
    showToast('Esta demo interativa exibe a conversa de Maria Clara 💬');
    return;
  }
  activeConvId = id;
  renderConversations();
}

// ---------------------------------------------------------------------------
// MODAL DO CATÁLOGO DE PRODUTOS E FILTROS
// ---------------------------------------------------------------------------
var catFilters = {
  size: 'Todos',
  price: 'Todos'
};

function openCatalogModal(initialSize) {
  if (initialSize && ['Solteiro', 'Casal', 'Queen', 'King'].includes(initialSize)) {
    catFilters.size = initialSize;
    document.querySelectorAll('#sizeFilters .cat-filter-btn').forEach(function(b) {
      b.classList.toggle('active', b.getAttribute('data-val') === initialSize);
    });
  }
  renderCatalogGrid();
  var m = document.getElementById('catalogModal');
  if (m) m.classList.add('active');
}

function closeCatalogModal() {
  var m = document.getElementById('catalogModal');
  if (m) m.classList.remove('active');
}

function renderCatalogGrid() {
  var grid = document.getElementById('catalogGrid');
  var badge = document.getElementById('catalogCountBadge');
  if (!grid) return;

  var filtered = catalog.filter(function(p) {
    // Filtro por tamanho
    if (catFilters.size !== 'Todos' && p.sizeCategory !== catFilters.size) {
      return false;
    }
    // Filtro por faixa de preço
    if (catFilters.price === 'ate1500' && p.priceNum > 1500) return false;
    if (catFilters.price === '1500a2500' && (p.priceNum < 1500 || p.priceNum > 2500)) return false;
    if (catFilters.price === 'acima2500' && p.priceNum <= 2500) return false;

    return true;
  });

  if (badge) badge.textContent = 'Exibindo ' + filtered.length + ' de ' + catalog.length + ' produtos';

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="catalog-empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <div>Nenhum colchão encontrado para esta combinação de filtros.</div>
        <div style="margin-top:8px;"><button class="cat-filter-btn active" id="resetCatFilters">Limpar Filtros</button></div>
      </div>
    `;
    var resetBtn = document.getElementById('resetCatFilters');
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        catFilters.size = 'Todos';
        catFilters.price = 'Todos';
        document.querySelectorAll('.cat-filter-btn').forEach(function(b) {
          b.classList.toggle('active', b.getAttribute('data-val') === 'Todos');
        });
        renderCatalogGrid();
      });
    }
    return;
  }

  grid.innerHTML = '';
  filtered.forEach(function(p) {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = renderProductCardHtml(p, true).trim();
    var card = wrapper.firstChild;
    card.querySelector('.product-cta').addEventListener('click', function(e) {
      var name = e.currentTarget.getAttribute('data-name');
      closeCatalogModal();
      onProductSelect(name);
    });
    grid.appendChild(card);
  });
}

// ---------------------------------------------------------------------------
// ATUALIZAÇÃO VISUAL DO FLUXO DO CLIENTE (7 ETAPAS)
// ---------------------------------------------------------------------------
function updateVisualFlow(stage) {
  var activeStep = 1;
  if (stage === 0) activeStep = 2;
  else if (stage === 1) activeStep = 3;
  else if (stage >= 2 && stage <= 4) activeStep = 4;
  else if (stage === 5) activeStep = 5;
  else if (stage >= 6) activeStep = 7;

  for (var i = 1; i <= 7; i++) {
    var el = document.getElementById('flowStep' + i);
    if (!el) continue;
    el.classList.remove('active', 'completed');
    if (i < activeStep) {
      el.classList.add('completed');
    } else if (i === activeStep) {
      el.classList.add('active');
    }
  }
}

// ---------------------------------------------------------------------------
// MODAL DE APRESENTAÇÃO EXECUTIVA
// ---------------------------------------------------------------------------
function openPresentationModal() {
  var m = document.getElementById('presentationModal');
  if (m) m.classList.add('active');
}

function closePresentationModal() {
  var m = document.getElementById('presentationModal');
  if (m) m.classList.remove('active');
}

// ---------------------------------------------------------------------------
// DEMONSTRAÇÃO INTERATIVA DE VENDAS (3 CENÁRIOS)
// ---------------------------------------------------------------------------
var activeScenario = 1;
var scenarioTimeouts = [];

function clearScenarioTimeouts() {
  scenarioTimeouts.forEach(function(t) { clearTimeout(t); });
  scenarioTimeouts = [];
  removeTyping();
}

function sTimeout(fn, delay) {
  var t = setTimeout(fn, delay);
  scenarioTimeouts.push(t);
  return t;
}

function resetChatArea() {
  clearScenarioTimeouts();
  var wrap = document.getElementById('messagesWrap');
  if (wrap) wrap.innerHTML = '<div class="date-divider"><span>Hoje</span></div>';
  msgCount = 0;
  var mc = document.getElementById('msgCount');
  if (mc) mc.textContent = '0';
}

function setActiveScenarioBtn(num) {
  activeScenario = num;
  for (var i = 1; i <= 3; i++) {
    var btn = document.getElementById('btnScenario' + i);
    if (btn) btn.classList.toggle('active', i === num);
  }
}

// CENÁRIO 1 — Cliente procurando um colchão
function runScenario1() {
  resetChatArea();
  setActiveScenarioBtn(1);
  profile = { size: 'Casal', position: null, firmness: null, budget: null };
  updateSizeTag('Casal');
  setStage(1);
  updateVisualFlow(1);

  showToast('Iniciando Cenário 1: Cliente procurando colchão 🛏️');

  sTimeout(function() {
    addOutgoingMsg("Olá, estou procurando um colchão de casal.");
    setStage(2);
    updateVisualFlow(2);

    showTyping();
    sTimeout(function() {
      addBotWithReplies(
        "Claro! 😊 Você prefere um colchão mais firme, intermediário ou macio?",
        ["Mais firme 🏋️", "Intermediário (Recomendado) 🌤️", "Mais macio 🌥️"],
        function(choice) {
          clearScenarioTimeouts();
          addOutgoingMsg(choice);
          profile.firmness = choice.includes('firme') ? 'Firme' : choice.includes('macio') ? 'Macio' : 'Intermediário';
          setStage(3);
          updateVisualFlow(3);

          showTyping();
          sTimeout(function() {
            addBotWithReplies(
              "Excelente escolha! O conforto " + profile.firmness.toLowerCase() + " é maravilhoso para quem busca equilíbrio.<br><br>E como você costuma dormir? De lado, de costas ou varia bastante?",
              ["De lado 🌙", "De costas 💤", "Varia bastante 😴"],
              function(pos) {
                clearScenarioTimeouts();
                addOutgoingMsg(pos);
                profile.position = pos.includes('lado') ? 'lado' : pos.includes('costas') ? 'costas' : 'varia';
                setStage(4);
                updateVisualFlow(4);

                showTyping();
                sTimeout(function() {
                  addBotBubble("Perfeito! Para quem dorme " + (pos.includes('lado') ? 'de lado' : 'assim') + ", o colchão intermediário com molas ensacadas alivia os pontos de pressão nos ombros e quadril, mantendo a coluna perfeitamente alinhada. Veja nossas melhores opções de casal:");

                  var casalProducts = catalog.filter(function(p) { return p.sizeCategory === 'Casal'; });
                  var wrap = document.getElementById('messagesWrap');
                  var row = document.createElement('div');
                  row.className = 'products-row';

                  casalProducts.forEach(function(p) {
                    var w = document.createElement('div');
                    w.innerHTML = renderProductCardHtml(p, false).trim();
                    var card = w.firstChild;
                    card.querySelector('.product-cta').addEventListener('click', function(e) {
                      onProductSelect(e.currentTarget.getAttribute('data-name'));
                    });
                    row.appendChild(card);
                  });

                  wrap.appendChild(row);
                  scrollBottom();
                  setStage(5);
                  updateVisualFlow(5);

                  sTimeout(function() {
                    addBotWithReplies(
                      "💳 Todas as opções incluem <strong>frete grátis</strong>, <strong>" + StoreConfig.noitesExperiencia + " de teste</strong> e até <strong>" + StoreConfig.parcelasMaxSemJuros + "x sem juros</strong>. O que você gostaria de fazer?",
                      ["Quero este", "Ver produtos", "Falar com vendedor"],
                      function(act) {
                        if (act === "Ver produtos") openCatalogModal('Casal');
                        else if (act === "Falar com vendedor") runScenario3();
                        else if (act === "Quero este") onProductSelect("Colchão Comfort Plus Casal");
                      }
                    );
                  }, 600);
                }, 1600);
              }
            );
          }, 1500);
        }
      );
    }, 1400);
  }, 600);
}

// CENÁRIO 2 — Cliente perguntando sobre preço
function runScenario2() {
  resetChatArea();
  setActiveScenarioBtn(2);
  profile = { size: 'Queen', position: 'lado', firmness: 'Intermediário', budget: null };
  updateSizeTag('Queen');
  setStage(4);
  updateVisualFlow(4);

  showToast('Iniciando Cenário 2: Pergunta sobre preço 💰');

  sTimeout(function() {
    addOutgoingMsg("Quanto custa esse colchão?");

    showTyping();
    sTimeout(function() {
      addBotBubble("Esse modelo está em promoção por <strong>R$ 1.999,00</strong> e pode ser parcelado em até <strong>12x de R$ 166,58 sem juros</strong> no cartão de crédito! 💳");

      showTyping();
      sTimeout(function() {
        addBotBubble(
          "E você ainda garante benefícios exclusivos:<br>" +
          "• 💰 <strong>" + StoreConfig.descontoPix + "% de desconto à vista no Pix</strong> (sai por R$ 1.899,05)<br>" +
          "• 🚚 <strong>Frete grátis</strong> para todo o Brasil<br>" +
          "• 🌙 <strong>" + StoreConfig.noitesExperiencia + " de experiência</strong> no conforto da sua casa<br>" +
          "• 🛡️ <strong>" + StoreConfig.garantia + " de garantia</strong> oficial de fábrica"
        );

        var p = catalog.find(function(x) { return x.id === 'p3'; }) || catalog[2];
        var wrap = document.getElementById('messagesWrap');
        var row = document.createElement('div');
        row.className = 'products-row';

        var w = document.createElement('div');
        w.innerHTML = renderProductCardHtml(p, false).trim();
        var card = w.firstChild;
        card.querySelector('.product-cta').addEventListener('click', function(e) {
          onProductSelect(e.currentTarget.getAttribute('data-name'));
        });
        row.appendChild(card);
        wrap.appendChild(row);
        scrollBottom();

        setStage(5);
        updateVisualFlow(5);

        sTimeout(function() {
          addBotWithReplies(
            "Gostaria de aproveitar essa condição ou deseja ver outros modelos?",
            ["Quero este", "Ver produtos", "Falar com vendedor"],
            function(c) {
              if (c === "Ver produtos") openCatalogModal();
              else if (c === "Falar com vendedor") runScenario3();
              else if (c === "Quero este") onProductSelect(p.name);
            }
          );
        }, 600);
      }, 1500);
    }, 1300);
  }, 600);
}

// CENÁRIO 3 — Cliente querendo falar com vendedor
function runScenario3() {
  resetChatArea();
  setActiveScenarioBtn(3);
  setStage(6);
  updateVisualFlow(6);

  showToast('Iniciando Cenário 3: Atendimento com vendedor 🤝');

  sTimeout(function() {
    addOutgoingMsg("Quero falar com um vendedor");

    showTyping();
    sTimeout(function() {
      addBotBubble("Com certeza! 😊 Vou conectar você com um de nossos consultores especialistas em colchões.<br><br>Para agilizar seu atendimento e direcionar o profissional certo, vou registrar seus dados:");

      // 1. Nome
      showTyping();
      sTimeout(function() {
        addBotBubble("1️⃣ <strong>Nome completo:</strong>");
        sTimeout(function() {
          addOutgoingMsg("Maria Clara Albuquerque");

          // 2. Telefone
          showTyping();
          sTimeout(function() {
            addBotBubble("2️⃣ <strong>Telefone WhatsApp para contato:</strong>");
            sTimeout(function() {
              addOutgoingMsg("+55 (11) 99876-5432");

              // 3. Produto de interesse
              showTyping();
              sTimeout(function() {
                addBotWithReplies(
                  "3️⃣ <strong>Produto de interesse:</strong>",
                  ["Colchão Queen intermediário", "Colchão Casal firme", "Colchão King luxo", "Colchão Solteiro"],
                  function(prod) {
                    clearScenarioTimeouts();
                    addOutgoingMsg(prod);

                    // 4. Melhor horário
                    showTyping();
                    sTimeout(function() {
                      addBotWithReplies(
                        "4️⃣ <strong>Melhor horário para contato:</strong>",
                        ["Manhã (9h às 12h)", "Tarde (14h às 18h)", "Noite (após 18h)", "Agora mesmo"],
                        function(horario) {
                          clearScenarioTimeouts();
                          addOutgoingMsg(horario);

                          // Confirmação final da captação de lead
                          showTyping();
                          sTimeout(function() {
                            addBotBubble(
                              "Perfeito! Seus dados foram enviados para um vendedor. Em breve entraremos em contato. ✅<br><br>" +
                              "<small style='color:var(--accent); font-weight:600;'>📲 Consultor comercial notificado via WhatsApp com ficha completa do cliente!</small>"
                            );

                            var step7 = document.getElementById('flowStep7');
                            if (step7) {
                              for (var i = 1; i <= 6; i++) {
                                var el = document.getElementById('flowStep' + i);
                                if (el) { el.classList.remove('active'); el.classList.add('completed'); }
                              }
                              step7.classList.add('active');
                            }

                            var c = conversations.find(function(x) { return x.id === 1; });
                            if (c) { c.preview = "🤖 Lead enviado para vendedor"; c.time = getTime(); renderConversations(); }

                            sTimeout(function() {
                              addBotWithReplies(
                                "Enquanto você aguarda, quer dar uma olhada no catálogo?",
                                ["Ver produtos", "Iniciar demonstração"],
                                function(act) {
                                  if (act === "Ver produtos") openCatalogModal();
                                  else runScenario1();
                                }
                              );
                            }, 500);
                          }, 1400);
                        }
                      );
                    }, 1200);
                  }
                );
              }, 1200);
            }, 900);
          }, 1100);
        }, 900);
      }, 1100);
    }, 1300);
  }, 600);
}

// ---------------------------------------------------------------------------
// EVENT LISTENERS E INICIALIZAÇÃO DA INTERFACE
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  // Inicialização das conversas na sidebar
  renderConversations();

  // Listeners dos botões dos cenários
  var btnSc1 = document.getElementById('btnScenario1');
  if (btnSc1) btnSc1.addEventListener('click', runScenario1);

  var btnSc2 = document.getElementById('btnScenario2');
  if (btnSc2) btnSc2.addEventListener('click', runScenario2);

  var btnSc3 = document.getElementById('btnScenario3');
  if (btnSc3) btnSc3.addEventListener('click', runScenario3);

  var btnInitDemo = document.getElementById('btnIniciarDemo');
  if (btnInitDemo) {
    btnInitDemo.addEventListener('click', function() {
      if (activeScenario === 1) runScenario1();
      else if (activeScenario === 2) runScenario2();
      else if (activeScenario === 3) runScenario3();
    });
  }

  var btnVerProdDirect = document.getElementById('btnVerProdutosDirect');
  if (btnVerProdDirect) {
    btnVerProdDirect.addEventListener('click', function() {
      openCatalogModal();
    });
  }

  var btnFalarVendedorDirect = document.getElementById('btnFalarVendedorDirect');
  if (btnFalarVendedorDirect) {
    btnFalarVendedorDirect.addEventListener('click', function() {
      runScenario3();
    });
  }

  // Chips de filtro da barra superior
  document.querySelectorAll('.filter-chip').forEach(function(chip) {
    chip.addEventListener('click', function() {
      document.querySelectorAll('.filter-chip').forEach(function(c) { c.classList.remove('active'); });
      chip.classList.add('active');
    });
  });

  // Filtros do modal do catálogo
  document.querySelectorAll('#sizeFilters .cat-filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('#sizeFilters .cat-filter-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      catFilters.size = btn.getAttribute('data-val');
      renderCatalogGrid();
    });
  });

  document.querySelectorAll('#priceFilters .cat-filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('#priceFilters .cat-filter-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      catFilters.price = btn.getAttribute('data-val');
      renderCatalogGrid();
    });
  });

  // Abertura e fechamento do catálogo
  var btnHeader = document.getElementById('openCatalogHeaderBtn');
  if (btnHeader) btnHeader.addEventListener('click', function() { openCatalogModal(); });

  var btnPanel = document.getElementById('openCatalogBtnPanel');
  if (btnPanel) btnPanel.addEventListener('click', function() { openCatalogModal(); });

  var btnClose = document.getElementById('closeCatalogBtn');
  if (btnClose) btnClose.addEventListener('click', closeCatalogModal);

  var modalBackdrop = document.getElementById('catalogModal');
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', function(e) {
      if (e.target === modalBackdrop) closeCatalogModal();
    });
  }

  // Modal de apresentação
  var btnPresHeader = document.getElementById('openPresentationBtn');
  if (btnPresHeader) btnPresHeader.addEventListener('click', openPresentationModal);

  var btnPresPanel = document.getElementById('openPresentationBtnPanel');
  if (btnPresPanel) btnPresPanel.addEventListener('click', openPresentationModal);

  var btnPresClose = document.getElementById('closePresBtn');
  if (btnPresClose) btnPresClose.addEventListener('click', closePresentationModal);

  var btnPresCloseCta = document.getElementById('closePresBtnCta');
  if (btnPresCloseCta) btnPresCloseCta.addEventListener('click', closePresentationModal);

  var presModal = document.getElementById('presentationModal');
  if (presModal) {
    presModal.addEventListener('click', function(e) {
      if (e.target === presModal) closePresentationModal();
    });
  }

  // Tecla Escape para fechar modais
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeCatalogModal();
      closePresentationModal();
    }
  });

  // Início automático do Cenário 1
  setTimeout(runScenario1, 1000);
});
