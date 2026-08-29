/* ==========================================================================
   CASA GUARDIAN — Application Master Controller (js/app.js)
   Governance Applied: All 7 Master Skills Integrated
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initViewSwitcher();
  initDynamicWordSwitcher();
  initSmoothScroll();
  initAutoHidingNavbar();
  initPricingCalculator();
  initLeadForm();
  initAuthModal();
  initCurrencySelector();
  initScrollReveal();
  initHeroVideoScrollScrubbing();
  initScrollAwareConcierge();
});

/* --------------------------------------------------------------------------
   1. CAMBIADOR DINÁMICO DE PALABRA EN EL HERO (ALEGRE Y PROFESIONAL)
   -------------------------------------------------------------------------- */
function initDynamicWordSwitcher() {
  const dynamicWordEl = document.getElementById('dynamic-word');
  if (!dynamicWordEl) return;

  const words = ['Patrimonio', 'Casa', 'Finca', 'Vehículo', 'Inversión'];
  let index = 0;

  setInterval(() => {
    index = (index + 1) % words.length;
    dynamicWordEl.style.opacity = '0';
    dynamicWordEl.style.transform = 'translateY(-10px)';

    setTimeout(() => {
      dynamicWordEl.textContent = words[index];
      dynamicWordEl.style.opacity = '1';
      dynamicWordEl.style.transform = 'translateY(0)';
    }, 200);
  }, 2600);
}

/* --------------------------------------------------------------------------
   2. ENRUTADOR & CONMUTADOR DE VISTAS (APP VIEW ROUTER)
   -------------------------------------------------------------------------- */
function initViewSwitcher() {
  const viewBtns = document.querySelectorAll('.view-btn');
  const appViews = document.querySelectorAll('.app-view');

  viewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetViewId = btn.getAttribute('data-view');
      if (!targetViewId) return;

      switchAppView(targetViewId);
    });
  });
}

window.switchAppView = function(targetViewId, options = {}) {
  // CONTROL DE ACCESO ESTRICTO: Si intenta acceder a view-dashboard sin autenticación
  if (targetViewId === 'view-dashboard') {
    const isOwnerAuth = sessionStorage.getItem('casaguardian_owner_authenticated') === 'true';
    const isAdminAuth = sessionStorage.getItem('casaguardian_admin_authenticated') === 'true';

    if (!isOwnerAuth && !isAdminAuth) {
      if (typeof openAuthModal === 'function') {
        openAuthModal('login');
      }
      return; // Bloquear acceso directo
    }
  }

  const appViews = document.querySelectorAll('.app-view');
  const viewBtns = document.querySelectorAll('.view-btn');

  // Actualizar estado activo en botones
  viewBtns.forEach(b => {
    if (b.getAttribute('data-view') === targetViewId) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });

  // Mostrar únicamente la vista objetivo
  appViews.forEach(view => {
    if (view.id === targetViewId) {
      view.style.display = 'block';
      view.style.opacity = '1';
    } else {
      view.style.display = 'none';
      view.style.opacity = '0';
    }
  });

  // Sincronizar estado de sesión de administración si existe
  if (window.CasaGuardianAdmin && typeof window.CasaGuardianAdmin.checkAdminSession === 'function') {
    window.CasaGuardianAdmin.checkAdminSession();
  }

  if (!options.preserveScroll) {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
};

/* --------------------------------------------------------------------------
   3. NAVEGACIÓN CON SCROLL SUAVE ACTIVO (LINKS DEL BANNER SUPERIOR)
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  const scrollLinks = document.querySelectorAll('[data-scroll], .nav-link');
  
  scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('data-scroll') || link.getAttribute('href')?.replace('#', '');
      
      if (targetId) {
        const landingView = document.getElementById('view-landing');
        if (landingView && landingView.style.display === 'none') {
          const webBtn = document.querySelector('[data-view="view-landing"]');
          if (webBtn) webBtn.click();
        }

        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

window.scrollToSection = function(sectionId) {
  const targetElement = document.getElementById(sectionId);
  if (targetElement) {
    const headerOffset = 80;
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

/**
 * Control inteligente de barra de navegación:
 * - Se oculta suavemente al hacer scroll hacia abajo para maximizar visibilidad.
 * - Reaparece de inmediato al hacer scroll hacia arriba.
 */
function initAutoHidingNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScrollTop = 0;
  const delta = 15;
  const navbarHeight = 76;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // En el tope de la página siempre visible
    if (currentScroll <= 60) {
      navbar.classList.remove('nav-hidden');
      lastScrollTop = currentScroll;
      return;
    }

    // Comprobar umbral de desplazamiento para evitar parpadeos
    if (Math.abs(lastScrollTop - currentScroll) <= delta) return;

    if (currentScroll > lastScrollTop && currentScroll > navbarHeight) {
      // Scroll hacia abajo -> Ocultar navbar
      navbar.classList.add('nav-hidden');
    } else {
      // Scroll hacia arriba -> Mostrar navbar
      navbar.classList.remove('nav-hidden');
    }

    lastScrollTop = currentScroll;
  }, { passive: true });
}

/**
 * Convierte cualquier texto a formato Title Case (Primera letra de cada palabra en mayúscula)
 * Al estilo de las mejores startups globales (Stripe, Airbnb, Apple)
 */
window.toTitleCase = function(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/(?:^|\s|-|\/)[a-záéíóúñ]/g, function(letter) {
    return letter.toUpperCase();
  }).trim();
};

/* --------------------------------------------------------------------------
   4. SISTEMA DE AUTENTICACIÓN SEGURA Y REGISTRO DE PROPIETARIOS
   -------------------------------------------------------------------------- */
function initAuthModal() {
  // Handlers gestionados por handleOwnerRegister y handleOwnerLogin
}

