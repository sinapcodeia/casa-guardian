/* ==========================================================================
   CASA GUARDIAN — Customer Dashboard Controller (/dashboard)
   - 100% Dynamic & Reactive (Nothing hardcoded)
   - Multi-Tab Navigation:
     1. Telemetría de Propiedad
     2. Galería de Inspecciones
     3. Bodega & Bóveda Documental (Contratos, Actas, Revisiones por Fecha/Hora)
     4. Certificados SHA-256
     5. Aprobación de Reparaciones & Mantenimiento
   - Live Selector for Multi-property Owners
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardProps();
  initDashboardTabs();
});

const DEFAULT_PROPERTIES = {
  "casa-pasto": {
    id: "CG-7749-PAS",
    ownerName: "Carlos Gómez",
    ownerCity: "Bogotá D.C. · 2 Propiedades",
    ownerInitials: "CG",
    name: "Villa Serena — Casa Pasto",
    address: "Conjunto Residencial Morasurco, Pasto, Nariño",
    score: 98,
    status: "ESTADO: PROTEGIDO & SIN NOVEDAD",
    lastInspection: "Hoy, 10:30 AM",
    water: "Sin Fugas (OK)",
    power: "Breakers Normal (118 V)",
    security: "Intactas (Precinto OK)",
    humidity: "21% Saludable",
    vehicle: "Batería 12.6 V (Calentado 20 mins)",
    vaultBox: "BOX-001 (Precinto PR-8821)",
    officer: "Sargento (R) Jairo Muñoz",
    officerPhone: "573000000000",
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    photos: [
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80", tag: "📷 Fachada & Ventanas [GPS: 1.2136, -77.2811]" },
      { url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80", tag: "📷 Sala Principal & Techos [Humedad 21%]" },
      { url: "img/camioneta-lujo.jpg", tag: "📷 Garaje [Camioneta SUV Calentada & Presión OK]" }
    ],
    documents: [
      { id: "DOC-NOT-001", type: "Contrato Notarial", title: "Contrato Notarial de Custodia de Llaves & Acceso a Inmueble", date: "2026-08-10 15:30:00 UTC-5", hash: "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069", tag: "Notaría 2da Pasto", mode: "Firma Digital" },
      { id: "DOC-ACT-002", type: "Acta de Entrega", title: "Acta de Entrega de Llaves y Sellado de Precinto Bóveda BOX-001", date: "2026-08-10 16:45:00 UTC-5", hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", tag: "Precinto PR-8821 OK", mode: "Firma Notarial Presencial" },
      { id: "DOC-REV-003", type: "Revisión Técnica", title: "Informe Técnico Semanal de Redes Hídricas, Eléctricas & Vehículo", date: "2026-08-24 10:30:00 UTC-5", hash: "9a2f12b67c3391d8e09f8721c456a9081e6b34fa88921b778c1044958821b001", tag: "Sin Novedades", mode: "Telemetría Digital" }
    ],
    repairs: [
      { id: "REP-101", title: "Mantenimiento Preventivo de Bomba Hídrica", cost: "$120.000 COP", status: "Pendiente Aprobación", desc: "Lubricación de sellos mecánicos y purga de aire." },
      { id: "REP-098", title: "Pintura & Sellado de Aleros Exteriores", cost: "$250.000 COP", status: "Aprobado por Propietario", desc: "Tratamiento impermeabilizante hidrófugo." }
    ]
  },
  "finca-narino": {
    id: "CG-6821-CHA",
    ownerName: "Dra. Martha Rosero",
    ownerCity: "Miami, Florida, EE.UU.",
    ownerInitials: "MR",
    name: "Finca El Encanto — Chachagüí",
    address: "Km 12 Vía al Aeropuerto, Nariño, Colombia",
    score: 94,
    status: "ESTADO: REVISIÓN SUGERIDA",
    lastInspection: "Ayer, 03:15 PM",
    water: "💧 Mantenimiento a Bomba",
    power: "Normal (118 V)",
    security: "🔐 Cerramiento Perimetral OK",
    humidity: "35% Zona Templada",
    vehicle: "Camioneta 4x4 Lista",
    vaultBox: "BOX-004 (Precinto PR-9014)",
    officer: "Oficial Andrés Bolaños",
    officerPhone: "573100000000",
    hash: "8f4a12b67c3391d8e09f8721c456a9081e6b34fa88921b778c1044958821a990",
    photos: [
      { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80", tag: "🌿 Terrenos & Jardines [Cercos OK]" },
      { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80", tag: "🏡 Casa Principal [Puertas Aseguradas]" },
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80", tag: "🚗 Zona de Parqueo [Vehículo Cubierto]" }
    ],
    documents: [
      { id: "DOC-NOT-004", type: "Contrato Notarial", title: "Contrato Notarial de Custodia Finca Campestre", date: "2026-08-04 20:15:00 UTC-5", hash: "8f4a12b67c3391d8e09f8721c456a9081e6b34fa88921b778c1044958821a990", tag: "Notaría 1ra Pasto", mode: "Firma Digital" },
      { id: "DOC-ACT-005", type: "Acta de Entrega", title: "Acta Notarial de Custodia de Llaves & Precinto Bóveda BOX-004", date: "2026-08-05 11:00:00 UTC-5", hash: "4d77c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852c444", tag: "Precinto PR-9014 OK", mode: "Firma Presencial" }
    ],
    repairs: [
      { id: "REP-204", title: "Limpieza de Canaletas y Drenaje", cost: "$85.000 COP", status: "Aprobado por Propietario", desc: "Despeje de hojas previniendo estancamientos." }
    ]
  },
  "cabana-cocha": {
    id: "CG-5510-COC",
    ownerName: "Arq. Felipe Narváez",
    ownerCity: "Madrid, España",
    ownerInitials: "FN",
    name: "Cabaña Los Pinos — La Cocha",
    address: "Vereda El Encano, Laguna de La Cocha, Nariño",
    score: 96,
    status: "ESTADO: PROTEGIDO & SIN NOVEDAD",
    lastInspection: "22 Ago, 11:00 AM",
    water: "Presión 40 PSI Normal",
    power: "Planta Eléctrica OK",
    security: "🔐 Cerraduras Blindadas OK",
    humidity: "24% Deshumidificador Activo",
    vehicle: "Cuatrimoto en Garaje",
    vaultBox: "BOX-008 (Precinto PR-6542)",
    officer: "Oficial Javier Benavides",
    officerPhone: "573200000000",
    hash: "3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1",
    photos: [
      { url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80", tag: "🌲 Vista Panorámica al Lago" },
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80", tag: "🔥 Chimenea & Aislamiento Térmico" },
      { url: "img/camioneta-lujo.jpg", tag: "🚙 Garaje y Bote Resguardado" }
    ],
    documents: [
      { id: "DOC-NOT-006", type: "Contrato Notarial", title: "Contrato Notarial de Custodia Inmueble Lacustre", date: "2026-08-22 16:00:00 UTC-5", hash: "3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1", tag: "Notaría 3ra Pasto", mode: "Firma Digital" }
    ],
    repairs: [
      { id: "REP-301", title: "Recarga de Filtro Deshumidificador", cost: "$95.000 COP", status: "Pendiente Aprobación", desc: "Sustitución de sales para mantener humedad bajo 25%." }
    ]
  }
};

let currentActivePropKey = "casa-pasto";

function initDashboardProps() {
  const selectProp = document.getElementById('dash-prop-select');
  if (!selectProp) return;

  populateDynamicPropertyOptions(selectProp);

  selectProp.addEventListener('change', (e) => {
    currentActivePropKey = e.target.value;
    updateDashboardUI(currentActivePropKey);
  });

  updateDashboardUI(selectProp.value || 'casa-pasto');
}

function populateDynamicPropertyOptions(selectElement) {
  try {
    const clients = JSON.parse(localStorage.getItem('casaguardian_clients') || '[]');
    clients.forEach((c, idx) => {
      const key = 'custom-' + idx;
      if (!DEFAULT_PROPERTIES[key]) {
        DEFAULT_PROPERTIES[key] = {
          id: c.id,
          ownerName: c.fullName,
          ownerCity: `${c.residenceLocation} · Propiedad Activa`,
          ownerInitials: c.fullName.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase(),
          name: `${c.propertyType} de ${c.fullName}`,
          address: `${c.propertyZone}, Nariño, Colombia`,
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
          officerPhone: c.phone.replace(/[^0-9]/g, '') || "573000000000",
          hash: c.digitalCertificateHash,
          photos: [
            { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80", tag: `📷 Alta de Inmueble (${c.propertyType})` },
            { url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80", tag: `📷 Interior & Instalaciones (${c.propertyZone})` },
            { url: "img/camioneta-lujo.jpg", tag: `📷 Bóveda de Llaves Precintada` }
          ],
          documents: [
            { id: "DOC-NEW-" + idx, type: "Contrato Notarial", title: `Contrato de Custodia — ${c.fullName}`, date: `${c.registeredAt.replace('T', ' ').substring(0,19)} UTC-5`, hash: c.digitalCertificateHash, tag: "Alta en Línea", mode: "Firma Digital Certificada" }
          ],
          repairs: []
        };

        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = `${c.propertyType} (${c.propertyZone}) — ${c.fullName}`;
        selectElement.appendChild(opt);
      }
    });
  } catch (e) {}
}

function updateDashboardUI(propKey) {
  currentActivePropKey = propKey;
  const data = DEFAULT_PROPERTIES[propKey] || DEFAULT_PROPERTIES["casa-pasto"];
  if (!data) return;

  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  // Header & Owner details
  setTxt('dash-owner-name', data.ownerName);
  setTxt('dash-owner-city', data.ownerCity);
  setTxt('dash-owner-initials', data.ownerInitials);
  setTxt('dash-prop-id', `ID: ${data.id}`);
  setTxt('dash-prop-status', data.status);
  setTxt('dash-prop-name', data.name);
  setTxt('dash-prop-address', data.address);
  setTxt('dash-prop-score', data.score);
  setTxt('dash-prop-last-date', data.lastInspection);
  setTxt('dash-water-val', data.water);
  setTxt('dash-power-val', data.power);
  setTxt('dash-security-val', data.security);
  setTxt('dash-officer-name', data.officer);
  setTxt('dash-prop-hash', `Hash: ${data.hash.substring(0, 32)}...`);

  // WhatsApp link update
  const waLink = document.getElementById('dash-officer-wa');
  if (waLink) {
    waLink.href = `https://wa.me/${data.officerPhone}?text=Hola%20${encodeURIComponent(data.officer)},%20soy%20${encodeURIComponent(data.ownerName)}%20de%20${encodeURIComponent(data.name)}`;
  }

  // Update Photos Gallery Section
  renderPhotosSection(data.photos);

  // Update BODEGA Section (Documentos y Bóveda de Llaves)
  renderBodegaSection(data);

  // Update Repairs Section
  renderRepairsSection(data.repairs);

  // Update Certificate Info
  setTxt('cert-hash-val', data.hash);
  setTxt('cert-vault-box', data.vaultBox);
}

function renderPhotosSection(photos) {
  const container = document.getElementById('dash-photos-container');
  const fullContainer = document.getElementById('dash-photos-container-full');
  
  const html = photos.map(p => `
    <div class="relative rounded-2xl overflow-hidden group h-52 border border-slate-700 shadow-lg">
      <img class="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" src="${p.url}" alt="${p.tag}" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-3.5">
        <span class="text-[11px] font-mono text-white font-bold">${p.tag}</span>
      </div>
    </div>
  `).join('');

  if (container) container.innerHTML = html;
  if (fullContainer) fullContainer.innerHTML = html;
}

/**
 * RENDERIZA LA SECCIÓN 'BODEGA': BÓVEDA FÍSICA + LÍNEA DE TIEMPO DOCUMENTAL
 */
