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
       CARROSSEL DE MOLDES — scroll-snap nativo + setas + dots + teclado
       ====================================================================== */
    function setupCarousel() {
        const track = document.getElementById('carousel-track');
        const prev  = document.getElementById('carousel-prev');
        const next  = document.getElementById('carousel-next');
        const dotsBox = document.getElementById('carousel-dots');
        if (!track) return;

        const slides = Array.from(track.children);
        if (!slides.length) return;

        function scrollByOne(direction) {
            const slideW = slides[0].getBoundingClientRect().width;
            const gap = parseInt(getComputedStyle(track).gap) || 0;
            track.scrollBy({ left: (slideW + gap) * direction, behavior: 'smooth' });
        }

        if (prev) prev.addEventListener('click', () => scrollByOne(-1));
        if (next) next.addEventListener('click', () => scrollByOne(1));

        // Cria dots — um por slide
        if (dotsBox) {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'carousel-dot';
                dot.setAttribute('aria-label', `Ir para imagem ${i + 1}`);
                dot.addEventListener('click', () => {
                    slides[i].scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center'
                    });
                });
                dotsBox.appendChild(dot);
            });
        }

        // Atualiza o dot ativo conforme o usuário rola/swipa
        function updateActiveDot() {
            const trackRect = track.getBoundingClientRect();
            const center = trackRect.left + trackRect.width / 2;
            let nearestIdx = 0;
            let nearestDist = Infinity;
            slides.forEach((s, i) => {
                const r = s.getBoundingClientRect();
                const slideCenter = r.left + r.width / 2;
                const dist = Math.abs(slideCenter - center);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearestIdx = i;
                }
            });
            if (dotsBox) {
                Array.from(dotsBox.children).forEach((d, i) => {
                    d.classList.toggle('is-active', i === nearestIdx);
                });
            }
        }

        let scrollTimer;
        track.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(updateActiveDot, 60);
        });
        updateActiveDot();

        // Teclado (← →) quando o track está focado
        track.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft')  { e.preventDefault(); scrollByOne(-1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); scrollByOne(1); }
        });

        // ==== AUTOPLAY (lógica baseada em timestamp — sem race conditions) ====
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const STEP_MS         = 4000;        // intervalo entre slides
        const LOOPBACK_PAUSE  = 1400;        // espera animação de volta ao início terminar
        const TOUCH_PAUSE     = 2500;        // após swipe
        const CLICK_PAUSE     = 6000;        // após clique manual em seta/dot
        const PAUSE_FOREVER   = 9 * 24 * 3600 * 1000; // hover/touch active

        let pausedUntil = 0;

        function step() {
            if (Date.now() < pausedUntil) return;
            if (document.hidden) return;

            const slideW = slides[0].getBoundingClientRect().width;
            const gap    = parseFloat(getComputedStyle(track).gap) || 0;
            const stride = slideW + gap;
            const maxScroll = track.scrollWidth - track.clientWidth;
            const atEnd  = track.scrollLeft >= maxScroll - 8;

            if (atEnd) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
                // segura o próximo step pra animação de loopback completar
                pausedUntil = Date.now() + LOOPBACK_PAUSE;
            } else {
                track.scrollBy({ left: stride, behavior: 'smooth' });
            }
        }

        function pauseFor(ms) {
            pausedUntil = Math.max(pausedUntil, Date.now() + ms);
        }

        // Único timer global — sempre rodando, decisão de pular fica no step()
        setInterval(step, STEP_MS);

        // === Pausas por interação ===
        // Hover desktop
        track.addEventListener('mouseenter', () => pauseFor(PAUSE_FOREVER));
        track.addEventListener('mouseleave', () => { pausedUntil = 0; });

        // Touch mobile
        track.addEventListener('touchstart', () => pauseFor(PAUSE_FOREVER), { passive: true });
        track.addEventListener('touchend',   () => pauseFor(TOUCH_PAUSE),   { passive: true });

        // Trackpad/wheel scroll horizontal manual
        track.addEventListener('wheel', () => pauseFor(TOUCH_PAUSE), { passive: true });

        // Cliques manuais nas setas
        if (prev) prev.addEventListener('click', () => pauseFor(CLICK_PAUSE));
        if (next) next.addEventListener('click', () => pauseFor(CLICK_PAUSE));

        // Cliques nos dots (apenas quando clica num dot, não em qualquer parte do container)
        if (dotsBox) {
            dotsBox.addEventListener('click', (e) => {
                if (e.target.classList.contains('carousel-dot')) pauseFor(CLICK_PAUSE);
            });
        }
    }
    setupCarousel();

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
