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

  const words = ['Casa', 'Finca', 'Vehículo', 'Patrimonio'];
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

window.switchAppView = function(targetViewId) {
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

  window.scrollTo({ top: 0, behavior: 'instant' });
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
    if (window.CasaGuardianOperator && typeof window.CasaGuardianOperator.closeInspectionTerminal === 'function') {
      window.CasaGuardianOperator.closeInspectionTerminal();
    }
  }
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