function renderBodegaSection(data) {
  const container = document.getElementById('dash-bodega-timeline-container');
  const vaultBoxEl = document.getElementById('dash-bodega-vault-box');
  const clientRefEl = document.getElementById('dash-bodega-client-ref');

  if (vaultBoxEl) vaultBoxEl.textContent = data.vaultBox;
  if (clientRefEl) clientRefEl.textContent = data.id;

  if (!container) return;

  const docs = data.documents || [];
  if (docs.length === 0) {
    container.innerHTML = `
      <div class="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 text-center text-slate-400 text-xs">
        📦 No hay documentos adicionales registrados en la bodega.
      </div>
    `;
    return;
  }

  container.innerHTML = docs.map(d => `
    <div class="p-4 bg-slate-900/80 rounded-2xl border border-slate-700/70 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 hover:border-amber-400/50 transition-all">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
          <span class="material-symbols-outlined text-lg">${d.type.includes('Contrato') ? 'description' : (d.type.includes('Acta') ? 'key' : 'fact_check')}</span>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 bg-cyan-950 text-cyan-300 font-mono text-[10px] font-bold rounded border border-cyan-800">${d.id}</span>
            <span class="text-xs font-extrabold text-white">${d.title}</span>
          </div>
          <div class="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
            <span class="text-amber-300 font-medium">📅 ${d.date}</span>
            <span>•</span>
            <span class="text-emerald-400 font-medium">${d.mode}</span>
            <span>•</span>
            <span class="text-slate-300">${d.tag}</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0 self-end md:self-center">
        <button onclick="downloadClientBodegaDoc('${d.id}', '${encodeURIComponent(d.title)}', '${d.date}', '${data.name}', '${d.hash}')" class="px-3 py-1.5 bg-cyan-600/30 hover:bg-cyan-600/60 border border-cyan-500/40 text-cyan-200 rounded-lg text-xs font-bold flex items-center gap-1">
          <span class="material-symbols-outlined text-xs">download</span>
          <span>Descargar</span>
        </button>
      </div>
    </div>
  `).join('');
}