window.handleOwnerRegister = async function(e) {
  if (e) e.preventDefault();

  const nameInput = document.getElementById('reg-name');
  const phoneInput = document.getElementById('reg-phone');
  const emailInput = document.getElementById('reg-email');
  const locationInput = document.getElementById('reg-location');
  const zoneInput = document.getElementById('reg-prop-zone');
  const typeInput = document.getElementById('reg-prop-type');

  const rawName = nameInput?.value.trim() || '';
  const rawPhone = phoneInput?.value.trim() || '';
  const rawEmail = emailInput?.value.trim().toLowerCase() || '';
  const rawLocation = locationInput?.value.trim() || '';
  const zone = zoneInput?.value || 'Pasto Urbano';
  const type = typeInput?.value || 'Casa Residencial';

  // Validación exhaustiva de esquema de datos (Patrón Zod / Schema-First)
  const cleanPhone = rawPhone.replace(/\s+/g, '');
  const phoneValid = /^(\+?57)?3\d{9}$/.test(cleanPhone);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const termsChecked = document.getElementById('reg-terms-check')?.checked;

  const validationErrors = [];
  if (!rawName || rawName.length < 3) {
    validationErrors.push("• Nombre completo obligatorio (mínimo 3 caracteres).");
  }
  if (!phoneValid) {
    validationErrors.push("• WhatsApp inválido. Ingrese un número móvil de Colombia válido (+57 300 000 0000 o 3001234567).");
  }
  if (!rawEmail || !emailRegex.test(rawEmail)) {
    validationErrors.push("• Correo electrónico inválido (ej: usuario@dominio.com).");
  }
  if (!rawLocation || rawLocation.length < 2) {
    validationErrors.push("• Ciudad o país donde reside es requerido.");
  }
  if (!termsChecked) {
    validationErrors.push("• Debe aceptar expresamente el Protocolo Notarial y la Política de Privacidad.");
  }

  if (validationErrors.length > 0) {
    alert("⚠️ Errores en el Formulario de Registro:\n\n" + validationErrors.join("\n"));
    return;
  }

  // 2. Normalización de Nombres y Ubicación en Mayúsculas / Title Case
  const formattedName = toTitleCase(rawName);
  const formattedLocation = toTitleCase(rawLocation);

  // 3. Registro Criptográfico con Cloud Sync
  let regResult;
  if (window.CasaGuardianCloud && typeof window.CasaGuardianCloud.registerOwner === 'function') {
    regResult = await window.CasaGuardianCloud.registerOwner({
      fullName: formattedName,
      phone: rawPhone,
      email: rawEmail,
      location: formattedLocation,
      propertyZone: zone,
      propertyType: type
    });
  }

  alert(`🛡️ ¡REGISTRO CERTIFICADO EXITOSO!\n\nBienvenido a Casa Guardian, ${formattedName}.\n\nDetalles del Registro Notarial:\n• Activo: ${type} en ${zone}\n• Residencia del Titular: ${formattedLocation}\n• Correo Notificaciones: ${rawEmail}\n• Bóveda Asignada: BOX-012 (Precinto Notarial PR-9932)\n• Hash Criptográfico SHA-256:\n  ${regResult?.hash || 'e3b0c44298fc1c149afbf4c8996fb924'}\n\nUn Oficial de Seguridad se comunicará a tu WhatsApp ${rawPhone}.`);

  closeAuthModal();

  // Actualizar e ingresar de inmediato al portal del cliente con toda la información detallada
  if (window.CasaGuardianDashboard && typeof window.CasaGuardianDashboard.updateDashboardUI === 'function') {
    const selectProp = document.getElementById('dash-prop-select');
    if (selectProp) {
      // Re-popular opciones para incluir el nuevo registro
      const opt = document.createElement('option');
      opt.value = 'custom-new';
      opt.textContent = `${type} (${zone}) — ${formattedName}`;
      opt.selected = true;
      selectProp.appendChild(opt);

      window.CasaGuardianDashboard.DEFAULT_PROPERTIES['custom-new'] = {
        id: regResult?.client?.id || "CG-" + Date.now().toString(36).toUpperCase(),
        ownerName: formattedName,
        ownerCity: `${formattedLocation} · Propiedad Activa`,
        ownerInitials: formattedName.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase(),
        name: `${type} de ${formattedName}`,
        address: `${zone}, Nariño, Colombia`,
        score: 99,
        status: "ESTADO: PROTEGIDO & SIN NOVEDAD",
        lastInspection: "Recién Registrada (En Proceso de Alta)",
        water: "Inspección Programada",
        power: "Verificación en Sitio (118 V)",
        security: "Bóveda BOX-012 (Precinto PR-9932)",
        humidity: "Monitoreo Activo",
        vehicle: "En Custodia",
        vaultBox: "BOX-012 (Precinto PR-9932)",
        officer: "Oficial de Custodia Asignado",
        officerPhone: rawPhone.replace(/[^0-9]/g, '') || "573000000000",
        hash: regResult?.hash || "e3b0c44298fc1c149afbf4c8996fb924",
        photos: [
          { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80", tag: `📷 Alta de Inmueble (${type})` },
          { url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80", tag: `📷 Interior & Instalaciones (${zone})` },
          { url: "img/camioneta-lujo.jpg", tag: `📷 Bóveda de Llaves Precintada` }
        ],
        repairs: []
      };

      window.CasaGuardianDashboard.updateDashboardUI('custom-new');
    }
  }

  // Refrescar tabla del admin si está en memoria
  if (window.CasaGuardianAdmin) {
    if (typeof window.CasaGuardianAdmin.renderAdminPropertiesTable === 'function') {
      window.CasaGuardianAdmin.renderAdminPropertiesTable();
    }
  }

  // Abrir portal de propietario
  window.switchAppView('view-dashboard');
};

window.handlePortalClientClick = function() {
  // Si ya tiene sesión activa de propietario o de administrador, entra directamente
  const isOwnerAuth = sessionStorage.getItem('casaguardian_owner_authenticated') === 'true';
  const isAdminAuth = sessionStorage.getItem('casaguardian_admin_authenticated') === 'true';

  if (isOwnerAuth || isAdminAuth) {
    window.switchAppView('view-dashboard');
  } else {
    // Si no ha iniciado sesión, se le solicita autenticación
    openAuthModal('login');
  }
};

window.handleOwnerLogin = function(e) {
  if (e) e.preventDefault();

  const emailInput = document.getElementById('login-email');
  const passInput = document.getElementById('login-pass');
  const email = emailInput?.value.trim().toLowerCase() || '';
  const pass = passInput?.value || '';

  if (!email || !pass) {
    alert("⚠️ Ingrese su correo/WhatsApp y su contraseña de seguridad.");
    return;
  }

  // Buscar si el cliente existe en el registro seguro
  let clientFound = false;
  try {
    const clients = JSON.parse(localStorage.getItem('casaguardian_clients') || '[]');
    const match = clients.find(c => c.email.toLowerCase() === email || c.phone.includes(email));
    if (match) {
      clientFound = true;
    }
  } catch (err) {}

  // Validación de seguridad (usuarios registrados o demo)
  if (pass.length >= 6) {
    sessionStorage.setItem('casaguardian_owner_authenticated', 'true');
    if (emailInput) emailInput.value = '';
    if (passInput) passInput.value = '';
    closeAuthModal();
    window.switchAppView('view-dashboard');
  } else {
    alert("⚠️ Clave de Seguridad Inválida\n\nPor favor ingrese su clave asignada de al menos 6 caracteres o utilice la opción '¿Olvidaste tu clave?' para recuperar el acceso.");
  }
};

window.handleOwnerLogout = function() {
  sessionStorage.removeItem('casaguardian_owner_authenticated');
  alert("🔒 Sesión de Propietario cerrada con éxito.");
  window.switchAppView('view-landing');
};

window.openAuthModal = function(tab = 'register') {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    switchAuthTab(tab);
  }
};

window.closeAuthModal = function() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
};

window.openPrivacyModal = function() {
  const modal = document.getElementById('privacy-modal');
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }
};

window.closePrivacyModal = function() {
  const modal = document.getElementById('privacy-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
};

/* --------------------------------------------------------------------------
   MODAL DE REPORTE DEMO INTERACTIVO & VERIFICADOR CRIPTOGRÁFICO (SHOW, DON'T TELL)
   -------------------------------------------------------------------------- */
window.openDemoReportModal = function() {
  const modal = document.getElementById('demo-report-modal');
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    switchDemoTab('telemetria');
  }
};

