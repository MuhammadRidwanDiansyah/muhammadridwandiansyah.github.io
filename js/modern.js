/**
 * Muhammad Ridwan Diansyah - Modern Portfolio Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initTypewriter();
  initMetricsCounter();
  initPortfolioFilter();
  initSkillsFilter();
  initProjectModal();
  initCopyButtons();
  initContactForm();
  initBackToTop();
});

/* ==========================================================================
   1. Theme Toggle (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('mrd_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  toggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('mrd_theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme} mode`);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#theme-toggle i');
  if (!icon) return;
  if (theme === 'light') {
    icon.className = 'fa-solid fa-moon';
  } else {
    icon.className = 'fa-solid fa-sun';
  }
}

/* ==========================================================================
   2. Navbar Scroll & Active Link Tracking
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveSection();
  });

  // Mobile menu toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = hamburger.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('active')) {
          icon.className = 'fa-solid fa-xmark';
        } else {
          icon.className = 'fa-solid fa-bars';
        }
      }
    });

    // Close menu when clicking link
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = hamburger.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }

  // Active section indicator
  function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        links.forEach(l => l.classList.remove('active'));
        if (targetLink) targetLink.classList.add('active');
      }
    });
  }
}

/* ==========================================================================
   3. Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const textElement = document.getElementById('typing-text');
  if (!textElement) return;

  const roles = [
    'Full-Stack Software Engineer',
    'Frontend & Microfrontend Specialist',
    'Java & Spring Boot Microservices Architect',
    'Core Banking & SCM Systems Developer',
    'Software Quality Assurance & Tester'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      textElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      textElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typeSpeed = 1800; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 400; // Pause before typing new word
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* ==========================================================================
   4. Metrics Counter on Scroll
   ========================================================================== */
function initMetricsCounter() {
  const metrics = document.querySelectorAll('.metric-value');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        metrics.forEach(metric => {
          const target = parseFloat(metric.getAttribute('data-target'));
          const suffix = metric.getAttribute('data-suffix') || '';
          const decimals = parseInt(metric.getAttribute('data-decimals') || 0);
          animateValue(metric, 0, target, 1600, suffix, decimals);
        });
      }
    });
  }, { threshold: 0.5 });

  const metricsSection = document.getElementById('metrics-bar');
  if (metricsSection) {
    observer.observe(metricsSection);
  }
}

function animateValue(obj, start, end, duration, suffix, decimals) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = progress * (end - start) + start;
    obj.innerHTML = (decimals > 0 ? value.toFixed(decimals) : Math.floor(value)) + suffix;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