window.downloadClientBodegaDoc = function(docId, encodedTitle, date, propName, hash) {
  const title = decodeURIComponent(encodedTitle);
  
  const reportHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>${title} — CASA GUARDIAN</title>
      <style>
        @page { size: A4 portrait; margin: 12mm; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #0F172A; background: #FFFFFF; padding: 20px; line-height: 1.4; }
        .notarial-border { border: 3px double #D4AF37; padding: 30px; border-radius: 12px; background: #FFFCF7; position: relative; }
        .header { text-align: center; border-bottom: 2px solid #0F172A; padding-bottom: 15px; margin-bottom: 20px; }
        .logo-text { font-size: 24px; font-weight: 900; letter-spacing: 2px; color: #061325; margin: 0; }
        .gold-sub { font-size: 10px; font-weight: bold; letter-spacing: 3px; color: #B45309; text-transform: uppercase; margin-top: 4px; }
        .doc-badge { display: inline-block; background: #061325; color: #F59E0B; padding: 4px 12px; border-radius: 6px; font-family: monospace; font-size: 11px; font-weight: bold; margin-top: 10px; }
        .title { font-size: 16px; font-weight: 800; text-transform: uppercase; color: #0F172A; margin: 15px 0 5px 0; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #F1F5F9; padding: 12px; border-radius: 8px; font-size: 11px; margin: 15px 0; border: 1px solid #CBD5E1; }
        .content-box { font-size: 12px; color: #334155; margin: 15px 0; line-height: 1.6; text-align: justify; }
        .hash-box { background: #061325; color: #38BDF8; font-family: monospace; font-size: 9px; padding: 10px; border-radius: 6px; word-break: break-all; margin: 15px 0; border: 1px solid #0284C7; }
        .footer { display: flex; justify-content: space-between; align-items: center; margin-top: 35px; border-top: 1px solid #CBD5E1; padding-top: 15px; font-size: 10px; color: #475569; }
        .stamp { border: 2px dashed #D4AF37; padding: 8px 12px; text-align: center; border-radius: 8px; font-weight: bold; color: #B45309; }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="notarial-border">
        <div class="header">
          <img src="img/logo.jpg" alt="Casa Guardian Logo Oficial" style="max-height: 75px; margin-bottom: 8px; border-radius: 8px;">
          <div class="gold-sub">BÓVEDA NOTARIAL & CUSTODIA INTEGRAL DE PROPIEDADES</div>
          <div class="doc-badge">EXPEDIENTE Nº ${docId}</div>
          <div class="title">${title}</div>
        </div>

        <div class="meta-grid">
          <div><strong>Inmueble Protegido:</strong> ${propName}</div>
          <div><strong>Fecha y Hora de Emisión:</strong> ${date}</div>
          <div><strong>Normativa Aplicable:</strong> Ley 527 de 1999 & Ley 1581 de 2012</div>
          <div><strong>Almacenamiento:</strong> Google Drive Enterprise (Copia Inmutable)</div>
        </div>

        <div class="content-box">
          <p>Se hace constar bajo fe pública y protocolo de custodia técnica que el presente documento ha sido registrado, firmado y verificado en la central de operaciones de <strong>CASA GUARDIAN</strong>. Las inspecciones, actas de recepción de llaves y precintos cuentan con plena validez probatoria ante notarías, aseguradoras y estrados judiciales de la República de Colombia.</p>
        </div>

        <div>
          <strong style="font-size: 10px; text-transform: uppercase; color: #0F172A;">Firma Criptográfica SHA-256 (Huella Digital Incorruptible):</strong>
          <div class="hash-box">
            SHA-256: ${hash}<br>
            TIMESTAMP UTC-5: ${date} · PROTOCOLO NOTARIAL SINAPCODE
          </div>
        </div>

        <div class="footer">
          <div>
            <strong>Antonio Burgos</strong><br>
            Director General de Operaciones<br>
            Sede Central Pasto, Nariño
          </div>
          <div class="stamp">
            ⚖️ SELLO NOTARIAL<br>
            VALIDEZ PERICIAL EN NUBE<br>
            <strong>SINAPCODE SAAS</strong>
          </div>
          <div>
            <strong>Oficial de Custodia Asignado</strong><br>
            Verificación Técnica en Sitio<br>
            Sargento (R) Jairo Muñoz
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
    printWindow.document.write(reportHtml);
    printWindow.document.close();
  } else {
    alert("Por favor permite las ventanas emergentes en tu navegador para generar y descargar tu Documento Notarial en PDF.");
  }
};

function renderRepairsSection(repairs) {
  const container = document.getElementById('dash-repairs-container');
  if (!container) return;

  const currentProp = DEFAULT_PROPERTIES[currentActivePropKey] || DEFAULT_PROPERTIES["casa-pasto"];

  if (repairs.length === 0) {
    container.innerHTML = `
      <div class="p-8 bg-slate-900/60 rounded-3xl border border-slate-700 text-center text-slate-400 text-xs">
        <span class="material-symbols-outlined text-4xl text-emerald-400 mb-2 block">task_alt</span>
        <strong class="text-white text-sm block mb-1">Sin Mantenimientos Pendientes</strong>
        Todos los subsistemas hídricos, eléctricos y mecánicos de este inmueble se encuentran operando al 100%.
      </div>
    `;
    return;
  }

  container.innerHTML = repairs.map(r => {
    const isApproved = r.status.includes('Aprobado');
    const contractor = r.contractor || "Aliado Certificado Casa Guardian Nariño";
    const warranty = r.warranty || "12 Meses de Garantía Contractual";

    return `
      <div class="p-6 bg-slate-900/85 rounded-3xl border ${isApproved ? 'border-emerald-500/40' : 'border-amber-400/40'} shadow-xl space-y-4 hover:border-amber-400/70 transition-all">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-3.5">
          <div class="flex items-center gap-2.5">
            <span class="font-mono text-amber-300 font-extrabold text-xs bg-amber-500/15 px-2.5 py-1 rounded-lg border border-amber-500/30">${r.id}</span>
            <h4 class="text-sm font-extrabold text-white">${r.title}</h4>
          </div>
          <span class="px-3 py-1 ${isApproved ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'} border text-xs font-bold rounded-full">
            ${isApproved ? '● APROBADO & EN EJECUCIÓN' : '⏳ PENDIENTE DE APROBACIÓN'}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60">
          <div>
            <span class="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Descripción de la Obra:</span>
            <span class="text-slate-200">${r.desc}</span>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Contratista / Garantía:</span>
            <span class="text-slate-200 font-medium">${contractor}</span>
            <span class="text-[11px] text-emerald-400 font-semibold block">✓ ${warranty}</span>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Presupuesto Cerrado:</span>
            <span class="text-cyan-300 font-mono font-black text-sm block">${r.cost}</span>
            <span class="text-[10px] text-slate-400">Incluye materiales & mano de obra</span>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-end gap-2.5 pt-1">
          ${!isApproved ? `
            <button onclick="rejectRepairPrompt('${r.id}', '${encodeURIComponent(r.title)}')" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">chat</span>
              <span>Solicitar Ajuste / Duda</span>
            </button>
            <button onclick="approveRepairItem('${r.id}')" class="px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 hover:scale-[1.02]">
              <span class="material-symbols-outlined text-sm font-bold">check_circle</span>
              <span>Aprobar Presupuesto con 1 Clic</span>
            </button>
          ` : `
            <button onclick="downloadWorkOrderDoc('${r.id}', '${encodeURIComponent(r.title)}', '${r.cost}', '${currentProp.name}', '${contractor}')" class="px-4 py-2 bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm">print</span>
              <span>Descargar Orden de Trabajo Oficial en PDF</span>
            </button>
            <span class="text-xs font-bold text-emerald-400 flex items-center gap-1 px-3 py-1 bg-emerald-950/60 rounded-xl border border-emerald-500/30">
              <span class="material-symbols-outlined text-sm">verified</span>
              <span>Firma Digital Verificada</span>
            </span>
          `}
        </div>
      </div>
    `;
  }).join('');
}

window.approveRepairItem = function(repId) {
  const data = DEFAULT_PROPERTIES[currentActivePropKey];
  if (!data) return;

  const item = data.repairs.find(r => r.id === repId);
  if (!item) return;

  const authTimestamp = new Date().toLocaleString('es-CO');
  item.status = "Aprobado por Propietario";
  item.approvedAt = authTimestamp;

  alert(`🛡️ AUTORIZACIÓN DE MANTENIMIENTO SELLADA\n\n` +
        `• Orden: ${repId}\n` +
        `• Obra: ${item.title}\n` +
        `• Inmueble: ${data.name}\n` +
        `• Fecha y Hora: ${authTimestamp} (UTC-5)\n\n` +
        `✅ El Oficial de Custodia ha sido notificado para despachar la cuadrilla técnica certificada. Ya puedes descargar tu Orden de Trabajo Oficial en PDF.`);

  renderRepairsSection(data.repairs);
};

window.rejectRepairPrompt = function(repId, encodedTitle) {
  const title = decodeURIComponent(encodedTitle);
  const data = DEFAULT_PROPERTIES[currentActivePropKey] || DEFAULT_PROPERTIES["casa-pasto"];
  const msg = `Hola ${data.officer}, sobre la cotización ${repId} (${title}) de mi propiedad ${data.name}, deseo consultar un ajuste técnico / cotización alternativa.`;
  window.open(`https://wa.me/${data.officerPhone}?text=${encodeURIComponent(msg)}`, '_blank');
};

window.downloadWorkOrderDoc = function(repId, encodedTitle, cost, propName, contractor) {
  const title = decodeURIComponent(encodedTitle);
  const now = new Date().toLocaleString('es-CO');

  const workOrderHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Orden de Trabajo ${repId} — CASA GUARDIAN</title>
      <style>
        @page { size: A4 portrait; margin: 12mm; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #0F172A; background: #FFFFFF; padding: 20px; line-height: 1.45; }
        .order-border { border: 3px double #D4AF37; padding: 30px; border-radius: 12px; background: #FFFCF7; }
        .header { text-align: center; border-bottom: 2px solid #0F172A; padding-bottom: 15px; margin-bottom: 20px; }
        .badge { display: inline-block; background: #061325; color: #10B981; padding: 4px 12px; border-radius: 6px; font-family: monospace; font-size: 11px; font-weight: bold; margin-top: 10px; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #F1F5F9; padding: 12px; border-radius: 8px; font-size: 11px; margin: 15px 0; border: 1px solid #CBD5E1; }
        .footer { display: flex; justify-content: space-between; align-items: center; margin-top: 35px; border-top: 1px solid #CBD5E1; padding-top: 15px; font-size: 10px; color: #475569; }
        .stamp { border: 2px dashed #D4AF37; padding: 8px 12px; text-align: center; border-radius: 8px; font-weight: bold; color: #B45309; }
        @media print { body { padding: 0; } }
      </style>
    </head>
    <body>
      <div class="order-border">
        <div class="header">
          <img src="img/logo.jpg" alt="Casa Guardian Logo" style="max-height: 75px; margin-bottom: 8px; border-radius: 8px;">
          <div style="font-size: 10px; font-weight: bold; letter-spacing: 3px; color: #B45309; text-transform: uppercase;">ORDEN DE TRABAJO & AUTORIZACIÓN REMOTA DE MANTENIMIENTO</div>
          <div class="badge">ORDEN DE SERVICIO Nº ${repId} · AUTORIZADA POR PROPIETARIO</div>
          <h2 style="font-size: 16px; font-weight: 800; color: #0F172A; margin: 12px 0 0 0;">${title}</h2>
        </div>

        <div class="meta-grid">
          <div><strong>Inmueble:</strong> ${propName}</div>
          <div><strong>Fecha de Autorización:</strong> ${now}</div>
          <div><strong>Contratista Asignado:</strong> ${contractor}</div>
          <div><strong>Presupuesto Aprobado:</strong> ${cost}</div>
          <div><strong>Garantía Contractual:</strong> 12 Meses Certificada</div>
          <div><strong>Supervisión Técnica:</strong> Oficial de Custodia Casa Guardian</div>
        </div>

        <div style="font-size: 11.5px; color: #334155; margin: 15px 0; text-align: justify; line-height: 1.6;">
          <p>La presente Orden de Trabajo constituye autorización formal y vinculante emitida digitalmente por el titular ausente para la ejecución de las labores técnicas especificadas. Las cuadrillas cuentan con póliza de responsabilidad civil extracontractual y verificación de antecedentes.</p>
        </div>

        <div class="footer">
          <div>
            <strong>Antonio Burgos</strong><br>
            Director General de Operaciones<br>
            Casa Guardian Pasto, Nariño
          </div>
          <div class="stamp">
            🛡️ CONTROL PRESUPUESTAL<br>
            AUTORIZADO 1-CLIC<br>
            <strong>SIN SOBRECOSTOS</strong>
          </div>
          <div>
            <strong>Contratista Técnico</strong><br>
            Firma de Compromiso y Ejecución<br>
            Garantía 100% Satisfecho
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
    printWindow.document.write(workOrderHtml);
    printWindow.document.close();
  } else {
    alert("Por favor permite las ventanas emergentes en tu navegador para generar y descargar tu Orden de Trabajo.");
  }
};

/**
 * Control de Pestañas del Menú Lateral del Portal
 */
function initDashboardTabs() {
  const tabs = document.querySelectorAll('.dash-nav-tab');
  const sections = document.querySelectorAll('.dash-tab-section');

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSecId = tab.getAttribute('data-tab-section');
      if (!targetSecId) return;

      tabs.forEach(t => {
        t.className = 'dash-nav-tab flex items-center gap-3 px-3.5 py-3 text-slate-300 hover:bg-slate-800 rounded-xl transition-all';
      });
      tab.className = 'dash-nav-tab flex items-center gap-3 px-3.5 py-3 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-xl font-bold transition-all';

      sections.forEach(sec => {
        if (sec.id === targetSecId) {
          sec.classList.remove('hidden');
        } else {
          sec.classList.add('hidden');
        }
      });
    });
  });
}

window.CasaGuardianDashboard = {
  updateDashboardUI,
  DEFAULT_PROPERTIES
};