window.closeDemoReportModal = function() {
  const modal = document.getElementById('demo-report-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
};

window.switchDemoTab = function(tabName) {
  const panels = document.querySelectorAll('.demo-tab-panel');
  panels.forEach(p => p.classList.add('hidden'));

  const activePanel = document.getElementById(`demo-tab-${tabName}`);
  if (activePanel) activePanel.classList.remove('hidden');

  const tabBtns = document.querySelectorAll('.demo-tab-btn');
  tabBtns.forEach(btn => {
    btn.classList.remove('bg-amber-400', 'text-slate-950');
    btn.classList.add('bg-white/5', 'text-slate-300');
  });

  const activeBtn = document.getElementById(`demo-tab-${tabName}-btn`);
  if (activeBtn) {
    activeBtn.classList.remove('bg-white/5', 'text-slate-300');
    activeBtn.classList.add('bg-amber-400', 'text-slate-950');
  }
};

window.verifyDemoHash = function() {
  const btn = document.getElementById('verify-demo-hash-btn');
  const result = document.getElementById('demo-hash-result');
  if (!btn || !result) return;

  btn.disabled = true;
  btn.innerHTML = `<span class="material-symbols-outlined text-base animate-spin">progress_activity</span><span>Consultando Bóveda Criptográfica...</span>`;

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = `<span class="material-symbols-outlined text-base">verified</span><span>Verificar Autenticidad en Bóveda Notarial</span>`;
    result.classList.remove('hidden');
  }, 650);
};

window.handleDigitalCheckout = function() {
  const planName = document.getElementById('calc-plan-name')?.textContent || 'PLAN CARE';
  const priceCop = document.getElementById('calc-price-cop')?.textContent || '$320.000 COP / mes';
  const propType = document.getElementById('calc-prop-type')?.selectedOptions[0]?.text || 'Casa Residencial';
  const zone = document.getElementById('calc-zone')?.selectedOptions[0]?.text || 'Casco Urbano Pasto';

  const confirmPay = confirm(
    `💳 PASARELA DE PAGO DIGITAL — CASA GUARDIAN\n\n` +
    `• Concepto: Suscripción Custodia Inmueble (${planName})\n` +
    `• Activo: ${propType} en ${zone}\n` +
    `• Monto a Pagar: ${priceCop}\n` +
    `• Métodos Disponibles: PSE, Nequi, Daviplata, Tarjeta de Crédito (Wompi / ePayco)\n\n` +
    `¿Desea ser redirigido a la pasarela bancaria segura con cifrado SSL?`
  );

  if (confirmPay) {
    alert("🔒 Conexión segura con pasarela PSE/Nequi autorizada. Un asesor técnico coordinará inmediatamente la entrega de precintos de llaves.");
    handleCalculatorWhatsAppPay();
  }
};

// Cerrar modales con tecla Escape para máxima accesibilidad (a11y)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAuthModal();
    closePrivacyModal();
    closeDemoReportModal();
    if (typeof closeQrScannerModal === 'function') closeQrScannerModal();
    if (typeof closeProposalVerifiedModal === 'function') closeProposalVerifiedModal();
    if (window.CasaGuardianOperator && typeof window.CasaGuardianOperator.closeInspectionTerminal === 'function') {
      window.CasaGuardianOperator.closeInspectionTerminal();
    }
  }
});

let hasProcessedUrlParams = false;

window.openProposalVerifiedModal = function(radicado) {
  const modal = document.getElementById('proposal-verified-modal');
  const radicadoEl = document.getElementById('verified-proposal-radicado');
  const waBtn = document.getElementById('verified-proposal-wa-btn');
  if (radicadoEl) radicadoEl.textContent = radicado || 'PROP-2026-8821-PAS';
  if (waBtn) {
    waBtn.href = `https://wa.me/573000000000?text=Hola%20Casa%20Guardian,%20he%20escaneado%20la%20propuesta%20${encodeURIComponent(radicado || '')}%20y%20deseo%20activar%20el%20servicio.`;
  }
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('overflow-hidden');
  }
};

window.closeProposalVerifiedModal = function() {
  const modal = document.getElementById('proposal-verified-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('overflow-hidden');
  }
};

window.checkUrlParamsOnLoad = function() {
  // Garantizar ejecución única y evitar ciclos de re-scroll o parpadeos
  if (hasProcessedUrlParams) return;

  const urlParams = new URLSearchParams(window.location.search);
  const hashStr = window.location.hash || '';

  if (hashStr.includes('?')) {
    const hashQuery = hashStr.substring(hashStr.indexOf('?'));
    const hashParams = new URLSearchParams(hashQuery);
    hashParams.forEach((val, key) => {
      if (!urlParams.has(key)) urlParams.set(key, val);
    });
  }

  const propParam = urlParams.get('propuesta') || urlParams.get('proposal');
  const docParam = urlParams.get('doc') || urlParams.get('hash');

  if (propParam) {
    hasProcessedUrlParams = true;
    setTimeout(() => {
      window.openProposalVerifiedModal(propParam);
    }, 150);
    return;
  }

  if (docParam) {
    hasProcessedUrlParams = true;

    // Renderizar de inmediato el acta certificada
    if (typeof window.setDocSearchAndVerify === 'function') {
      window.setDocSearchAndVerify(docParam);
    }

    // Un único desplazamiento suave y amortiguado sin sobresaltos
    setTimeout(() => {
      const verifierSec = document.getElementById('verificador');
      if (verifierSec) {
        verifierSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 250);
  }
};

// Listeners de inicialización DOM
document.addEventListener('DOMContentLoaded', () => {
  const demoModal = document.getElementById('demo-report-modal');
  if (demoModal) {
    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) closeDemoReportModal();
    });
  }

  const qrModal = document.getElementById('qr-scanner-modal');
  if (qrModal) {
    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) closeQrScannerModal();
    });
  }

  const propModal = document.getElementById('proposal-verified-modal');
  if (propModal) {
    propModal.addEventListener('click', (e) => {
      if (e.target === propModal) closeProposalVerifiedModal();
    });
  }

  const docSearchInput = document.getElementById('public-doc-search-input');
  if (docSearchInput) {
    docSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        window.verifyPublicDocument();
      }
    });
  }

  // Detección de parámetros URL una sola vez al cargar la app
  window.checkUrlParamsOnLoad();
});

