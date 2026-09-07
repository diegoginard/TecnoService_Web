/**
 * TecnoService Core - Interactive Gallery Slider & Lightbox
 * Manejo de navegación, transiciones suaves, gestos táctiles y lightbox para 25 capturas.
 */

document.addEventListener('DOMContentLoaded', () => {
  const screenshots = [
    { id: 1, title: 'Configuración de Empresa & Métodos de Pago', category: 'Administración' },
    { id: 2, title: 'Diagnóstico & Registro de Falla Típica', category: 'Laboratorio Técnico' },
    { id: 3, title: 'Alta de Orden de Ingreso en Recepción', category: 'Recepción' },
    { id: 4, title: 'Libro de Fallas & Base de Conocimiento', category: 'Base Técnica' },
    { id: 5, title: 'Gestión de Reingresos por Garantía', category: 'Garantías' },
    { id: 6, title: 'Consulta Rápida por N° de Serie / OT', category: 'Trazabilidad' },
    { id: 7, title: 'Panel de Órdenes de Trabajo Activas', category: 'Taller' },
    { id: 8, title: 'Mano de Obra, Repuestos & Presupuesto', category: 'Presupuestación' },
    { id: 9, title: 'Detalle de Solución Aplicada en Banco', category: 'Laboratorio' },
    { id: 10, title: 'Talones de Ingreso & Comprobantes para Cliente', category: 'Impresión' },
    { id: 11, title: 'Control de Stock & Repuestos de Taller', category: 'Inventario' },
    { id: 12, title: 'Punto de Venta / Mostrador y Facturación', category: 'Ventas' },
    { id: 13, title: 'Ficha de Clientes & Cuentas Corrientes', category: 'Clientes' },
    { id: 14, title: 'Historial Integral del Equipo por Serie', category: 'Historial' },
    { id: 15, title: 'Evidencia Fotográfica de Fallas y Estado', category: 'Fotografía' },
    { id: 16, title: 'Visitas Técnicas & Servicios a Domicilio', category: 'En Sitio' },
    { id: 17, title: 'Caja Diaria, Señas & Arqueo de Movimientos', category: 'Finanzas' },
    { id: 18, title: 'Gestión de Técnicos & Permisos de Acceso', category: 'Seguridad' },
    { id: 19, title: 'Auditoría & Trazabilidad de Acciones', category: 'Sistema' },
    { id: 20, title: 'Conexión SQLite Local & Copias de Seguridad', category: 'Base de Datos' },
    { id: 21, title: 'Resumen Ejecutivo & Reportes del Taller', category: 'Reportes' },
    { id: 22, title: 'Búsqueda Avanzada & Filtros por Estado', category: 'Búsqueda' },
    { id: 23, title: 'Notificaciones & Recordatorios de Entregas', category: 'Operaciones' },
    { id: 24, title: 'Checklist Estético & Accesorios Recibidos', category: 'Recepción' },
    { id: 25, title: 'Visión General del Sistema TecnoService Core', category: 'Dashboard' }
  ];

  const totalSlides = screenshots.length;
  let currentIndex = 0;
  let autoplayInterval = null;
  const AUTOPLAY_DELAY = 5000;
  let isAutoplayActive = true;

  // Elementos DOM
  const sliderTrack = document.getElementById('sliderTrack');
  const thumbTrack = document.getElementById('thumbTrack');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const counterEl = document.getElementById('sliderCounter');
  const currentTitleEl = document.getElementById('slideCurrentTitle');
  const currentCategoryEl = document.getElementById('slideCurrentCategory');
  const autoplayToggleBtn = document.getElementById('autoplayToggle');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const progressBar = document.getElementById('sliderProgressBar');

  // Lightbox DOM
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  if (!sliderTrack || !thumbTrack) return;

  // Renderizar diapositivas
  screenshots.forEach((item, index) => {
    // Diapositiva Principal
    const slide = document.createElement('div');
    slide.className = `slider-slide ${index === 0 ? 'active' : ''}`;
    slide.dataset.index = index;

    const img = document.createElement('img');
    img.src = `assets/imagenes/${item.id}.png`;
    img.alt = `TecnoService Core - ${item.title}`;
    img.loading = index === 0 ? 'eager' : 'lazy';
    
    // Zoom icon overlay
    const zoomOverlay = document.createElement('div');
    zoomOverlay.className = 'slide-zoom-hint';
    zoomOverlay.innerHTML = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        <line x1="11" y1="8" x2="11" y2="14"></line>
        <line x1="8" y1="11" x2="14" y2="11"></line>
      </svg>
      <span>Clic para ampliar pantalla completa</span>
    `;

    slide.appendChild(img);
    slide.appendChild(zoomOverlay);

    slide.addEventListener('click', () => {
      openLightbox(index);
    });

    sliderTrack.appendChild(slide);

    // Miniatura
    const thumb = document.createElement('button');
    thumb.type = 'button';
    thumb.className = `thumb-item ${index === 0 ? 'active' : ''}`;
    thumb.dataset.index = index;
    thumb.setAttribute('aria-label', `Ver captura ${item.id}: ${item.title}`);

    const thumbImg = document.createElement('img');
    thumbImg.src = `assets/imagenes/${item.id}.png`;
    thumbImg.alt = `Miniatura ${item.id}`;
    thumbImg.loading = 'lazy';

    const thumbBadge = document.createElement('span');
    thumbBadge.className = 'thumb-number';
    thumbBadge.textContent = item.id;

    thumb.appendChild(thumbImg);
    thumb.appendChild(thumbBadge);

    thumb.addEventListener('click', () => {
      goToSlide(index);
      resetAutoplay();
    });

    thumbTrack.appendChild(thumb);
  });

  const slides = sliderTrack.querySelectorAll('.slider-slide');
  const thumbs = thumbTrack.querySelectorAll('.thumb-item');

  function updateSlideInfo(index) {
    const item = screenshots[index];
    if (counterEl) {
      counterEl.textContent = `${index + 1} / ${totalSlides}`;
    }
    if (currentTitleEl) {
      currentTitleEl.textContent = item.title;
    }
    if (currentCategoryEl) {
      currentCategoryEl.textContent = item.category;
    }
  }

  function goToSlide(index) {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    // Desplazar pista
    sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentIndex);
    });

    // Actualizar miniaturas
    thumbs.forEach((thumb, idx) => {
      thumb.classList.toggle('active', idx === currentIndex);
    });

    // Centrar miniatura activa en la tira horizontal
    const activeThumb = thumbs[currentIndex];
    if (activeThumb) {
      const trackWidth = thumbTrack.clientWidth;
      const thumbLeft = activeThumb.offsetLeft;
      const thumbWidth = activeThumb.clientWidth;
      thumbTrack.scrollTo({
        left: thumbLeft - trackWidth / 2 + thumbWidth / 2,
        behavior: 'smooth'
      });
    }

    updateSlideInfo(currentIndex);
    restartProgressBar();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  // Controles
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nextSlide();
      resetAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      prevSlide();
      resetAutoplay();
    });
  }

  // Autoplay
  function startAutoplay() {
    stopAutoplay();
    if (!isAutoplayActive) return;
    restartProgressBar();
    autoplayInterval = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  function resetAutoplay() {
    if (isAutoplayActive) {
      startAutoplay();
    }
  }

  function restartProgressBar() {
    if (!progressBar) return;
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    if (isAutoplayActive) {
      setTimeout(() => {
        progressBar.style.transition = `width ${AUTOPLAY_DELAY}ms linear`;
        progressBar.style.width = '100%';
      }, 30);
    }
  }

  if (autoplayToggleBtn) {
    autoplayToggleBtn.addEventListener('click', () => {
      isAutoplayActive = !isAutoplayActive;
      autoplayToggleBtn.classList.toggle('paused', !isAutoplayActive);
      const playIcon = autoplayToggleBtn.querySelector('.icon-play');
      const pauseIcon = autoplayToggleBtn.querySelector('.icon-pause');
      if (playIcon && pauseIcon) {
        playIcon.style.display = isAutoplayActive ? 'none' : 'block';
        pauseIcon.style.display = isAutoplayActive ? 'block' : 'none';
      }
      autoplayToggleBtn.setAttribute('title', isAutoplayActive ? 'Pausar reproducción' : 'Reanudar reproducción');
      if (isAutoplayActive) {
        startAutoplay();
      } else {
        stopAutoplay();
        if (progressBar) {
          progressBar.style.transition = 'none';
          progressBar.style.width = '0%';
        }
      }
    });
  }

  // Pausar en Hover sobre el carrusel principal
  const sliderContainer = document.querySelector('.slider-viewport-wrapper');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => {
      if (isAutoplayActive) stopAutoplay();
    });
    sliderContainer.addEventListener('mouseleave', () => {
      if (isAutoplayActive) startAutoplay();
    });
  }

  // Soporte Táctil & Drag en el Slider
  let startX = 0;
  let currentTranslateX = 0;
  let isDragging = false;

  sliderTrack.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    stopAutoplay();
  }, { passive: true });

  sliderTrack.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    currentTranslateX = currentX - startX;
  }, { passive: true });

  sliderTrack.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    if (currentTranslateX < -45) {
      nextSlide();
    } else if (currentTranslateX > 45) {
      prevSlide();
    }
    currentTranslateX = 0;
    resetAutoplay();
  });

  // Teclado
  document.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.classList.contains('active')) {
      if (e.key === 'ArrowRight') {
        lightboxNextSlide();
      } else if (e.key === 'ArrowLeft') {
        lightboxPrevSlide();
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
      return;
    }

    const rect = sliderTrack.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      if (e.key === 'ArrowRight') {
        nextSlide();
        resetAutoplay();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
        resetAutoplay();
      }
    }
  });

  // Lightbox / Pantalla Completa
  let lightboxIndex = 0;

  function openLightbox(index) {
    lightboxIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    stopAutoplay();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    goToSlide(lightboxIndex);
    resetAutoplay();
  }

  function updateLightboxContent() {
    const item = screenshots[lightboxIndex];
    lightboxImg.src = `assets/imagenes/${item.id}.png`;
    lightboxImg.alt = item.title;
    if (lightboxTitle) lightboxTitle.textContent = `${item.title}`;
    const badge = lightbox.querySelector('.lightbox-category-badge');
    if (badge) badge.textContent = item.category;
    if (lightboxCounter) lightboxCounter.textContent = `${lightboxIndex + 1} de ${totalSlides}`;
  }

  function lightboxNextSlide() {
    lightboxIndex = (lightboxIndex + 1) % totalSlides;
    updateLightboxContent();
  }

  function lightboxPrevSlide() {
    lightboxIndex = (lightboxIndex - 1 + totalSlides) % totalSlides;
    updateLightboxContent();
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      openLightbox(currentIndex);
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      lightboxNextSlide();
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      lightboxPrevSlide();
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
        closeLightbox();
      }
    });
  }

  // Inicialización
  updateSlideInfo(0);
  startAutoplay();
});
