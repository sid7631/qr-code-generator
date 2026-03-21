'use strict';

class QRGenerator {
    constructor() {
        this.currentType = 'url';
        this.hasQR = false;

        this.el = {
            typeTabs:      document.getElementById('type-tabs'),
            inputArea:     document.getElementById('input-area'),
            generateBtn:   document.getElementById('generate-btn'),
            qrCanvas:      document.getElementById('qr-canvas'),
            qrPlaceholder: document.getElementById('qr-placeholder'),
            actionButtons: document.getElementById('action-buttons'),
            downloadBtn:   document.getElementById('download-btn'),
            copyBtn:       document.getElementById('copy-btn'),
            themeToggle:   document.getElementById('theme-toggle'),
            fgColor:       document.getElementById('fg-color'),
            bgColor:       document.getElementById('bg-color'),
            fgSwatch:      document.getElementById('fg-swatch'),
            bgSwatch:      document.getElementById('bg-swatch'),
            fgHex:         document.getElementById('fg-hex'),
            bgHex:         document.getElementById('bg-hex'),
            qrSize:        document.getElementById('qr-size'),
            errorLevel:    document.getElementById('error-level'),
            statusBadge:   document.getElementById('status-badge'),
            toastContainer:document.getElementById('toast-container'),
        };

        this.init();
    }

    init() {
        this.renderForm(this.currentType);
        this.bindEvents();
        this.syncColorUI();
        this.applySavedTheme();
    }

    // ── Events ──────────────────────────────────────────

    bindEvents() {
        // Tab switching
        this.el.typeTabs.addEventListener('click', e => {
            const tab = e.target.closest('.tab');
            if (tab) this.switchType(tab.dataset.type);
        });

        // Generate
        this.el.generateBtn.addEventListener('click', () => this.generate());

        // Enter key in single-line inputs
        this.el.inputArea.addEventListener('keydown', e => {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && !e.shiftKey) {
                e.preventDefault();
                this.generate();
            }
        });

        // Theme toggle
        this.el.themeToggle.addEventListener('click', () => this.toggleTheme());

        this.el.fgColor.addEventListener('input', () => this.syncColorUI());
        this.el.bgColor.addEventListener('input', () => this.syncColorUI());

