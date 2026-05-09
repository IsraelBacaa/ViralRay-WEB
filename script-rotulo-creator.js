// ===== SCRIPT CREADOR DE RÓTULOS CON IA — VIRALRAY 2.0 =====

class RotuloCreator {
    constructor() {
        this.selectedFile        = null;
        this.processedImage      = null;
        this.currentColor        = '#d4ff00';
        this.currentSecondaryColor = '#8B00FF';
        this.currentCm           = 50;          // tamaño en cm
        this.currentBrightness   = 1.0;
        this.aiAnalysis          = null;

        this.initElements();
        this.attachEventListeners();
    }

    // ── Calcular px a partir de cm (12 px / cm aprox para preview web) ──
    cmToPx(cm) { return Math.round(cm * 12); }

    initElements() {
        this.fileInput        = document.getElementById('rotuloFileInput');
        this.fileDropZone     = document.getElementById('fileDropZone');
        this.fileStatus       = document.getElementById('fileStatus');
        this.previewContent   = document.getElementById('previewContent');
        this.previewDot       = document.getElementById('previewDot');
        this.btnGenerar       = document.getElementById('btnGenerarRotulo');
        this.btnLimpiar       = document.getElementById('btnLimpiar');
        this.messageBox       = document.getElementById('messageBox');

        this.sizeSlider       = document.getElementById('sizeSlider');
        this.sizeValue        = document.getElementById('sizeValue');
        this.sizePx           = document.getElementById('sizePx');
        this.brightnessSlider = document.getElementById('brightnessSlider');
        this.brightnessValue  = document.getElementById('brightnessValue');

        this.textoPrincipalEl  = document.getElementById('textoPrincipal');
        this.textoSecundarioEl = document.getElementById('textoSecundario');
        this.contadorPrincipal = document.getElementById('contadorPrincipal');
        this.contadorSecundario= document.getElementById('contadorSecundario');

        this.infoSize         = document.getElementById('infoSize');
        this.infoBrightness   = document.getElementById('infoBrightness');
        this.infoColor        = document.getElementById('infoColor');
        this.infoStatus       = document.getElementById('infoStatus');

        this.colorOptions          = document.querySelectorAll('.color-opcion[data-color]');
        this.secondaryColorOptions = document.querySelectorAll('.color-opcion[data-secondary]');
    }

    attachEventListeners() {
        this.fileInput.addEventListener('change', e => this.handleFileSelect(e));
        this.fileDropZone.addEventListener('dragover',  e => this.handleDragOver(e));
        this.fileDropZone.addEventListener('dragleave', e => this.handleDragLeave(e));
        this.fileDropZone.addEventListener('drop',      e => this.handleDrop(e));
        this.btnGenerar.addEventListener('click',  () => this.generarRotulo());
        this.btnLimpiar.addEventListener('click',  () => this.limpiar());
        this.sizeSlider.addEventListener('input',       e => this.handleSizeChange(e));
        this.brightnessSlider.addEventListener('input', e => this.handleBrightnessChange(e));
        this.colorOptions.forEach(o => o.addEventListener('click', e => this.selectColor(e)));
        this.secondaryColorOptions.forEach(o => o.addEventListener('click', e => this.selectSecondaryColor(e)));

        // Contadores de texto
        this.textoPrincipalEl.addEventListener('input', () => {
            const len = this.textoPrincipalEl.value.length;
            this.contadorPrincipal.textContent = len + '/16';
            this.contadorPrincipal.style.color = len > 12 ? 'rgba(255,80,80,0.7)' : 'rgba(212,255,0,0.4)';
        });
        this.textoSecundarioEl.addEventListener('input', () => {
            const len = this.textoSecundarioEl.value.length;
            this.contadorSecundario.textContent = len + '/22';
            this.contadorSecundario.style.color = len > 18 ? 'rgba(200,100,255,0.8)' : 'rgba(139,0,255,0.4)';
        });
    }

