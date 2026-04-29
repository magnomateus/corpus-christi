/* ==========================================================================
   150 MOLDES DE TAPETES PARA CORPUS CHRISTI — LANDING PAGE
   JavaScript — funcionalidades interativas
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

    /* ======================================================================
       SMOOTH SCROLL para âncoras internas
       ====================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ======================================================================
       LIMPAR # da URL ao clicar em links vazios
       ====================================================================== */
    if (window.location.hash === '#') {
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.addEventListener('hashchange', function () {
        if (window.location.hash === '#') {
            history.replaceState(null, '', window.location.pathname + window.location.search);
        }
    });

    /* ======================================================================
       FAIXA DE URGÊNCIA — data de hoje (formato "28 DE ABRIL")
       ====================================================================== */
    function setCurrentDate() {
        const el = document.getElementById('current-date');
        if (!el) return;

        const today = new Date();
        const months = [
            'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
            'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
        ];
        el.textContent = `HOJE: ${today.getDate()} DE ${months[today.getMonth()]}`;
    }
    setCurrentDate();

    /* ======================================================================
       COUNTDOWN — timers da oferta (regressivo até 23:59:59 do dia)
       Reinicia automaticamente todo dia.
       Pega TODOS os elementos .timer-display — assim quando a Parte 10
       adicionar mais um (CTA final), ele já é capturado.
       ====================================================================== */
    function startCountdown() {
        const timers = document.querySelectorAll('.timer-display');
        if (!timers.length) return;

        function update() {
            const now = new Date();
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            let distance = endOfDay - now;
            if (distance < 0) distance = 0;

            const hours   = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const formatted =
                String(hours).padStart(2, '0') + ':' +
                String(minutes).padStart(2, '0') + ':' +
                String(seconds).padStart(2, '0');

            timers.forEach(function (t) { t.textContent = formatted; });
        }

        update();
        setInterval(update, 1000);
    }
    startCountdown();

    /* ======================================================================
       FAQ ACCORDION — apenas 1 item aberto por vez
       Acessível: usa aria-expanded nos botões.
       ====================================================================== */
    function setupFAQ() {
        const questions = document.querySelectorAll('.faq-question');
        if (!questions.length) return;

        questions.forEach(function (button) {
            button.addEventListener('click', function () {
                const item = this.parentElement;
                const wasOpen = item.classList.contains('open');

                // Fecha todos
                document.querySelectorAll('.faq-item').forEach(function (it) {
                    it.classList.remove('open');
                    const q = it.querySelector('.faq-question');
                    if (q) q.setAttribute('aria-expanded', 'false');
                });

                // Abre o clicado se estava fechado
                if (!wasOpen) {
                    item.classList.add('open');
                    this.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }
    setupFAQ();

    /* ======================================================================
       POPUP DOWNSELL — acionado pelo botão #btn-basic-plan
       Fecha via X, clique fora ou tecla ESC.
       ====================================================================== */
    function setupPopup() {
        const popup    = document.getElementById('popup-offer');
        const trigger  = document.getElementById('btn-basic-plan');
        const closeBtn = document.getElementById('popup-close');
        if (!popup || !trigger) return;

        function openPopup() {
            popup.classList.add('is-open');
            popup.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
        }

        function closePopup() {
            popup.classList.remove('is-open');
            popup.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
        }

        // Abrir ao clicar em "Plano Básico"
        trigger.addEventListener('click', function (e) {
            e.preventDefault();
            openPopup();
        });

        // Fechar via botão X
        if (closeBtn) {
            closeBtn.addEventListener('click', closePopup);
        }

        // Fechar ao clicar no overlay (fora do conteúdo)
        popup.addEventListener('click', function (e) {
            if (e.target === popup) closePopup();
        });

        // Fechar via tecla ESC
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && popup.classList.contains('is-open')) {
                closePopup();
            }
        });
    }
    setupPopup();

    /* ======================================================================
       PRÓXIMAS PARTES preencherão aqui:
       Parte 11 → tracking de cliques nos CTAs (analytics)
       ====================================================================== */

    console.log(
        '%c150 Moldes de Tapetes — Corpus Christi',
        'font-size: 18px; font-weight: 800; color: #5A9BC8;'
    );
    console.log(
        '%cLanding page carregada — base v1',
        'font-size: 13px; color: #B8893A;'
    );
});
