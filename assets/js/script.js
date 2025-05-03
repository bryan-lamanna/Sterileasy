// Configuração das transições
document.addEventListener('DOMContentLoaded', function() {
  // Intercepta todos os cliques em links
  document.body.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (!link) return;
    
    // Ignora links externos, âncoras e downloads
    if (
      link.href.includes('mailto:') || 
      link.href.includes('tel:') || 
      link.href.includes('javascript:') || 
      link.href.includes('#') ||
      link.download ||
      link.target === '_blank' ||
      !link.href.startsWith(window.location.origin)
    ) {
      return;
    }
    
    e.preventDefault();
    navigateTo(link.href);
  });
  
  // Atualiza links ativos
  updateActiveNavLink();
});

// Função de navegação com transição
function navigateTo(url) {
  const pageWrapper = document.getElementById('page-transition');
  
  // 1. Fade-out
  pageWrapper.classList.add('fade-out');
  
  // 2. Carrega a nova página
  setTimeout(async () => {
    try {
      const response = await fetch(url);
      const text = await response.text();
      const parser = new DOMParser();
      const newDoc = parser.parseFromString(text, 'text/html');
      
      // 3. Atualiza apenas o conteúdo necessário
      document.title = newDoc.title;
      document.getElementById('main-content').innerHTML = 
        newDoc.getElementById('main-content').innerHTML;
      
      // 4. Atualiza o estado no histórico
      window.history.pushState({}, '', url);
      
      // 5. Fade-in
      pageWrapper.classList.remove('fade-out');
      
      // 6. Rola para o topo e atualiza menu ativo
      window.scrollTo(0, 0);
      updateActiveNavLink();
      
    } catch (error) {
      // Fallback para navegação normal se houver erro
      window.location.href = url;
    }
  }, 400); // Tempo deve corresponder à duração da transição CSS
}

// Função para atualizar links ativos (como anteriormente)
function updateActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    link.classList.toggle('active', linkPage === currentPage);
  });
}

// Atualiza ao navegar no histórico
window.addEventListener('popstate', () => {
  window.location.reload(); // Solução simples para SPAs básicas
});

// Menu suave para âncoras (apenas para links internos)
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    // Verifica se o link é para uma âncora na mesma página
    if (this.getAttribute('href').startsWith('#')) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      document.querySelector(targetId)?.scrollIntoView({
        behavior: 'smooth'
      });
    }
    // Links para outras páginas não precisam de preventDefault
  });
});


// Mostra loader durante transições
function showLoader() {
  const loader = document.createElement('div');
  loader.className = 'loader';
  document.body.appendChild(loader);
  setTimeout(() => loader.style.transform = 'scaleX(0.8)', 10);
}



document.addEventListener('DOMContentLoaded', function() {
    // Fecha o menu quando um item é clicado (para mobile)
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(function(navLink) {
        navLink.addEventListener('click', function() {
            if(navbarCollapse.classList.contains('show')) {
                navbarToggler.click(); // Fecha o menu
            }
        });
    });
    
    // Alternar classe 'active' no botão do menu
    navbarToggler.addEventListener('click', function() {
        this.classList.toggle('active');
    });
});
