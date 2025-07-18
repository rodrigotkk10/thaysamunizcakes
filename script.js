// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== MENU HAMBÚRGUER =====
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const header = document.querySelector('header');
    
    // Função para alternar o menu
    function toggleMenu() {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
        
        // Atualiza aria-expanded para acessibilidade
        const isOpen = navMenu.classList.contains('open');
        menuToggle.setAttribute('aria-expanded', isOpen);
    }
    
    // Event listeners para o menu
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', toggleMenu);
        
        // Suporte a teclado para o menu hambúrguer
        menuToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
        
        // Fecha o menu ao clicar em um link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Fecha o menu ao clicar fora dele
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // ===== HEADER SCROLL EFFECT =====
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Adiciona classe quando rola a página
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // ===== SMOOTH SCROLL PARA LINKS INTERNOS =====
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== MODAL PARA GALERIA =====
    function createModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" aria-label="Fechar modal">&times;</button>
                <img src="" alt="" />
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }
    
    const modal = createModal();
    const modalImg = modal.querySelector('img');
    const modalClose = modal.querySelector('.modal-close');
    
    // Adiciona funcionalidade de modal às imagens da galeria
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const info = this.querySelector('.gallery-info');
            
            if (img) {
                modalImg.src = img.src;
                modalImg.alt = img.alt;
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
                
                // Foca no botão de fechar para acessibilidade
                modalClose.focus();
            }
        });
        
        // Suporte a teclado para abrir modal
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Fecha o modal
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    modalClose.addEventListener('click', closeModal);
    
    // Fecha modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
    
    // Fecha modal clicando fora da imagem
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // ===== LAZY LOADING PARA IMAGENS =====
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('img-loading');
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            img.classList.add('img-loading');
            imageObserver.observe(img);
        });
    }
    
    // ===== ANIMAÇÕES DE ENTRADA =====
    function animateOnScroll() {
        const elements = document.querySelectorAll('section, .card, .gallery-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    // ===== TRATAMENTO DE ERROS DE IMAGEM =====
    function handleImageErrors() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.addEventListener('error', function() {
                // Substitui por uma imagem placeholder se a original falhar
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbSBuw6NvIGVuY29udHJhZGE8L3RleHQ+PC9zdmc+';
                this.alt = 'Imagem não encontrada';
                this.style.opacity = '0.7';
            });
            
            img.addEventListener('load', function() {
                this.classList.remove('img-loading');
            });
        });
    }
    
    // ===== MELHORIAS DE PERFORMANCE =====
    function optimizePerformance() {
        // Debounce para eventos de scroll
        let scrollTimeout;
        const originalScrollHandler = window.onscroll;
        
        window.addEventListener('scroll', function() {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(() => {
                if (originalScrollHandler) originalScrollHandler();
            }, 10);
        });
    }
    
    // ===== ACESSIBILIDADE MELHORADA =====
    function improveAccessibility() {
        // Adiciona indicadores visuais para elementos focáveis
        const focusableElements = document.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
        
        focusableElements.forEach(el => {
            el.addEventListener('focus', function() {
                this.style.outline = '2px solid #c71585';
                this.style.outlineOffset = '2px';
            });
            
            el.addEventListener('blur', function() {
                this.style.outline = '';
                this.style.outlineOffset = '';
            });
        });
        
        // Adiciona aria-labels onde necessário
        const whatsappButton = document.querySelector('.whatsapp-button');
        if (whatsappButton && !whatsappButton.getAttribute('aria-label')) {
            whatsappButton.setAttribute('aria-label', 'Entrar em contato via WhatsApp');
        }
    }
    
    // ===== INICIALIZAÇÃO =====
    function init() {
        lazyLoadImages();
        animateOnScroll();
        handleImageErrors();
        optimizePerformance();
        improveAccessibility();
        
        // Adiciona classe para indicar que JS está carregado
        document.body.classList.add('js-loaded');
        
        console.log('🎂 Thaysa Muniz Cakes - Website carregado com sucesso!');
    }
    
    // Executa inicialização
    init();
    
    // ===== UTILITÁRIOS =====
    
    // Função para mostrar notificações (pode ser usada futuramente)
    window.showNotification = function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #c71585;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Anima entrada
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove após 3 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    };
    
    // Função para scroll suave para elemento específico
    window.scrollToElement = function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            const headerHeight = header.offsetHeight;
            const targetPosition = element.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    };
});

// ===== SERVICE WORKER PARA CACHE (OPCIONAL) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registrado com sucesso:', registration.scope);
            })
            .catch(function(error) {
                console.log('Falha ao registrar ServiceWorker:', error);
            });
    });
}