        // Download & copy
        this.el.downloadBtn.addEventListener('click', () => this.download());
        this.el.copyBtn.addEventListener('click', () => this.copyToClipboard());
    }

    // ── Type Switching ───────────────────────────────────

    switchType(type) {
        this.currentType = type;
        this.el.typeTabs.querySelectorAll('.tab').forEach(t => {
            const active = t.dataset.type === type;
            t.classList.toggle('active', active);
            t.setAttribute('aria-selected', active);
        });
        this.renderForm(type);
    }

    renderForm(type) {
        const forms = {
            url: `
                <div class="form-group">
                    <label class="input-label" for="main-input">URL</label>
                    <div class="input-wrapper">
                        <svg class="input-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <input type="url" class="text-input has-icon" id="main-input" placeholder="https://example.com" autocomplete="url" autofocus>
                    </div>
                </div>`,

            text: `
                <div class="form-group">
                    <label class="input-label" for="main-input">Text</label>
                    <textarea class="text-input textarea" id="main-input" placeholder="Enter any text, message, or content..." rows="5" autofocus></textarea>
                </div>`,

            email: `
                <div class="form-group">
                    <label class="input-label" for="email-address">Email Address</label>
                    <div class="input-wrapper">
                        <svg class="input-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <input type="email" class="text-input has-icon" id="email-address" placeholder="hello@example.com" autocomplete="email" autofocus>
                    </div>
                </div>
                <div class="form-group">
                    <label class="input-label" for="email-subject">Subject <span class="optional">optional</span></label>
                    <input type="text" class="text-input" id="email-subject" placeholder="Email subject">
                </div>
                <div class="form-group">
                    <label class="input-label" for="email-body">Body <span class="optional">optional</span></label>
                    <textarea class="text-input textarea" id="email-body" placeholder="Email message..." rows="3"></textarea>
                </div>`,

            phone: `
                <div class="form-group">
                    <label class="input-label" for="main-input">Phone Number</label>
                    <div class="input-wrapper">
                        <svg class="input-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.49 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.4 1.11h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 5.99 5.99l1.17-1.17a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <input type="tel" class="text-input has-icon" id="main-input" placeholder="+1 (555) 000-0000" autocomplete="tel" autofocus>
                    </div>
                </div>`,

            wifi: `
                <div class="form-group">
                    <label class="input-label" for="wifi-ssid">Network Name (SSID)</label>
                    <div class="input-wrapper">
                        <svg class="input-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <input type="text" class="text-input has-icon" id="wifi-ssid" placeholder="My Network" autofocus>
                    </div>
                </div>
                <div class="form-group">
                    <label class="input-label" for="wifi-password">Password <span class="optional">optional</span></label>
                    <div class="input-wrapper">
                        <svg class="input-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <input type="password" class="text-input has-icon" id="wifi-password" placeholder="Network password">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="input-label" for="wifi-security">Security</label>
                        <select class="select-input" id="wifi-security">
                            <option value="WPA">WPA / WPA2</option>
                            <option value="WEP">WEP</option>
                            <option value="nopass">None</option>
                        </select>
                    </div>
                    <div class="form-group checkbox-group">
                        <label class="input-label">&nbsp;</label>
                        <label class="checkbox-label" for="wifi-hidden">
                            <input type="checkbox" class="checkbox-input" id="wifi-hidden">
                            <span class="checkbox-custom"></span>
                            Hidden network
                        </label>
                    </div>
                </div>`,
        };

        this.el.inputArea.innerHTML = forms[type] || forms.url;
        this.el.inputArea.querySelector('[autofocus]')?.focus();
    }

    // ── Content Builder ──────────────────────────────────

    getContent() {
        switch (this.currentType) {
            case 'url':
            case 'text':
                return document.getElementById('main-input')?.value.trim() ?? '';

            case 'email': {
                const addr = document.getElementById('email-address')?.value.trim() ?? '';
                if (!addr) return '';
                const subject = document.getElementById('email-subject')?.value.trim() ?? '';
                const body    = document.getElementById('email-body')?.value.trim() ?? '';
                let mailto = `mailto:${addr}`;
                const params = [];
                if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
                if (body)    params.push(`body=${encodeURIComponent(body)}`);
                if (params.length) mailto += `?${params.join('&')}`;
                return mailto;
            }

            case 'phone': {
                const num = document.getElementById('main-input')?.value.trim() ?? '';
                return num ? `tel:${num}` : '';
            }

            case 'wifi': {
                const ssid     = document.getElementById('wifi-ssid')?.value.trim() ?? '';
                if (!ssid) return '';
                const password = document.getElementById('wifi-password')?.value.trim() ?? '';
                const security = document.getElementById('wifi-security')?.value ?? 'WPA';
                const hidden   = document.getElementById('wifi-hidden')?.checked ? 'true' : 'false';
                return `WIFI:T:${security};S:${ssid};P:${password};H:${hidden};;`;
            }

            default:
                return '';
        }
    }

    // ── QR Generation ────────────────────────────────────

    generate() {
        const content = this.getContent();
        if (!content) {
            this.showToast('Please enter some content first', 'error');
            return;
        }

        const size         = parseInt(this.el.qrSize.value, 10);
        const fgColor      = this.el.fgColor.value;
        const bgColor      = this.el.bgColor.value;
        const errorMap     = {
            L: QRCode.CorrectLevel.L,
            M: QRCode.CorrectLevel.M,
            Q: QRCode.CorrectLevel.Q,
            H: QRCode.CorrectLevel.H,
        };
        const correctLevel = errorMap[this.el.errorLevel.value] ?? QRCode.CorrectLevel.H;

        // Clear previous
        this.el.qrCanvas.innerHTML = '';

        try {
            new QRCode(this.el.qrCanvas, {
                text: content,
                width: size,
                height: size,
                colorDark:  fgColor,
                colorLight: bgColor,
                correctLevel,
            });

            // Show result after canvas renders
            setTimeout(() => {
                this.el.qrPlaceholder.style.display = 'none';
                this.el.qrCanvas.style.display = 'flex';
                this.el.actionButtons.style.display = 'flex';
                this.el.statusBadge.textContent = 'Generated';
                this.el.statusBadge.classList.add('success');
                this.hasQR = true;
            }, 100);

        } catch {
            this.showToast('Failed to generate QR code — please try again', 'error');
        }
    }

    // ── Image Helpers ─────────────────────────────────────

    getDataURL() {
        const canvas = this.el.qrCanvas.querySelector('canvas');
        if (canvas) return canvas.toDataURL('image/png');

        const img = this.el.qrCanvas.querySelector('img');
        if (img) {
            const tmp = document.createElement('canvas');
            tmp.width  = img.naturalWidth  || img.width;
            tmp.height = img.naturalHeight || img.height;
            tmp.getContext('2d').drawImage(img, 0, 0);
            return tmp.toDataURL('image/png');
        }

        return null;
    }

    download() {
        if (!this.hasQR) return;
        const dataURL = this.getDataURL();
        if (!dataURL) { this.showToast('Could not read image data', 'error'); return; }

        const a = document.createElement('a');
        a.href = dataURL;
        a.download = `qr-studio-${Date.now()}.png`;
        a.click();
        this.showToast('QR code downloaded!', 'success');
    }

    async copyToClipboard() {
        if (!this.hasQR) return;
        const dataURL = this.getDataURL();
        if (!dataURL) { this.showToast('Could not read image data', 'error'); return; }

        try {
            const blob = await (await fetch(dataURL)).blob();
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            this.showToast('Copied to clipboard!', 'success');
        } catch {
            // Fallback: copy data URL as text
            try {
                await navigator.clipboard.writeText(dataURL);
                this.showToast('Data URL copied to clipboard', 'info');
            } catch {
                this.showToast('Clipboard access denied by browser', 'error');
            }
        }
    }

    // ── Color UI ──────────────────────────────────────────

    syncColorUI() {
        const fg = this.el.fgColor.value;
        const bg = this.el.bgColor.value;
        this.el.fgSwatch.style.backgroundColor = fg;
        this.el.bgSwatch.style.backgroundColor = bg;
        this.el.fgHex.textContent = fg;
        this.el.bgHex.textContent = bg;
    }

    // ── Theme ─────────────────────────────────────────────

    applySavedTheme() {
        const saved = localStorage.getItem('qr-theme');
        if (saved) document.documentElement.setAttribute('data-theme', saved);
    }

    toggleTheme() {
        const root    = document.documentElement;
        const current = root.getAttribute('data-theme') ?? 'dark';
        const next    = current === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('qr-theme', next);
    }

    // ── Toasts ───────────────────────────────────────────

    showToast(message, type = 'info') {
        const icons = {
            success: `<svg viewBox="0 0 24 24" fill="none"><polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            error:   `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
            info:    `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>`,
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] ?? icons.info}</span>
            <span class="toast-message">${message}</span>`;

        this.el.toastContainer.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('visible'));

        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => new QRGenerator());