/* ==========================================================================
   5. Portfolio Category Filter
   ========================================================================== */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.portfolio-tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. Skills Category Filter
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skill-tab-btn');
  const skillGroups = document.querySelectorAll('.skills-category-group');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillGroups.forEach(group => {
        const groupCategory = group.getAttribute('data-category');
        if (filterValue === 'all' || groupCategory === filterValue) {
          group.style.display = 'block';
        } else {
          group.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. Project Detail Modal
   ========================================================================== */
const projectData = {
  'scm-microfrontend': {
    title: 'Supply Chain Management (SCM) Microfrontend System',
    category: 'Enterprise & Microfrontend',
    image: 'img/gambar.png',
    tags: ['React.js', 'Microfrontends', 'Microservices', 'Jest', 'SonarQube', 'Agile'],
    desc: 'Pengembangan arsitektur antarmuka Supply Chain Management (SCM) berskala enterprise berbasis Microfrontend untuk PT Besmart Global Indonesia.',
    features: [
      'Membangun arsitektur microfrontend menggunakan React.js dan Reusable Components untuk 25+ modul rantai pasok.',
      'Integrasi RESTful API dengan backend berbasis Microservices dan implementasi robust error handling.',
      'Standarisasi komponen UI/UX dan pengujian komprehensif hingga tahap System Integration Testing (SIT) & User Acceptance Testing (UAT).',
      'Menginisialisasi framework Jest dan menyusun Unit Test hingga mencapai Code Coverage SonarQube lebih dari 80%.',
      'Code Refactoring dan Cleansing untuk mengeliminasi Bug dan Code Smells sebelum rilis ke production.'
    ]
  },
  'core-banking': {
    title: 'Core Banking Platform & Deposito Calculation Engine',
    category: 'Fintech & Enterprise Banking',
    image: 'img/Screenshot(1078).png',
    tags: ['React.js', 'Java Spring Boot', 'SQL Server', 'Redux', 'Stored Procedures'],
    desc: 'Pengembangan end-to-end 12+ modul inti perbankan (Core Banking) yang mencakup pengelolaan rekening, tab multi-formulir dinamis, dan kalkulasi simulasi deposito otomatis.',
    features: [
      'Mengembangkan frontend interaktif dengan React.js, Redux, dynamic search, dan mandatory field validations.',
      'Membangun backend Java Spring Boot dengan arsitektur Controller, Service, Repository, dan Model Mapper.',
      'Merancang SQL Server Stored Procedures untuk menjalankan kalkulasi otomatis simulasi bunga deposito dengan output JSON.',
      'Menyusun Technical Documentation alur integrasi REST API dan standar CRUD untuk tim pengembang.',
      'Integrasi menyeluruh modul frontend, backend, dan basis data perbankan.'
    ]
  },
  'pension-backend': {
    title: 'Pension Partner Microservices & 100k Row Async Engine',
    category: 'Backend & High-Volume Processing',
    image: 'img/postman.png',
    tags: ['Java 17', 'Spring Boot 3.2.0', 'PostgreSQL', 'JWT', 'Spring Security', 'Async Processing'],
    desc: 'Layanan backend berkinerja tinggi untuk integrasi mitra pensiun nasional (Taspen, Asabri, Dapenpos, Taspen Life) dengan arsitektur Microservices.',
    features: [
      'Mengembangkan layanan backend Java 17 dan Spring Boot 3.2.0 terdistribusi untuk lebih dari 10 modul mitra pensiun.',
      'Mengamankan endpoint RESTful API menggunakan JWT Authentication dan Spring Security.',
      'Membangun fitur Asynchronous Data Processing untuk upload dan generate Excel hingga 100.000 baris data secara efisien.',
      'Optimasi SQL query pada PostgreSQL serta penerapan Server-Side Pagination untuk mempercepat pengambilan data.',
      'Penyusunan SQL Migration Scripts, Audit Log, dan Tracing untuk transparansi riwayat transaksi sistem.'
    ]
  },
  'dealer-management': {
    title: 'Dealer Management System (DMS) Enterprise Platform',
    category: 'Enterprise ERP',
    image: 'img/gambar.png',
    tags: ['AngularJS', 'JavaScript', 'HTML5/CSS3', 'SIT', 'Advanced Debugging'],
    desc: 'Pengembangan dan pemeliharaan antarmuka Dealer Management System (DMS) untuk pengelolaan operasional diler otomotif berskala besar.',
    features: [
      'Mengembangkan fitur antarmuka DMS menggunakan AngularJS dengan mempertahankan kompatibilitas Change Request (CR).',
      'Advanced debugging dan error handling pada modul krusial selama fase System Integration Testing (SIT).',
      'Standarisasi tipografi antarmuka melalui branch CR_FONT untuk memastikan kenyamanan pengguna.',
      'Kolaborasi intensif dengan Business Analyst dan QA dalam verifikasi alur kerja diler.'
    ]
  },
  'ombudsman-simpel': {
    title: 'SIMPeL 4 Ombudsman Republik Indonesia',
    category: 'Government & Public Service',
    image: 'img/pengaduan.png',
    tags: ['Vue.js', 'JavaScript', 'RESTful API', 'Agile/Scrum', 'Responsive Design'],
    desc: 'Sistem Informasi Manajemen Penyelesaian Laporan (SIMPeL 4) Ombudsman RI untuk mempermudah penanganan pengaduan masyarakat secara transparan dan akuntabel.',
    features: [
      'Mengembangkan antarmuka responsif menggunakan Vue.js dan JavaScript berdasarkan Sprint Plan Agile Development.',
      'Integrasi data alur laporan masyarakat dengan REST API backend.',
      'Bug fixing dan optimasi tampilan pada berbagai ukuran layar perangkat (mobile, tablet, desktop).',
      'Pengujian fungsionalitas dan kegunaan sistem bersama QA dan tim Ombudsman RI.'
    ]
  },
  'coronary-heart-prediction': {
    title: 'Coronary Heart Disease Prediction with Naïve Bayes & Laplace Correction',
    category: 'Healthcare & Machine Learning Research',
    image: 'img/naivebayesdenganlaplace.png',
    tags: ['Machine Learning', 'Naïve Bayes', 'Laplace Correction', 'Expert System', 'Healthcare'],
    desc: 'Penelitian sistem pakar dan implementasi algoritma Naïve Bayes dengan Laplace Correction untuk memprediksi penyakit jantung koroner pada Rumah Sakit Umum Pindad.',
    features: [
      'Menerapkan perbaikan Laplace Correction untuk mengatasi zero probability pada dataset rekam medis pasien.',
      'Mencapai akurasi model yang tinggi dalam mendiagnosis probabilitas risiko penyakit jantung koroner.',
      'Merancang antarmuka rekomendasi keputusan medis untuk mempermudah tenaga kesehatan.',
      'Dipublikasikan sebagai hasil penelitian tugas akhir S1 Sistem Informasi dengan nilai memuaskan.'
    ]
  },
  'cpm-qa-engine': {
    title: 'ERP Project Management & Critical Path Method (CPM) QA Validation',
    category: 'Quality Assurance & Algorithm Validation',
    image: 'img/akurasimetode.png',
    tags: ['Quality Assurance', 'CPM Algorithm', 'Gantt Chart', 'S-Curve', 'Regression Testing'],
    desc: 'Pengujian perangkat lunak dan validasi komputasi matematis untuk modul ERP Project Management dan Helpdesk.',
    features: [
      'Validasi akurasi algoritma komputasi Gantt Chart, S-Curve, Projection End, dan Critical Path Method (CPM) melalui pemodelan rumus Excel.',
      'Menyusun Test Cases, Test Evidence, dan melacak penyelesaian bug prioritas High, Medium, Low.',
      'Melakukan Functional & Regression Testing serta Re-Testing pasca-deployment bersama tim Task Force.',
      'Aktif dalam Daily Stand-up Agile bersama PM, BA, dan developer.'
    ]
  },
  'kelurahan-cicaheum': {
    title: 'Sistem Informasi Pengolahan Data Kependudukan',
    category: 'Web App & Database',
    image: 'img/kelurahan.png',
    tags: ['PHP', 'MySQL', 'Web Development', 'Public Administration'],
    desc: 'Sistem digitalisasi administrasi kependudukan dan pembuatan surat layanan warga pada Kantor Kelurahan Cicaheum.',
    features: [
      'Digitalisasi pencatatan data kependudukan menggantikan pencatatan manual.',
      'Fitur generate surat keterangan otomatis dan pencarian data warga cepat.',
      'Peningkatan efisiensi waktu pelayanan warga di kantor kelurahan.'
    ]
  },
  'penjualan-hp': {
    title: 'Sistem Informasi Penjualan Handphone & Inventori',
    category: 'Web App & Commerce',
    image: 'img/penjualan.png',
    tags: ['PHP', 'MySQL', 'Bootstrap', 'POS System'],
    desc: 'Aplikasi manajemen transaksi penjualan, inventori stok handphone, dan pelaporan keuangan berkala.',
    features: [
      'Pencatatan kasir dan transaksi penjualan real-time.',
      'Manajemen stok handphone dan aksesoris dengan notifikasi stok menipis.',
      'Laporan omzet penjualan harian dan bulanan.'
    ]
  },
  'rental-mobil-api': {
    title: 'Web Service REST API Rental Mobil',
    category: 'API & Microservices',
    image: 'img/postman.png',
    tags: ['RESTful API', 'Node.js / Express', 'Postman', 'JSON API'],
    desc: 'Arsitektur web service API untuk pengelolaan armada rental mobil, booking jadwal, dan otentikasi pelanggan.',
    features: [
      'Penyusunan endpoint RESTful terstandarisasi untuk booking dan ketersediaan armada.',
      'Pengujian menyeluruh menggunakan Postman Collection.',
      'Validasi payload input dan error handling response.'
    ]
  },
  'antar-laundry': {
    title: 'UI/UX Design & Sistem Informasi Antar Laundry',
    category: 'UI/UX & Scientific Journal',
    image: 'img/antarlaundry.png',
    tags: ['Figma', 'UI/UX Design', 'Scientific Publication', 'Mobile First'],
    desc: 'Rancangan desain antarmuka aplikasi pemesanan dan pelacakan jasa laundry yang dipublikasikan dalam artikel jurnal ilmiah.',
    features: [
      'Desain alur pemesanan jemput laundry hingga pengantaran kembali ke pelanggan.',
      'Riset kebutuhan pengguna dan publikasi artikel jurnal ilmiah nasional.',
      'Prototipe interaktif menggunakan Figma.'
    ]
  },
  'ecommerce-wordpress': {
    title: 'Ecommerce Harakiri CMS WordPress',
    category: 'Web & CMS',
    image: 'img/harakiri.png',
    tags: ['WordPress', 'WooCommerce', 'Payment Integration', 'SEO'],
    desc: 'Platform toko online modern berbasis WordPress & WooCommerce dengan katalog produk, shopping cart, dan integrasi pengiriman.',
    features: [
      'Kustomisasi tema e-commerce responsif.',
      'Setup katalog produk dan kalkulator ongkos kirim otomatis.',
      'Optimasi kecepatan loading dan SEO dasar.'
    ]
  }
};

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const triggerBtns = document.querySelectorAll('.btn-details');

  if (!modal) return;

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projectId = btn.getAttribute('data-project');
      const data = projectData[projectId];
      if (!data) return;

      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-image').src = data.image;
      document.getElementById('modal-image').alt = data.title;
      document.getElementById('modal-desc').textContent = data.desc;

      const tagsContainer = document.getElementById('modal-tags');
      tagsContainer.innerHTML = '';
      data.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tech-tag';
        span.textContent = tag;
        tagsContainer.appendChild(span);
      });

      const featuresContainer = document.getElementById('modal-features');
      featuresContainer.innerHTML = '';
      data.features.forEach(feat => {
        const li = document.createElement('li');
        li.textContent = feat;
        featuresContainer.appendChild(li);
      });

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   8. Copy to Clipboard
   ========================================================================== */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.btn-copy');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: ${textToCopy}`);
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = 'fa-solid fa-check';
          setTimeout(() => {
            icon.className = 'fa-regular fa-copy';
          }, 2000);
        }
      }).catch(err => {
        console.error('Copy failed', err);
      });
    });
  });
}

function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/* ==========================================================================
   9. Interactive Contact Form
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const btnEmail = document.getElementById('btn-send-email');
  const btnWa = document.getElementById('btn-send-wa');

  if (!form) return;

  if (btnEmail) {
    btnEmail.addEventListener('click', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim() || 'Inquiry / Project Opportunity';
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !message) {
        showToast('Mohon lengkapi Nama dan Pesan Anda');
        return;
      }

      const body = `Halo Muhammad Ridwan,\n\nNama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`;
      const mailtoUrl = `mailto:ridwandiansyah2@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
    });
  }

  if (btnWa) {
    btnWa.addEventListener('click', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !message) {
        showToast('Mohon lengkapi Nama dan Pesan Anda');
        return;
      }

      const waText = `Halo Muhammad Ridwan, saya *${name}*.\n\n${message}`;
      const waUrl = `https://wa.me/6287735518578?text=${encodeURIComponent(waText)}`;
      window.open(waUrl, '_blank');
    });
  }
}

/* ==========================================================================
   10. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backBtn = document.getElementById('back-to-top');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