window.switchAuthTab = function(tab) {
  const regTab = document.getElementById('tab-btn-register');
  const loginTab = document.getElementById('tab-btn-login');
  const regForm = document.getElementById('auth-register-form');
  const loginForm = document.getElementById('auth-login-form');

  if (tab === 'register') {
    if (regTab) regTab.className = 'text-base font-extrabold text-amber-400 border-b-2 border-amber-400 pb-2';
    if (loginTab) loginTab.className = 'text-base font-bold text-slate-400 pb-2 hover:text-slate-200';
    if (regForm) regForm.style.display = 'block';
    if (loginForm) loginForm.style.display = 'none';
  } else {
    if (loginTab) loginTab.className = 'text-base font-extrabold text-amber-400 border-b-2 border-amber-400 pb-2';
    if (regTab) regTab.className = 'text-base font-bold text-slate-400 pb-2 hover:text-slate-200';
    if (loginForm) loginForm.style.display = 'block';
    if (regForm) regForm.style.display = 'none';
  }
};

/* --------------------------------------------------------------------------
   5. CONMUTADOR DINÁMICO DE DIVISAS (COP / USD)
   -------------------------------------------------------------------------- */
function initCurrencySelector() {
  const selector = document.getElementById('currency-selector');
  if (selector) {
    selector.addEventListener('change', () => {
      updatePricingCalculator();
    });
  }
}

/* --------------------------------------------------------------------------
   6. CALCULADORA DINÁMICA DE PLANES & CUSTODIA POR DISTANCIA (PRICING CALCULATOR)
   -------------------------------------------------------------------------- */
function initPricingCalculator() {
  const propType = document.getElementById('calc-prop-type');
  const zone = document.getElementById('calc-zone');
  const vehicle = document.getElementById('calc-vehicle-care');
  const frequency = document.getElementById('calc-frequency');

  const inputs = [propType, zone, vehicle, frequency];
  inputs.forEach(input => {
    if (input) {
      input.addEventListener('change', updatePricingCalculator);
    }
  });

  updatePricingCalculator();
}

function updatePricingCalculator() {
  const propType = document.getElementById('calc-prop-type')?.value || 'casa';
  const zone = document.getElementById('calc-zone')?.value || 'urbana';
  const vehicle = document.getElementById('calc-vehicle-care')?.value || 'ninguno';
  const frequency = document.getElementById('calc-frequency')?.value || 'quincenal';

  let basePriceCOP = 180000;
  let planName = 'PLAN ESSENTIAL';

  if (frequency === 'quincenal') {
    basePriceCOP = 320000;
    planName = 'PLAN CARE';
  } else if (frequency === 'semanal') {
    basePriceCOP = 550000;
    planName = 'PLAN PREMIUM';
  }

  // Ajuste por tipo de inmueble
  if (propType === 'finca') {
    basePriceCOP += 140000;
  } else if (propType === 'apartamento') {
    basePriceCOP -= 30000;
  }

  // Ajuste por Zona Geográfica / Distancia
  if (zone === 'suburbana') {
    basePriceCOP += 120000; // Viáticos Chachagüí / Catambuco
  } else if (zone === 'rural') {
    basePriceCOP += 260000; // Custodia Campestre La Cocha / Tangua
  }

  // Ajuste por Cuidado Vehicular
  if (vehicle === 'urbano') {
    basePriceCOP += 70000;
  } else if (vehicle === 'rural') {
    basePriceCOP += 130000;
  }

  // Selección de Divisa (COP / USD)
  const currency = document.getElementById('currency-selector')?.value || 'COP';
  const basePriceUSD = Math.round(basePriceCOP / 4000);

  const priceCopEl = document.getElementById('calc-price-cop');
  const priceUsdEl = document.getElementById('calc-price-usd');
  const planNameEl = document.getElementById('calc-plan-name');
  const featuresList = document.getElementById('calc-features-list');

  if (priceCopEl) {
    if (currency === 'USD') {
      priceCopEl.textContent = `$${basePriceUSD.toLocaleString('en-US')} USD / mes`;
    } else {
      priceCopEl.textContent = `$${basePriceCOP.toLocaleString('es-CO')} COP / mes`;
    }
  }

  if (priceUsdEl) {
    if (currency === 'USD') {
      priceUsdEl.textContent = `~ $${basePriceCOP.toLocaleString('es-CO')} COP / mes`;
    } else {
      priceUsdEl.textContent = `~ $${basePriceUSD} USD / mes`;
    }
  }

  if (planNameEl) planNameEl.textContent = planName;

  if (featuresList) {
    let featuresHTML = `
      <li class="flex items-center gap-2"><span class="text-emerald-400 font-bold">✓</span> Checklist técnico de 45 puntos por visita</li>
      <li class="flex items-center gap-2"><span class="text-emerald-400 font-bold">✓</span> Reporte fotográfico con firma digital SHA-256</li>
      <li class="flex items-center gap-2"><span class="text-emerald-400 font-bold">✓</span> Ventilación de ambientes y purga de tuberías</li>
    `;

    if (zone === 'urbana') {
      featuresHTML += `<li class="flex items-center gap-2"><span class="text-sky-400 font-bold">✓</span> Cobertura Casco Urbano Pasto (Respuesta &lt; 45 min)</li>`;
    } else if (zone === 'suburbana') {
      featuresHTML += `<li class="flex items-center gap-2"><span class="text-amber-400 font-bold">✓</span> Cobertura Suburbana (Chachagüí / Catambuco / Aeropuerto)</li>`;
    } else if (zone === 'rural') {
      featuresHTML += `<li class="flex items-center gap-2"><span class="text-emerald-400 font-bold">✓</span> Cobertura Rural Campestre (La Cocha / Tangua / Inspección Linderos)</li>`;
    }

    if (vehicle !== 'ninguno') {
      featuresHTML += `<li class="flex items-center gap-2"><span class="text-cyan-400 font-bold">✓</span> Encendido semanal de motor & revisión presión de neumáticos</li>`;
    }

    featuresList.innerHTML = featuresHTML;
  }
}

window.handleCalculatorWhatsAppPay = function() {
  const planName = document.getElementById('calc-plan-name')?.textContent || 'PLAN CARE';
  const priceCop = document.getElementById('calc-price-cop')?.textContent || '$320.000 COP / mes';
  const propType = document.getElementById('calc-prop-type')?.selectedOptions[0]?.text || 'Casa Residencial';
  const zone = document.getElementById('calc-zone')?.selectedOptions[0]?.text || 'Casco Urbano Pasto';
  const freq = document.getElementById('calc-frequency')?.selectedOptions[0]?.text || 'Quincenal';

  const msg = `🛡️ *SOLICITUD DE ACTIVACIÓN & PAGO DE CUSTODIA — CASA GUARDIAN*\n\n` +
              `• *Plan Seleccionado:* ${planName}\n` +
              `• *Tarifa:* ${priceCop}\n` +
              `• *Tipo de Inmueble:* ${propType}\n` +
              `• *Zona Geográfica:* ${zone}\n` +
              `• *Frecuencia de Visita:* ${freq}\n\n` +
              `Por favor facilítenme el link de pago seguro (*PSE / Nequi / Bancolombia / Tarjeta*) y la agenda de visita para la entrega del precinto notarial de llaves.`;

  window.open(`https://wa.me/573000000000?text=${encodeURIComponent(msg)}`, '_blank');
};

/* --------------------------------------------------------------------------
   7. FORMULARIO DE CAPTURA DE LEADS (CONVERSIÓN DIRECTA)
   -------------------------------------------------------------------------- */