    handleFileSelect(e) { const f = e.target.files[0]; if (f) this.processFile(f); }
    handleDragOver(e)  { e.preventDefault(); e.stopPropagation(); this.fileDropZone.classList.add('drag-over'); }
    handleDragLeave(e) { e.preventDefault(); e.stopPropagation(); this.fileDropZone.classList.remove('drag-over'); }

    handleDrop(e) {
        e.preventDefault(); e.stopPropagation();
        this.fileDropZone.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            this.fileInput.files = files;
            this.processFile(files[0]);
        } else this.showMessage('Por favor, sube una imagen válida', 'error');
    }

    processFile(file) {
        if (file.size > 5 * 1024 * 1024) {
            this.showMessage('El archivo es demasiado grande. Máximo 5MB', 'error');
            this.fileStatus.textContent = '❌ Archivo demasiado grande';
            return;
        }
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = e => {
            this.processedImage = e.target.result;
            this.fileStatus.innerHTML = '<span style="color:#d4ff00">✓</span> ' + file.name;
            this.btnGenerar.disabled = false;
            if (this.previewDot) this.previewDot.classList.add('activo');
            this.infoStatus.textContent = 'Listo';
            this.showMessage('Imagen cargada correctamente', 'success');
        };
        reader.onerror = () => this.showMessage('Error al leer el archivo', 'error');
        reader.readAsDataURL(file);
    }

    handleSizeChange(e) {
        this.currentCm = parseInt(e.target.value);
        this.sizeValue.textContent = this.currentCm + ' cm';
        if (this.sizePx) this.sizePx.textContent = '~' + this.cmToPx(this.currentCm) + ' px';
        // Sincronizar presets
        document.querySelectorAll('.size-preset').forEach(b => {
            b.classList.toggle('activo', parseInt(b.dataset.cm) === this.currentCm);
        });
    }

    handleBrightnessChange(e) {
        this.currentBrightness = parseFloat(e.target.value);
        const pct = Math.round(this.currentBrightness * 100);
        this.brightnessValue.textContent = pct + '%';
        this.infoBrightness.textContent  = pct + '%';
        // Sincronizar presets
        document.querySelectorAll('.brillo-preset').forEach(b => {
            b.classList.toggle('activo', Math.abs(parseFloat(b.dataset.val) - this.currentBrightness) < 0.05);
        });
    }

    selectColor(e) {
        this.colorOptions.forEach(o => o.classList.remove('activo'));
        e.currentTarget.classList.add('activo');
        this.currentColor = e.currentTarget.dataset.color;
        this.infoColor.textContent = this.currentColor.toUpperCase();
    }

    selectSecondaryColor(e) {
        this.secondaryColorOptions.forEach(o => o.classList.remove('activo'));
        e.currentTarget.classList.add('activo');
        this.currentSecondaryColor = e.currentTarget.dataset.secondary;
    }

    // ── GENERAR ──────────────────────────────────────────────────────
    async generarRotulo() {
        if (!this.processedImage) { this.showMessage('Por favor, carga una imagen primero', 'error'); return; }
        this.btnGenerar.disabled = true;
        this.infoStatus.textContent = 'Procesando...';
        this.showLoadingStep('🔍 Analizando imagen con IA...');

        // Textos del usuario (si los puso)
        const textoUsuarioPrincipal  = this.textoPrincipalEl.value.trim().toUpperCase();
        const textoUsuarioSecundario = this.textoSecundarioEl.value.trim();

        try {
            let analysis = null;
            // Solo llamar a la IA si faltan textos
            if (!textoUsuarioPrincipal || !textoUsuarioSecundario) {
                analysis = await this.analyzeImageWithAI();
            }

            // Usar texto del usuario si existe, sino el de la IA
            const textoPrincipal  = textoUsuarioPrincipal  || (analysis && analysis.texto_principal)  || 'VIRAL RAY';
            const textoSecundario = textoUsuarioSecundario || (analysis && analysis.texto_secundario) || 'LED STUDIO';

            this.showLoadingStep('✨ Construyendo el rótulo LED...');
            await new Promise(r => setTimeout(r, 500));

            await this.renderRotulo(textoPrincipal, textoSecundario);
            this.infoStatus.textContent = 'Generado ✓';
            this.showMessage('¡Rótulo LED generado!', 'success');

        } catch (err) {
            console.error(err);
            const tp = textoUsuarioPrincipal  || 'VIRAL RAY';
            const ts = textoUsuarioSecundario || 'LED STUDIO';
            await this.renderRotulo(tp, ts);
            this.infoStatus.textContent = 'Generado ✓';
            this.showMessage('Rótulo generado (sin IA)', 'success');
        } finally {
            this.btnGenerar.disabled = false;
        }
    }

    // ── CLAUDE VISION ─────────────────────────────────────────────────
    async analyzeImageWithAI() {
        const base64   = this.processedImage.split(',')[1];
        const mimeType = this.processedImage.split(';')[0].split(':')[1];
        const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 300,
                messages: [{
                    role: 'user',
                    content: [
                        { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64 } },
                        { type: 'text', text: 'Analiza esta imagen para un rótulo LED. Responde SOLO en JSON:\n{"texto_principal":"NOMBRE MAYUSCULAS max 12 chars","texto_secundario":"subtitulo max 18 chars"}' }
                    ]
                }]
            })
        });
        if (!res.ok) throw new Error('API ' + res.status);
        const data = await res.json();
        const txt  = data.content.map(i => i.text || '').join('');
        try { return JSON.parse(txt.replace(/```json|```/g, '').trim()); }
        catch { return { texto_principal: 'VIRAL RAY', texto_secundario: 'LED STUDIO' }; }
    }

    // ── RENDER RÓTULO ─────────────────────────────────────────────────
    async renderRotulo(main, sub) {
        const W  = this.cmToPx(this.currentCm);
        const H  = Math.round(W * 0.5625);
        const c1 = this.currentColor;
        const c2 = this.currentSecondaryColor;
        const br = this.currentBrightness;

        const imgCv = await this.buildImageCover(W, H, br, c1);

        const cv  = document.createElement('canvas');
        cv.width  = W; cv.height = H;
        const ctx = cv.getContext('2d');

        ctx.drawImage(imgCv, 0, 0, W, H);
        this.applyVignette(ctx, W, H);
        this.applyTextBand(ctx, W, H, c1);
        this.renderNeonText(ctx, W, H, main, sub, c1, c2);
        this.renderFrame(ctx, W, H, c1, c2);
        this.renderScrews(ctx, W, H, c1);
        this.renderScanlines(ctx, W, H);

        cv.style.maxWidth = '100%';
        cv.style.maxHeight = '100%';
        cv.style.borderRadius = '5px';
        cv.style.display = 'block';

        this.previewContent.innerHTML = '';
        this.previewContent.appendChild(cv);

        this.infoSize.textContent       = this.currentCm + ' cm (' + W + '×' + H + 'px)';
        this.infoBrightness.textContent = Math.round(br * 100) + '%';
        this.infoColor.textContent      = c1.toUpperCase();
    }

    buildImageCover(W, H, brightness, glowColor) {
        return new Promise(resolve => {
            const cv = document.createElement('canvas');
            cv.width = W; cv.height = H;
            const ctx = cv.getContext('2d');
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, W, H);
            const img = new Image();
            img.onload = () => {
                const scale = Math.max(W / img.width, H / img.height);
                const dw = img.width * scale, dh = img.height * scale;
                const dx = (W - dw) / 2, dy = (H - dh) / 2;
                // Glow difuso
                ctx.save();
                ctx.globalAlpha = 0.28;
                ctx.filter = 'blur(' + Math.round(W * 0.022) + 'px) brightness(' + (brightness * 0.7) + ') saturate(1.6)';
                ctx.drawImage(img, dx - 15, dy - 15, dw + 30, dh + 30);
                ctx.restore();
                // Imagen nítida
                ctx.save();
                ctx.filter = 'brightness(' + (brightness * 0.92) + ') contrast(1.08) saturate(1.12)';
                ctx.drawImage(img, dx, dy, dw, dh);
                ctx.restore();
                // Tinte neón
                ctx.save();
                ctx.globalCompositeOperation = 'screen';
                ctx.globalAlpha = 0.07;
                ctx.fillStyle = glowColor;
                ctx.fillRect(0, 0, W, H);
                ctx.restore();
                resolve(cv);
            };
            img.onerror = () => resolve(cv);
            img.src = this.processedImage;
        });
    }

    applyVignette(ctx, W, H) {
        const g = ctx.createRadialGradient(W/2, H/2, H * 0.18, W/2, H/2, H * 0.82);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(1, 'rgba(0,0,0,0.75)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
    }

    applyTextBand(ctx, W, H, c1) {
        const bandH = H * 0.28, y0 = H - bandH;
        const g = ctx.createLinearGradient(0, y0, 0, H);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(0.2, 'rgba(0,0,0,0.78)');
        g.addColorStop(1, 'rgba(0,0,0,0.96)');
        ctx.fillStyle = g;
        ctx.fillRect(0, y0, W, bandH);
        // Línea separadora
        const lineY = y0 + H * 0.008;
        const lg = ctx.createLinearGradient(W * 0.04, 0, W * 0.96, 0);
        lg.addColorStop(0, 'transparent'); lg.addColorStop(0.15, c1);
        lg.addColorStop(0.5, '#fff'); lg.addColorStop(0.85, c1); lg.addColorStop(1, 'transparent');
        ctx.save();
        ctx.strokeStyle = lg; ctx.lineWidth = Math.max(1.5, W * 0.003);
        ctx.shadowBlur = W * 0.014; ctx.shadowColor = c1; ctx.globalAlpha = 0.88;
        ctx.beginPath(); ctx.moveTo(W * 0.04, lineY); ctx.lineTo(W * 0.96, lineY); ctx.stroke();
        ctx.restore();
    }

    renderNeonText(ctx, W, H, main, sub, c1, c2) {
        const fs    = Math.round(W / 7.2);
        const subFs = Math.round(W / 19);
        const yMain = H * 0.825, ySub = H * 0.925;
        ctx.save();
        ctx.font = '900 ' + fs + 'px "Audiowide","Arial Black",sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        [
            { blur: fs * 1.1, alpha: 0.10, color: c2 },
            { blur: fs * 0.65, alpha: 0.18, color: c1 },
            { blur: fs * 0.30, alpha: 0.35, color: c1 },
            { blur: fs * 0.10, alpha: 0.70, color: c1 },
            { blur: fs * 0.03, alpha: 1.0,  color: '#fff' },
        ].forEach(l => {
            ctx.save();
            ctx.globalAlpha = l.alpha; ctx.shadowBlur = l.blur;
            ctx.shadowColor = l.color; ctx.fillStyle = l.color;
            ctx.fillText(main, W / 2, yMain);
            ctx.restore();
        });
        ctx.restore();
        // Subtítulo
        ctx.save();
        ctx.font = '700 ' + subFs + 'px "Audiowide","Arial Black",sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        [
            { blur: subFs * 0.9, alpha: 0.22, color: c2 },
            { blur: subFs * 0.2, alpha: 0.75, color: c2 },
        ].forEach(l => {
            ctx.save();
            ctx.globalAlpha = l.alpha; ctx.shadowBlur = l.blur;
            ctx.shadowColor = l.color; ctx.fillStyle = l.color;
            ctx.fillText(sub.toUpperCase(), W / 2, ySub);
            ctx.restore();
        });
        ctx.restore();
    }

    renderFrame(ctx, W, H, c1, c2) {
        const pad = W * 0.018, lw1 = Math.max(2.5, W * 0.005), lw2 = Math.max(1.2, W * 0.0025);
        ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = lw1 * 3.5;
        ctx.strokeRect(pad - lw1, pad - lw1, W - (pad - lw1) * 2, H - (pad - lw1) * 2); ctx.restore();
        ctx.save(); ctx.strokeStyle = c1; ctx.lineWidth = lw1; ctx.globalAlpha = 0.95;
        ctx.shadowBlur = W * 0.022; ctx.shadowColor = c1;
        ctx.strokeRect(pad, pad, W - pad * 2, H - pad * 2); ctx.restore();
        ctx.save(); ctx.strokeStyle = c2; ctx.lineWidth = lw2; ctx.globalAlpha = 0.45;
        ctx.shadowBlur = W * 0.01; ctx.shadowColor = c2;
        ctx.strokeRect(pad * 2.4, pad * 2.4, W - pad * 4.8, H - pad * 4.8); ctx.restore();
        // Esquinas
        const cs = W * 0.052, cp = pad;
        [[cp, cp], [W - cp, cp], [W - cp, H - cp], [cp, H - cp]].forEach(pt => {
            const sx = pt[0] < W / 2 ? 1 : -1, sy = pt[1] < H / 2 ? 1 : -1;
            ctx.save(); ctx.strokeStyle = c2; ctx.lineWidth = Math.max(3, W * 0.006);
            ctx.lineCap = 'square'; ctx.shadowBlur = 16; ctx.shadowColor = c2;
            ctx.beginPath();
            ctx.moveTo(pt[0], pt[1] + sy * cs); ctx.lineTo(pt[0], pt[1]); ctx.lineTo(pt[0] + sx * cs, pt[1]);
            ctx.stroke(); ctx.restore();
        });
    }

    renderScrews(ctx, W, H, c1) {
        const r = W * 0.012, p = W * 0.031;
        [[p, p], [W - p, p], [W - p, H - p], [p, H - p]].forEach(pt => {
            ctx.save();
            ctx.beginPath(); ctx.arc(pt[0], pt[1], r, 0, Math.PI * 2);
            const g = ctx.createRadialGradient(pt[0] - r * 0.3, pt[1] - r * 0.3, 0, pt[0], pt[1], r);
            g.addColorStop(0, '#3a3a3a'); g.addColorStop(1, '#0e0e0e');
            ctx.fillStyle = g; ctx.fill();
            const ri = parseInt(c1.slice(1,3),16), gi2 = parseInt(c1.slice(3,5),16), bi = parseInt(c1.slice(5,7),16);
            ctx.strokeStyle = 'rgba(' + ri + ',' + gi2 + ',' + bi + ',0.5)';
            ctx.lineWidth = Math.max(1, W * 0.002); ctx.shadowBlur = 5; ctx.shadowColor = c1; ctx.stroke();
            ctx.strokeStyle = 'rgba(200,200,200,0.2)'; ctx.lineWidth = Math.max(0.8, W * 0.0014); ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.moveTo(pt[0] - r * 0.5, pt[1] - r * 0.5); ctx.lineTo(pt[0] + r * 0.5, pt[1] + r * 0.5);
            ctx.moveTo(pt[0] + r * 0.5, pt[1] - r * 0.5); ctx.lineTo(pt[0] - r * 0.5, pt[1] + r * 0.5);
            ctx.stroke(); ctx.restore();
        });
    }

    renderScanlines(ctx, W, H) {
        const step = Math.max(3, Math.round(H / 110));
        ctx.save(); ctx.globalAlpha = 0.035; ctx.fillStyle = '#000';
        for (let y = 0; y < H; y += step * 2) ctx.fillRect(0, y, W, step);
        ctx.restore();
    }

    // ── LIMPIAR ───────────────────────────────────────────────────────
    limpiar() {
        this.fileInput.value = '';
        this.selectedFile = null;
        this.processedImage = null;
        this.aiAnalysis = null;

        this.previewContent.innerHTML = '<div class="preview-placeholder"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(212,255,0,0.3)" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><span>Sube una imagen para empezar</span></div>';
        if (this.previewDot) this.previewDot.classList.remove('activo');

        this.sizeSlider.value = 50; this.currentCm = 50;
        this.sizeValue.textContent = '50 cm';
        if (this.sizePx) this.sizePx.textContent = '~' + this.cmToPx(50) + ' px';

        this.brightnessSlider.value = 1; this.currentBrightness = 1;
        this.brightnessValue.textContent = '100%';

        this.textoPrincipalEl.value = ''; this.contadorPrincipal.textContent = '0/16';
        this.textoSecundarioEl.value = ''; this.contadorSecundario.textContent = '0/22';

        this.colorOptions.forEach(o => o.classList.remove('activo'));
        this.colorOptions[0].classList.add('activo'); this.currentColor = '#d4ff00';

        this.secondaryColorOptions.forEach(o => o.classList.remove('activo'));
        this.secondaryColorOptions[0].classList.add('activo'); this.currentSecondaryColor = '#8B00FF';

        document.querySelectorAll('.size-preset').forEach(b => b.classList.toggle('activo', b.dataset.cm === '50'));
        document.querySelectorAll('.brillo-preset').forEach(b => b.classList.toggle('activo', b.dataset.val === '1.0'));

        this.infoSize.textContent = '—'; this.infoBrightness.textContent = '—';
        this.infoColor.textContent = '—'; this.infoStatus.textContent = 'Esperando';
        this.fileStatus.textContent = '';
        this.btnGenerar.disabled = true;
        this.showMessage('Editor limpiado', 'success');
    }

    showLoadingStep(msg) {
        this.previewContent.innerHTML = '<div class="preview-loading"><div class="spinner"></div><div class="loading-text">' + msg + '</div></div>';
    }

    showMessage(text, type) {
        type = type || 'info';
        const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
        this.messageBox.innerHTML = '<div class="message-box ' + type + '"><span>' + icon + '</span><span>' + text + '</span></div>';
        this.messageBox.style.display = 'block';
        setTimeout(() => { this.messageBox.style.display = 'none'; }, 5000);
    }
}

// ── Funciones globales para botones inline ──
function seleccionarTamano(btn, cm) {
    document.querySelectorAll('.size-preset').forEach(b => b.classList.remove('activo'));
    btn.classList.add('activo');
    const slider = document.getElementById('sizeSlider');
    const sizeVal = document.getElementById('sizeValue');
    const sizePx  = document.getElementById('sizePx');
    if (slider) { slider.value = cm; }
    if (sizeVal) sizeVal.textContent = cm + ' cm';
    if (sizePx)  sizePx.textContent = '~' + Math.round(cm * 12) + ' px';
    if (window._rotuloCreator) window._rotuloCreator.currentCm = cm;
}

function seleccionarBrillo(btn, val) {
    document.querySelectorAll('.brillo-preset').forEach(b => b.classList.remove('activo'));
    btn.classList.add('activo');
    const slider = document.getElementById('brightnessSlider');
    const bVal   = document.getElementById('brightnessValue');
    const bInfo  = document.getElementById('infoBrightness');
    if (slider) slider.value = val;
    const pct = Math.round(val * 100);
    if (bVal)  bVal.textContent  = pct + '%';
    if (bInfo) bInfo.textContent = pct + '%';
    if (window._rotuloCreator) window._rotuloCreator.currentBrightness = val;
}

document.addEventListener('DOMContentLoaded', function() {
    window._rotuloCreator = new RotuloCreator();
    if (typeof initMenu === 'function') initMenu();
});