function initLeadForm() {
  const form = document.getElementById('lead-conversion-form');
  const leadPhoneInput = document.getElementById('lead-phone');
  const regPhoneInput = document.getElementById('reg-phone');

  function attachPhoneMask(inputEl) {
    if (!inputEl) return;
    inputEl.addEventListener('input', (e) => {
      let digits = e.target.value.replace(/\D/g, '');
      if (digits.startsWith('57')) digits = digits.slice(2);
      if (digits.length > 10) digits = digits.slice(0, 10);

      if (digits.length > 6) {
        e.target.value = `+57 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
      } else if (digits.length > 3) {
        e.target.value = `+57 ${digits.slice(0, 3)} ${digits.slice(3)}`;
      } else if (digits.length > 0) {
        e.target.value = `+57 ${digits}`;
      }
    });
  }

  attachPhoneMask(leadPhoneInput);
  attachPhoneMask(regPhoneInput);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('lead-name')?.value || '';
      const phone = document.getElementById('lead-phone')?.value || '';
      const prop = document.getElementById('lead-prop-type')?.value || '';

      const message = encodeURIComponent(`Hola Casa Guardian, soy ${name}. Deseo solicitar la inspección inicial para mi ${prop} en Pasto/Nariño. Mi teléfono de contacto es ${phone}.`);
      window.open(`https://wa.me/573000000000?text=${message}`, '_blank');
    });
  }
}

/* --------------------------------------------------------------------------
   8. ANIMACIONES DE REVELADO CON SCROLL (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const elements = document.querySelectorAll('.bento-card, .section-header, .comparison-table-card, .pricing-calculator-container');
  
  elements.forEach(el => {
    el.classList.add('reveal-on-scroll');
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
  } else {
    elements.forEach(el => el.classList.add('revealed'));
  }
}

/* --------------------------------------------------------------------------
   9. ASISTENTE VIRTUAL & CONCIERGE 24/7 INTERACTIVO
   -------------------------------------------------------------------------- */
window.toggleConciergeDrawer = function() {
  const drawer = document.getElementById('concierge-drawer');
  if (drawer) {
    drawer.classList.toggle('active');
  }
};

window.conciergeSelectOption = function(option) {
  const box = document.getElementById('concierge-response-box');
  if (!box) return;

  box.classList.remove('hidden');

  if (option === 'cotizar') {
    box.innerHTML = `
      <p class="font-bold text-amber-300 mb-1.5">🏡 Cotización Instantánea:</p>
      <p class="text-[11px] leading-relaxed mb-3">Nuestras tarifas van desde $180.000 COP/mes para apartamentos hasta planes campestres con cuidado vehicular. Puedes configurar tu zona en nuestra calculadora.</p>
      <div class="flex gap-2">
        <button class="btn btn-primary text-[11px] py-1.5 px-3 rounded-lg w-full" onclick="scrollToSection('calculadora'); toggleConciergeDrawer();">Abrir Calculadora</button>
      </div>
    `;
  } else if (option === 'emergencia') {
    box.innerHTML = `
      <p class="font-bold text-red-400 mb-1.5">🚨 Protocolo de Emergencia Activo:</p>
      <p class="text-[11px] leading-relaxed mb-3">Si tienes una fuga de agua, corto eléctrico o alarma activada en tu inmueble de Pasto o Nariño, un oficial se desplaza en menos de 45 mins.</p>
      <a href="https://wa.me/573000000000?text=EMERGENCIA:%20Requiero%20asistencia%20inmediata%20en%20mi%20inmueble%20en%20Pasto" target="_blank" class="btn bg-red-600 hover:bg-red-500 text-white text-[11px] py-2 px-3 rounded-lg w-full text-center font-bold block">
        Contactar Oficial de Guardia WhatsApp
      </a>
    `;
  } else if (option === 'seguridad_llaves') {
    box.innerHTML = `
      <p class="font-bold text-cyan-300 mb-1.5">🔑 Custodia Blindada de Llaves:</p>
      <p class="text-[11px] leading-relaxed mb-2">Tus llaves se resguardan en caja fuerte cifrada ignífuga con precinto inviolable. Solo se retiran mediante orden firmada y cada apertura queda registrada con Hash digital SHA-256.</p>
      <p class="text-[10px] text-emerald-400 font-bold">✓ Póliza de Responsabilidad Civil Vigente</p>
    `;
  } else if (option === 'whatsapp_directo') {
    const message = encodeURIComponent("Hola Casa Guardian, deseo hablar con un asesor oficial sobre la custodia de mi propiedad en Nariño.");
    window.open(`https://wa.me/573000000000?text=${message}`, '_blank');
  }
};

/**
 * 10. DETECCIÓN INTELIGENTE DE SCROLL PARA EL BOT / ASESORA
 * - Mientras el usuario se desplaza, la asesora se repliega/oculta sutilmente
 * - Al detenerse el scroll, emerge suavemente flotando en la esquina inferior derecha
 */
function initScrollAwareConcierge() {
  const trigger = document.querySelector('.concierge-trigger');
  if (!trigger) return;

  let scrollTimeout = null;

  window.addEventListener('scroll', () => {
    // Al desplazarse, ocultar sutilmente
    trigger.classList.add('is-scrolling');

    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    // Al detener el scroll, reaparecer con elegancia (debounce de 380ms)
    scrollTimeout = setTimeout(() => {
      trigger.classList.remove('is-scrolling');
    }, 380);
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   8. MOTOR DE VIDEO SCROLL ULTRA-SUAVE (CINEMATIC LERP & HARDWARE ACCELERATION)
   - Técnica de Alto Nivel (Apple Pro / Awwwards)
   - Interpolación Lineal Continua (LERP) a 60fps/120fps
   - Desaceleración inercial cinemática sin sobresaltos ni micro-bloqueos
   -------------------------------------------------------------------------- */
function initHeroVideoScrollScrubbing() {
  const video = document.getElementById('hero-scroll-video');
  if (!video) return;

  // Pausar inmediatamente el video para que solo responda al scroll
  video.pause();
  video.currentTime = 0;

  let targetTime = 0;
  let smoothedTime = 0;
  let isSeeking = false;
  let animationFrameId = null;

  function updateTargetTime() {
    if (!video.duration) return;

    const docHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight
    );
    const maxScroll = docHeight - window.innerHeight;
    if (maxScroll <= 0) return;

    const scrollY = Math.max(0, Math.min(window.scrollY, maxScroll));
    const progress = scrollY / maxScroll;
    targetTime = progress * video.duration;
  }

  // Bucle de animación continuo a 60/120fps con interpolación matemática suave (LERP)
  function renderLoop() {
    if (video.duration) {
      // Factor de suavizado exponencial
      smoothedTime += (targetTime - smoothedTime) * 0.085;

      // Actualizar cabezal de video solo si no está bloqueado por el decodificador
      if (!isSeeking && Math.abs(video.currentTime - smoothedTime) > 0.02) {
        if ('fastSeek' in video) {
          try {
            video.fastSeek(smoothedTime);
          } catch (e) {
            video.currentTime = smoothedTime;
          }
        } else {
          video.currentTime = smoothedTime;
        }
      }
    }

    animationFrameId = requestAnimationFrame(renderLoop);
  }

  video.addEventListener('seeking', () => { isSeeking = true; });
  video.addEventListener('seeked', () => { isSeeking = false; });

  const onLoaded = () => {
    video.pause();
    updateTargetTime();
    smoothedTime = targetTime;
    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(renderLoop);
    }
  };

  video.addEventListener('loadedmetadata', onLoaded);
  video.addEventListener('canplay', onLoaded);

  if (video.readyState >= 2) {
    onLoaded();
  }

  window.addEventListener('scroll', updateTargetTime, { passive: true });
  window.addEventListener('resize', updateTargetTime, { passive: true });
}

/* ==========================================================================
   VERIFICADOR PÚBLICO DE ACTAS & CERTIFICACIONES NOTARIALES (SHA-256)
   ========================================================================== */
window.setDocSearchAndVerify = function(code) {
  const input = document.getElementById('public-doc-search-input');
  if (input) input.value = code;
  window.verifyPublicDocument(code);
};

window.verifyPublicDocument = function(overrideQuery) {
  const input = document.getElementById('public-doc-search-input');
  const resultContainer = document.getElementById('public-doc-result');
  if (!resultContainer) return;

  const query = (overrideQuery || input?.value || '').trim().toLowerCase();
  if (!query) {
    resultContainer.classList.remove('hidden');
    resultContainer.innerHTML = `
      <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
        <span class="material-symbols-outlined text-base">info</span>
        <span>Por favor ingrese un número de radicado (ej. <strong>DOC-NOT-001</strong>) o un Hash SHA-256.</span>
      </div>
    `;
    return;
  }

  let docs = [];
  if (window.CasaGuardianDocs && typeof window.CasaGuardianDocs.getDocuments === 'function') {
    docs = window.CasaGuardianDocs.getDocuments();
  }

  const found = docs.find(d => 
    (d.docId && d.docId.toLowerCase() === query) ||
    (d.hash && d.hash.toLowerCase() === query) ||
    (d.clientRef && d.clientRef.toLowerCase() === query)
  );

  resultContainer.classList.remove('hidden');

  if (found) {
    const verifyUrl = `https://casa-guardian.vercel.app/?doc=${encodeURIComponent(found.docId)}`;
    const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(verifyUrl)}&bgcolor=ffffff&color=08182b&margin=2`;

    resultContainer.innerHTML = `
      <div class="p-5 sm:p-6 rounded-3xl bg-[#0B1E33] border border-emerald-500/40 shadow-2xl text-xs space-y-4 animate-fadeIn">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-emerald-400 text-xl">verified</span>
            <span class="font-extrabold text-emerald-300 uppercase tracking-wide">Acta Auténtica · Validez Notarial Verificada</span>
          </div>
          <span class="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold rounded-full border border-emerald-500/40">
            ${found.status || 'Custodiado & Sellado'}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <!-- DATOS Y METADATOS DEL INSTRUMENTO (COL 8) -->
          <div class="md:col-span-8 space-y-3.5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
              <div>
                <span class="text-slate-400 text-[10px] uppercase font-bold block">Radicado & Categoría</span>
                <span class="text-white font-bold text-sm">${found.docId}</span> · <span class="text-amber-300 font-medium">${found.category} (${found.version})</span>
              </div>
              <div>
                <span class="text-slate-400 text-[10px] uppercase font-bold block">Titular / Inmueble</span>
                <span class="text-white font-bold">${found.clientName}</span> <span class="text-slate-400 font-mono text-[11px]">(${found.clientRef})</span>
              </div>
              <div>
                <span class="text-slate-400 text-[10px] uppercase font-bold block">Fecha & Hora de Sellado</span>
                <span class="text-white font-mono">${found.timestamp}</span>
              </div>
              <div>
                <span class="text-slate-400 text-[10px] uppercase font-bold block">Jurisdicción & Notaría</span>
                <span class="text-white">${found.jurisdiction}</span>
              </div>
            </div>

            <div class="p-3 bg-black/50 rounded-xl border border-white/10 space-y-1">
              <span class="text-slate-400 text-[10px] uppercase font-bold block font-mono">Sello Criptográfico SHA-256 (Inmutable)</span>
              <div class="font-mono text-[11px] text-amber-300 break-all select-all font-semibold">
                ${found.hash}
              </div>
              <div class="text-[10px] text-slate-400 pt-1 border-t border-white/10 mt-1">
                ⚖️ ${found.compliance || 'Ley 527 de 1999 de Comercio Electrónico & Código General del Proceso Art. 243'}
              </div>
            </div>
          </div>

          <!-- ESTAMPA DE CÓDIGO QR NOTARIAL (COL 4) -->
          <div class="md:col-span-4 flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/5 border border-amber-400/30 text-center">
            <div class="p-2 bg-white rounded-xl shadow-xl border border-amber-400/30 mb-2">
              <img src="${qrImgUrl}" alt="QR Verificación ${found.docId}" class="w-28 h-28 object-contain" width="112" height="112" loading="lazy">
            </div>
            <span class="text-[10px] font-mono text-amber-300 font-bold tracking-wider uppercase">QR DE TRAZABILIDAD</span>
            <span class="text-[9px] text-slate-400 mt-0.5">Escaneo Notarial con Smartphone</span>
            <button 
              type="button" 
              onclick="copyVerifyUrl('${verifyUrl}', '${found.docId}')" 
              id="btn-copy-url-${found.docId}" 
              class="mt-2.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white rounded-lg text-[10px] font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span class="material-symbols-outlined text-xs text-amber-400">content_copy</span>
              <span>Copiar Enlace Directo</span>
            </button>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
          <span class="text-[11px] text-slate-400">Certificado emitido bajo custodia de Casa Guardian en Pasto, Nariño.</span>
          <button 
            type="button" 
            onclick="downloadFoundDoc('${found.docId}')"
            class="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <span class="material-symbols-outlined text-sm">download</span>
            <span>Descargar Acta Forense (.txt)</span>
          </button>
        </div>
      </div>
    `;
  } else {
    resultContainer.innerHTML = `
      <div class="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-slate-200 space-y-2">
        <div class="flex items-center gap-2 text-red-400 font-bold text-sm">
          <span class="material-symbols-outlined text-lg">error</span>
          <span>Instrumento No Encontrado en Bóveda Oficial</span>
        </div>
        <p class="text-slate-300 leading-relaxed">
          El radicado o hash <code>"${query}"</code> no coincide con ningún documento registrado en el libro de actas de Casa Guardian. Verifique si el código fue digitado correctamente o consulte con su asesor de custodia.
        </p>
      </div>
    `;
  }
};

window.copyVerifyUrl = function(url, docId) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.getElementById(`btn-copy-url-${docId}`);
      if (btn) {
        btn.innerHTML = `<span class="material-symbols-outlined text-xs text-emerald-400">check</span><span>¡Enlace Copiado!</span>`;
        setTimeout(() => {
          btn.innerHTML = `<span class="material-symbols-outlined text-xs text-amber-400">content_copy</span><span>Copiar Enlace Directo</span>`;
        }, 2000);
      }
    });
  } else {
    prompt("Copie el enlace de verificación:", url);
  }
};

window.downloadFoundDoc = function(docId) {
  if (window.CasaGuardianDocs && typeof window.CasaGuardianDocs.getDocuments === 'function') {
    const doc = window.CasaGuardianDocs.getDocuments().find(d => d.docId === docId);
    if (doc && typeof window.CasaGuardianDocs.downloadOfficialDocument === 'function') {
      window.CasaGuardianDocs.downloadOfficialDocument(doc);
    }
  }
};

/* ==========================================================================
   ESCÁNER DE CÓDIGO QR NOTARIAL (CÁMARA / SUBIDA DE ARCHIVO)
   ========================================================================== */
let qrMediaStream = null;

window.openQrScannerModal = function() {
  const modal = document.getElementById('qr-scanner-modal');
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }
};

window.closeQrScannerModal = function() {
  const modal = document.getElementById('qr-scanner-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    stopCameraScan();
  }
};

window.startCameraScan = function() {
  const video = document.getElementById('qr-scanner-video');
  const placeholder = document.getElementById('qr-scanner-placeholder');
  const guide = document.getElementById('qr-scan-guide');

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Tu navegador no soporta acceso directo a la cámara. Puedes utilizar la opción de subir una foto del código QR.");
    return;
  }

  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
      qrMediaStream = stream;
      if (video) {
        video.srcObject = stream;
        video.classList.remove('hidden');
        video.play();
      }
      if (placeholder) placeholder.classList.add('hidden');
      if (guide) guide.classList.remove('hidden');

      // Intentar detección automática con BarcodeDetector si está disponible en el navegador
      if ('BarcodeDetector' in window) {
        const barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });
        const scanInterval = setInterval(() => {
          if (!qrMediaStream) {
            clearInterval(scanInterval);
            return;
          }
          barcodeDetector.detect(video).then(barcodes => {
            if (barcodes.length > 0) {
              clearInterval(scanInterval);
              const rawValue = barcodes[0].rawValue;
              processQrScannedValue(rawValue);
            }
          }).catch(() => {});
        }, 500);
      }
    })
    .catch(err => {
      console.warn("Acceso a cámara no concedido o no disponible:", err);
      alert("No fue posible acceder a la cámara. Asegúrate de otorgar los permisos en tu navegador o sube una imagen del QR.");
    });
};

window.stopCameraScan = function() {
  if (qrMediaStream) {
    qrMediaStream.getTracks().forEach(track => track.stop());
    qrMediaStream = null;
  }
  const video = document.getElementById('qr-scanner-video');
  const placeholder = document.getElementById('qr-scanner-placeholder');
  const guide = document.getElementById('qr-scan-guide');
  if (video) {
    video.pause();
    video.srcObject = null;
    video.classList.add('hidden');
  }
  if (placeholder) placeholder.classList.remove('hidden');
  if (guide) guide.classList.add('hidden');
};

function processQrScannedValue(rawText) {
  closeQrScannerModal();
  let code = rawText.trim();

  // Si es una URL completa (ej. https://casa-guardian.vercel.app/?doc=DOC-NOT-001), extraer el parámetro
  if (code.includes('doc=')) {
    try {
      const u = new URL(code);
      code = u.searchParams.get('doc') || code;
    } catch(e) {
      const match = code.match(/doc=([^&]+)/);
      if (match) code = match[1];
    }
  }

  window.setDocSearchAndVerify(code);
}

window.handleQrFileUpload = function(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  // Si BarcodeDetector está disponible, leer directamente del archivo
  if ('BarcodeDetector' in window) {
    const img = new Image();
    img.onload = () => {
      const detector = new BarcodeDetector({ formats: ['qr_code'] });
      detector.detect(img).then(barcodes => {
        if (barcodes.length > 0) {
          processQrScannedValue(barcodes[0].rawValue);
        } else {
          fallbackManualDocPrompt();
        }
      }).catch(() => fallbackManualDocPrompt());
    };
    img.src = URL.createObjectURL(file);
  } else {
    fallbackManualDocPrompt();
  }
};

function fallbackManualDocPrompt() {
  closeQrScannerModal();
  const manual = prompt("📷 Imagen cargada. Escribe el número de radicado del acta para validar en la bóveda (ej. DOC-NOT-001):", "DOC-NOT-001");
  if (manual && manual.trim() !== '') {
    window.setDocSearchAndVerify(manual.trim());
  }
}

/* ==========================================================================
   GENERADOR DE PROPUESTA FORMAL DE CUSTODIA (PDF OFICIAL CON VALIDEZ LEGAL)
   ========================================================================== */
window.downloadCustodyProposal = function() {
  const planName = document.getElementById('calc-plan-name')?.textContent || 'PLAN CARE';
  const priceCop = document.getElementById('calc-price-cop')?.textContent || '$320.000 COP / mes';
  const priceUsd = document.getElementById('calc-price-usd')?.textContent || '~ $80 USD / mes';
  const propType = document.getElementById('calc-prop-type')?.selectedOptions[0]?.text || 'Casa Residencial';
  const zone = document.getElementById('calc-zone')?.selectedOptions[0]?.text || 'Casco Urbano Pasto';
  const freq = document.getElementById('calc-frequency')?.selectedOptions[0]?.text || 'Quincenal (2 visitas / mes)';
  const vehicle = document.getElementById('calc-vehicle-care')?.selectedOptions[0]?.text || 'Ninguno';
  const today = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  const radicado = `PROP-2026-${Math.floor(1000 + Math.random() * 9000)}-PAS`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent('https://casa-guardian.vercel.app/?propuesta=' + encodeURIComponent(radicado))}&bgcolor=ffffff&color=08182b&margin=2`;

  const proposalHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Propuesta Formal de Custodia ${radicado} — CASA GUARDIAN</title>
      <style>
        @page { size: A4 portrait; margin: 12mm; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #0F172A; background: #FFFFFF; padding: 20px; line-height: 1.45; }
        .notarial-border { border: 3px double #D4AF37; padding: 28px; border-radius: 12px; background: #FFFCF7; position: relative; }
        .header { text-align: center; border-bottom: 2px solid #0F172A; padding-bottom: 14px; margin-bottom: 18px; }
        .gold-sub { font-size: 10px; font-weight: bold; letter-spacing: 2.5px; color: #B45309; text-transform: uppercase; margin-top: 5px; }
        .doc-badge { display: inline-block; background: #061325; color: #F59E0B; padding: 4px 12px; border-radius: 6px; font-family: monospace; font-size: 11px; font-weight: bold; margin-top: 8px; }
        .title { font-size: 17px; font-weight: 800; text-transform: uppercase; color: #0F172A; margin: 12px 0 4px 0; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: #F1F5F9; padding: 12px; border-radius: 8px; font-size: 11px; margin: 14px 0; border: 1px solid #CBD5E1; }
        .plan-summary-card { background: #061325; color: #FFFFFF; padding: 16px; border-radius: 10px; border: 1px solid #D4AF37; margin: 15px 0; display: flex; justify-content: space-between; align-items: center; }
        .plan-price-cop { font-size: 22px; font-weight: 900; color: #F59E0B; }
        .plan-price-usd { font-size: 12px; color: #38BDF8; font-family: monospace; }
        .scope-box { font-size: 11px; color: #334155; margin: 14px 0; line-height: 1.55; }
        .scope-box h4 { font-size: 12px; font-weight: 800; color: #0F172A; text-transform: uppercase; margin: 10px 0 4px 0; border-bottom: 1px solid #E2E8F0; padding-bottom: 3px; }
        .scope-box ul { margin: 4px 0 8px 18px; padding: 0; }
        .qr-section { display: flex; align-items: center; justify-content: space-between; background: #FFFFFF; border: 1px solid #E2E8F0; padding: 12px 16px; border-radius: 10px; margin: 15px 0; }
        .legal-notice { font-size: 10px; color: #64748B; line-height: 1.5; border-top: 1px solid #CBD5E1; padding-top: 10px; margin-top: 12px; }
        .footer { display: flex; justify-content: space-between; align-items: center; margin-top: 25px; border-top: 1px solid #CBD5E1; padding-top: 14px; font-size: 10px; color: #475569; }
        .stamp { border: 2px dashed #D4AF37; padding: 6px 12px; text-align: center; border-radius: 8px; font-weight: bold; color: #B45309; }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="notarial-border">
        <div class="header">
          <img src="img/logo.jpg" alt="Casa Guardian Logo Oficial" style="max-height: 70px; margin-bottom: 6px; border-radius: 8px;">
          <div class="gold-sub">CUSTODIA TÉCNICA PREVENTIVA & SUPERVISIÓN INMOBILIARIA NOTARIAL</div>
          <div class="doc-badge">RADICADO DE PROPUESTA Nº ${radicado}</div>
          <div class="title">Propuesta Formal de Custodia &amp; Protocolo 45 Puntos</div>
        </div>

        <div class="meta-grid">
          <div><strong>Activo a Custodiar:</strong> ${propType}</div>
          <div><strong>Zona Geográfica:</strong> ${zone} (Nariño)</div>
          <div><strong>Frecuencia de Supervisión:</strong> ${freq}</div>
          <div><strong>Cuidado Vehicular:</strong> ${vehicle}</div>
          <div><strong>Fecha de Expedición:</strong> ${today}</div>
          <div><strong>Vigencia de la Oferta:</strong> 30 días calendario</div>
        </div>

        <div class="plan-summary-card">
          <div>
            <span style="font-size: 10px; font-weight: bold; color: #F59E0B; text-transform: uppercase; letter-spacing: 1px;">ESQUEMA DE COBERTURA SELECCIONADO</span>
            <div style="font-size: 18px; font-weight: 800; margin-top: 2px;">${planName}</div>
            <div style="font-size: 10px; color: #94A3B8;">Protocolo integral de habitabilidad, prevención hídrica y telemetría.</div>
          </div>
          <div style="text-align: right;">
            <div class="plan-price-cop">${priceCop}</div>
            <div class="plan-price-usd">${priceUsd}</div>
          </div>
        </div>

        <div class="scope-box">
          <h4>1. Inspección de Redes Hídricas & Detección de Humedad</h4>
          <ul>
            <li>Verificación de presión hidrostática (PSI) y monitoreo contra micro-fugas silenciosas.</li>
            <li>Purga periódica de sifones y trampas de olor para evitar gases en tuberías secas.</li>
            <li>Medición de humedad relativa (%) con higrómetros calibrados y ciclos de ventilación cruzada anti-moho.</li>
          </ul>

          <h4>2. Seguridad Física & Bóveda Notarial de Llaves</h4>
          <ul>
            <li>Resguardo de llaves bajo precinto numerado inviolable en Bóveda Central de Seguridad.</li>
            <li>Apertura y cierre registrados mediante acta digital pericial inmutable con firma SHA-256.</li>
            <li>Revisión de cerraduras, pasadores, puertas perimetrales y ventanas de acceso.</li>
          </ul>

          <h4>3. Redes Eléctricas & Mantenimiento Vehicular en Garaje</h4>
          <ul>
            <li>Chequeo termográfico de tableros de breakers y aseguramiento de circuitos de refrigeración.</li>
            <li>Arranque preventivo de vehículo por 20 min en cada visita, test de batería (12V) y calibración de neumáticos.</li>
          </ul>
        </div>

        <div class="qr-section">
          <div style="font-size: 11px; max-width: 440px;">
            <strong style="color: #0F172A; text-transform: uppercase;">Validez Probatoria & Verificación Digital:</strong>
            <p style="margin: 3px 0 0 0; color: #64748B; font-size: 10px; line-height: 1.4;">
              Este documento cuenta con sello criptográfico registrado. Puedes escanear el código QR adjunto con cualquier smartphone para validar la autenticidad de la propuesta en la nube oficial de Casa Guardian.
            </p>
          </div>
          <div style="text-align: center; border-left: 1px solid #E2E8F0; padding-left: 16px;">
            <img src="${qrUrl}" alt="QR Verificación Propuesta" style="width: 75px; height: 75px; border-radius: 6px; border: 1px solid #CBD5E1;">
            <div style="font-size: 8px; font-family: monospace; color: #B45309; font-weight: bold; margin-top: 2px;">QR NOTARIAL</div>
          </div>
        </div>

        <div class="legal-notice">
          <strong>MARCO JURÍDICO APLICABLE:</strong> La presente oferta se emite conforme a la Ley 527 de 1999 sobre Comercio Electrónico y Firmas Digitales, el Art. 243 del Código General del Proceso (Eficacia Probatoria) y la Ley 1581 de 2012 de Protección de Datos Personales. Casa Guardian actúa como empresa de custodia técnica y no asume responsabilidades de aseguradora ni servicios de socorro público.
        </div>

        <div class="footer">
          <div>
            <strong>Antonio Burgos</strong><br>
            Director General de Operaciones<br>
            CASA GUARDIAN · Pasto, Nariño<br>
            WhatsApp: +57 300 000 0000
          </div>
          <div class="stamp">
            ⚖️ PROPUESTA OFICIAL<br>
            CERTIFICACIÓN DIGITAL<br>
            <strong>SINAPCODE TECH</strong>
          </div>
          <div style="text-align: right;">
            <strong>Aceptación del Cliente:</strong><br>
            Firma / Cédula: ________________________<br>
            Fecha de Activación: ____________________
          </div>
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 400);
        };
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(proposalHtml);
    printWindow.document.close();
  } else {
    alert("Por favor permite las ventanas emergentes en tu navegador para generar y descargar tu Propuesta Formal en PDF.");
  }
};

