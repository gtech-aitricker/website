/* ============================================== */
/* GOTHWAD TECHNOLOGIES PVT. LTD.                */
/* Main JavaScript File                           */
/* Author: Gothwad Technologies Team             */
/* ============================================== */

/* ============================================== */
/* TABLE OF CONTENTS                              */
/* ============================================== */
/*
  1. GLOBAL VARIABLES & INITIALIZATION
  2. PRELOADER
  3. STICKY HEADER
  4. SMOOTH SCROLLING
  5. ACTIVE NAV LINK ON SCROLL
  6. COUNTER ANIMATION
  7. AOS INITIALIZATION
  8. PARTICLES.JS CONFIGURATION
  9. CONTACT DRAWER
  10. BACK TO TOP BUTTON
  11. PRICING TOGGLE
  12. FORM HANDLING
  13. NEWSLETTER SUBSCRIPTION
  14. MOBILE MENU
  15. TOOLTIPS & POPOVERS
  16. APP STORE TABS
  17. TESTIMONIAL SLIDER
  18. TYPING EFFECT
  19. LAZY LOADING IMAGES
  20. UTILITY FUNCTIONS
*/

'use strict';

/* ============================================== */
/* 1. GLOBAL VARIABLES & INITIALIZATION           */
/* ============================================== */

// DOM Elements
const DOM = {
    preloader: document.getElementById('preloader'),
    header: document.getElementById('main-header'),
    backToTop: document.getElementById('backToTop'),
    floatingContactBtn: document.getElementById('floatingContactBtn'),
    contactDrawer: document.getElementById('contactDrawer'),
    drawerClose: document.getElementById('drawerClose'),
    drawerOverlay: document.querySelector('.drawer-overlay'),
    contactForm: document.getElementById('contactForm'),
    quickContactForm: document.getElementById('quickContactForm'),
    newsletterForm: document.getElementById('newsletterForm'),
    billingToggle: document.getElementById('billingToggle'),
    navLinks: document.querySelectorAll('.navbar-nav .nav-link'),
    sections: document.querySelectorAll('section[id]'),
    counters: document.querySelectorAll('.stat-number[data-count]'),
    navbarToggler: document.querySelector('.navbar-toggler'),
    navbarCollapse: document.querySelector('.navbar-collapse')
};

// Configuration
const CONFIG = {
    scrollOffset: 100,
    headerScrollClass: 'scrolled',
    animationDuration: 1000,
    counterSpeed: 50,
    typingSpeed: 100,
    particlesEnabled: true
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Gothwad Technologies - Website Initialized');
    
    // Initialize all modules
    initPreloader();
    initStickyHeader();
    initSmoothScroll();
    initActiveNavLink();
    initCounterAnimation();
    initAOS();
    initParticles();
    initContactDrawer();
    initBackToTop();
    initPricingToggle();
    initFormHandling();
    initNewsletterForm();
    initMobileMenu();
    initTooltips();
    initAppStoreTabs();
    initLazyLoading();
    initTypingEffect();
});

/* ============================================== */
/* 2. PRELOADER                                   */
/* ============================================== */

function initPreloader() {
    const preloader = DOM.preloader;
    
    if (!preloader) return;
    
    // Hide preloader when page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('loaded');
            
            // Remove from DOM after animation
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 600);
        }, 500);
    });
    
    // Fallback: Hide preloader after 5 seconds
    setTimeout(function() {
        if (!preloader.classList.contains('loaded')) {
            preloader.classList.add('loaded');
        }
    }, 5000);
}

/* ============================================== */
/* 3. STICKY HEADER                               */
/* ============================================== */

function initStickyHeader() {
    const header = DOM.header;
    
    if (!header) return;
    
    let lastScroll = 0;
    let ticking = false;
    
    function updateHeader() {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > CONFIG.scrollOffset) {
            header.classList.add(CONFIG.headerScrollClass);
        } else {
            header.classList.remove(CONFIG.headerScrollClass);
        }
        
        // Hide/show header on scroll direction (optional)
        // if (currentScroll > lastScroll && currentScroll > 200) {
        //     header.style.transform = 'translateY(-100%)';
        // } else {
        //     header.style.transform = 'translateY(0)';
        // }
        
        lastScroll = currentScroll;
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
    
    // Initial check
    updateHeader();
}

/* ============================================== */
/* 4. SMOOTH SCROLLING                            */
/* ============================================== */

function initSmoothScroll() {
    // Get all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if just "#" or empty
            if (href === '#' || href === '') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerHeight = DOM.header ? DOM.header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight - 20;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
                
                // Update URL hash without jumping
                history.pushState(null, null, href);
            }
        });
    });
}

/* ============================================== */
/* 5. ACTIVE NAV LINK ON SCROLL                   */
/* ============================================== */

function initActiveNavLink() {
    const sections = DOM.sections;
    const navLinks = DOM.navLinks;
    
    if (!sections.length || !navLinks.length) return;
    
    function setActiveLink() {
        const scrollPosition = window.pageYOffset + 150;
        
        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Throttled scroll listener
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(setActiveLink);
    });
    
    // Initial check
    setActiveLink();
}

/* ============================================== */
/* 6. COUNTER ANIMATION                           */
/* ============================================== */

function initCounterAnimation() {
    const counters = DOM.counters;
    
    if (!counters.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = CONFIG.animationDuration;
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = function() {
            current += step;
            
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    }
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(function(counter) {
        observer.observe(counter);
    });
}

/* ============================================== */
/* 7. AOS INITIALIZATION                          */
/* ============================================== */

function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
            delay: 0,
            anchorPlacement: 'top-bottom',
            disable: function() {
                // Disable on mobile for better performance
                return window.innerWidth < 768;
            }
        });
        
        // Refresh AOS on window resize
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                AOS.refresh();
            }, 250);
        });
    }
}

/* ============================================== */
/* 8. PARTICLES.JS CONFIGURATION                  */
/* ============================================== */

function initParticles() {
    if (!CONFIG.particlesEnabled) return;
    
    const particlesContainer = document.getElementById('particles-js');
    
    if (!particlesContainer || typeof particlesJS === 'undefined') return;
    
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 50,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#0056B3'
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                }
            },
            opacity: {
                value: 0.3,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#0056B3',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.5
                    }
                },
                push: {
                    particles_nb: 3
                }
            }
        },
        retina_detect: true
    });
}

/* ============================================== */
/* 9. CONTACT DRAWER                              */
/* ============================================== */

function initContactDrawer() {
    const floatingBtn = DOM.floatingContactBtn;
    const drawer = DOM.contactDrawer;
    const closeBtn = DOM.drawerClose;
    const overlay = DOM.drawerOverlay;
    
    if (!floatingBtn || !drawer) return;
    
    // Open drawer
    floatingBtn.addEventListener('click', function() {
        openDrawer();
    });
    
    // Close drawer
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeDrawer();
        });
    }
    
    // Close on overlay click
    if (overlay) {
        overlay.addEventListener('click', function() {
            closeDrawer();
        });
    }
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && drawer.classList.contains('active')) {
            closeDrawer();
        }
    });
    
    function openDrawer() {
        drawer.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        const firstInput = drawer.querySelector('input, textarea');
        if (firstInput) {
            setTimeout(function() {
                firstInput.focus();
            }, 300);
        }
    }
    
    function closeDrawer() {
        drawer.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Expose functions globally
    window.openContactDrawer = openDrawer;
    window.closeContactDrawer = closeDrawer;
}

/* ============================================== */
/* 10. BACK TO TOP BUTTON                         */
/* ============================================== */

function initBackToTop() {
    const backToTop = DOM.backToTop;
    
    if (!backToTop) return;
    
    // Show/hide button based on scroll position
    function toggleBackToTop() {
        if (window.pageYOffset > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
    
    // Throttled scroll listener
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(toggleBackToTop);
    });
    
    // Scroll to top on click
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Initial check
    toggleBackToTop();
}

/* ============================================== */
/* 11. PRICING TOGGLE                             */
/* ============================================== */

function initPricingToggle() {
    const toggle = DOM.billingToggle;
    
    if (!toggle) return;
    
    const priceElements = document.querySelectorAll('.price-amount[data-monthly][data-yearly]');
    
    toggle.addEventListener('change', function() {
        const isYearly = this.checked;
        
        priceElements.forEach(function(priceEl) {
            const monthlyPrice = priceEl.getAttribute('data-monthly');
            const yearlyPrice = priceEl.getAttribute('data-yearly');
            
            // Animate price change
            priceEl.style.opacity = '0';
            priceEl.style.transform = 'translateY(-10px)';
            
            setTimeout(function() {
                priceEl.textContent = isYearly ? yearlyPrice : monthlyPrice;
                priceEl.style.opacity = '1';
                priceEl.style.transform = 'translateY(0)';
            }, 200);
        });
        
        // Update period text
        const periodElements = document.querySelectorAll('.price-period');
        periodElements.forEach(function(el) {
            el.textContent = isYearly ? '/year' : '/month';
        });
    });
}

/* ============================================== */
/* 12. FORM HANDLING                              */
/* ============================================== */

function initFormHandling() {
    // Main Contact Form
    const contactForm = DOM.contactForm;
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Quick Contact Form (Drawer)
    const quickForm = DOM.quickContactForm;
    
    if (quickForm) {
        quickForm.addEventListener('submit', handleQuickContactForm);
    }
}

async function handleContactForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    // Get form data
    const formData = {
        name: form.querySelector('#contactName').value,
        email: form.querySelector('#contactEmail').value,
        phone: form.querySelector('#contactPhone').value,
        service: form.querySelector('#contactService').value,
        subject: form.querySelector('#contactSubject').value,
        message: form.querySelector('#contactMessage').value,
        timestamp: new Date().toISOString()
    };
    
    // Validate
    if (!validateForm(formData)) {
        showNotification('Please fill all required fields correctly.', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
    
    try {
        // Send to Firebase (if configured)
        if (typeof sendToFirebase === 'function') {
            await sendToFirebase('contacts', formData);
        }
        
        // Simulate API call
        await simulateAPICall(1500);
        
        // Success
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        form.reset();
        
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('Failed to send message. Please try again.', 'error');
        
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

async function handleQuickContactForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    // Get form data
    const formData = {
        name: form.querySelector('#quickName').value,
        email: form.querySelector('#quickEmail').value,
        phone: form.querySelector('#quickPhone').value,
        message: form.querySelector('#quickMessage').value,
        source: 'Quick Contact Drawer',
        timestamp: new Date().toISOString()
    };
    
    // Validate
    if (!formData.name || !formData.email || !formData.message) {
        showNotification('Please fill all required fields.', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
    
    try {
        // Send to Firebase (if configured)
        if (typeof sendToFirebase === 'function') {
            await sendToFirebase('quick_contacts', formData);
        }
        
        // Simulate API call
        await simulateAPICall(1000);
        
        // Success
        showNotification('Message sent! We\'ll contact you shortly.', 'success');
        form.reset();
        
        // Close drawer after success
        setTimeout(function() {
            if (typeof closeContactDrawer === 'function') {
                closeContactDrawer();
            }
        }, 1500);
        
    } catch (error) {
        console.error('Quick form submission error:', error);
        showNotification('Failed to send. Please try again.', 'error');
        
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

function validateForm(data) {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!data.name || data.name.length < 2) return false;
    if (!data.email || !emailRegex.test(data.email)) return false;
    if (!data.message || data.message.length < 10) return false;
    
    return true;
}

function simulateAPICall(delay = 1000) {
    return new Promise(function(resolve) {
        setTimeout(resolve, delay);
    });
}

/* ============================================== */
/* 13. NEWSLETTER SUBSCRIPTION                    */
/* ============================================== */

function initNewsletterForm() {
    const forms = document.querySelectorAll('.newsletter-form, .newsletter-form-footer');
    
    forms.forEach(function(form) {
        form.addEventListener('submit', handleNewsletterSubmit);
    });
}

async function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    const email = emailInput.value.trim();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        emailInput.focus();
        return;
    }
    
    // Show loading
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
    
    try {
        // Send to Firebase (if configured)
        if (typeof sendToFirebase === 'function') {
            await sendToFirebase('newsletter', {
                email: email,
                subscribedAt: new Date().toISOString()
            });
        }
        
        // Simulate API call
        await simulateAPICall(800);
        
        // Success
        showNotification('Successfully subscribed! Welcome to Gothwad Technologies.', 'success');
        emailInput.value = '';
        
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        showNotification('Subscription failed. Please try again.', 'error');
        
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
    }
}

/* ============================================== */
/* 14. MOBILE MENU                                */
/* ============================================== */

function initMobileMenu() {
    const toggler = DOM.navbarToggler;
    const collapse = DOM.navbarCollapse;
    
    if (!toggler || !collapse) return;
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        const isClickInside = toggler.contains(e.target) || collapse.contains(e.target);
        
        if (!isClickInside && collapse.classList.contains('show')) {
            closeMobileMenu();
        }
    });
    
    // Close menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 992 && collapse.classList.contains('show')) {
            closeMobileMenu();
        }
    });
}

function closeMobileMenu() {
    const collapse = DOM.navbarCollapse;
    const toggler = DOM.navbarToggler;
    
    if (collapse && collapse.classList.contains('show')) {
        // Use Bootstrap's collapse method if available
        if (typeof bootstrap !== 'undefined') {
            const bsCollapse = bootstrap.Collapse.getInstance(collapse);
            if (bsCollapse) {
                bsCollapse.hide();
            }
        } else {
            collapse.classList.remove('show');
            if (toggler) {
                toggler.classList.add('collapsed');
                toggler.setAttribute('aria-expanded', 'false');
            }
        }
    }
}

/* ============================================== */
/* 15. TOOLTIPS & POPOVERS                        */
/* ============================================== */

function initTooltips() {
    // Initialize Bootstrap tooltips
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(function(tooltipTriggerEl) {
            new bootstrap.Tooltip(tooltipTriggerEl, {
                trigger: 'hover',
                placement: 'top'
            });
        });
        
        // Initialize Bootstrap popovers
        const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
        popoverTriggerList.forEach(function(popoverTriggerEl) {
            new bootstrap.Popover(popoverTriggerEl);
        });
    }
}

/* ============================================== */
/* 16. APP STORE TABS                             */
/* ============================================== */

function initAppStoreTabs() {
    const tabButtons = document.querySelectorAll('#appStoreTab .nav-link');
    
    if (!tabButtons.length) return;
    
    tabButtons.forEach(function(button) {
        button.addEventListener('shown.bs.tab', function(e) {
            // Refresh AOS animations for new content
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
            
            // Analytics tracking (if implemented)
            const tabName = e.target.textContent.trim();
            console.log('App Store Tab switched to:', tabName);
        });
    });
}

/* ============================================== */
/* 17. TESTIMONIAL SLIDER                         */
/* ============================================== */

function initTestimonialSlider() {
    // If using a slider library like Swiper or Slick
    // Initialize it here
    
    const slider = document.querySelector('.testimonial-slider');
    
    if (!slider) return;
    
    // Example with native scroll snap (no library needed)
    // The CSS handles the snap behavior
    
    // Auto-play functionality (optional)
    // let currentSlide = 0;
    // const slides = slider.querySelectorAll('.testimonial-card');
    // const totalSlides = slides.length;
    
    // setInterval(() => {
    //     currentSlide = (currentSlide + 1) % totalSlides;
    //     // Scroll to next slide
    // }, 5000);
}

/* ============================================== */
/* 18. TYPING EFFECT                              */
/* ============================================== */

function initTypingEffect() {
    const typingElements = document.querySelectorAll('[data-typing]');
    
    if (!typingElements.length) return;
    
    typingElements.forEach(function(element) {
        const text = element.getAttribute('data-typing');
        const words = text.split(',').map(function(word) {
            return word.trim();
        });
        
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;
        
        function type() {
            const currentWord = words[wordIndex];
            
            if (isPaused) {
                setTimeout(type, 1500);
                isPaused = false;
                isDeleting = true;
                return;
            }
            
            if (isDeleting) {
                element.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                
                if (charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                }
            } else {
                element.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                
                if (charIndex === currentWord.length) {
                    isPaused = true;
                }
            }
            
            const typingSpeed = isDeleting ? CONFIG.typingSpeed / 2 : CONFIG.typingSpeed;
            setTimeout(type, typingSpeed);
        }
        
        type();
    });
}

/* ============================================== */
/* 19. LAZY LOADING IMAGES                        */
/* ============================================== */

function initLazyLoading() {
    // Native lazy loading is supported in modern browsers
    // This is a fallback for older browsers
    
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(function(img) {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback to Intersection Observer
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if (!lazyImages.length) return;
        
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });
        
        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    }
}

/* ============================================== */
/* 20. UTILITY FUNCTIONS                          */
/* ============================================== */

// Show notification/toast
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.custom-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `custom-notification notification-${type}`;
    
    // Icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle-fill';
    if (type === 'error') icon = 'exclamation-circle-fill';
    if (type === 'warning') icon = 'exclamation-triangle-fill';
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="bi bi-${icon}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="bi bi-x"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        max-width: 400px;
        padding: 16px 20px;
        background: ${type === 'success' ? '#28A745' : type === 'error' ? '#DC3545' : type === 'warning' ? '#FFC107' : '#17A2B8'};
        color: ${type === 'warning' ? '#212529' : '#FFFFFF'};
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        z-index: 99999;
        animation: slideInRight 0.3s ease;
        font-family: 'Inter', sans-serif;
    `;
    
    // Add animation keyframes
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100px);
                }
            }
            .custom-notification .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .custom-notification .notification-content i {
                font-size: 20px;
            }
            .custom-notification .notification-close {
                background: rgba(255,255,255,0.2);
                border: none;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: inherit;
                transition: background 0.2s;
            }
            .custom-notification .notification-close:hover {
                background: rgba(255,255,255,0.3);
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Append to body
    document.body.appendChild(notification);
    
    // Close button handler
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        removeNotification(notification);
    });
    
    // Auto remove after 5 seconds
    setTimeout(function() {
        removeNotification(notification);
    }, 5000);
}

function removeNotification(notification) {
    if (notification && notification.parentNode) {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(function() {
            notification.remove();
        }, 300);
    }
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = function() {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(function() {
                inThrottle = false;
            }, limit);
        }
    };
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Get current year (for copyright)
function getCurrentYear() {
    return new Date().getFullYear();
}

// Update copyright year dynamically
(function updateCopyrightYear() {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = getCurrentYear();
    
    yearElements.forEach(function(el) {
        el.textContent = currentYear;
    });
})();

/* ============================================== */
/* ADDITIONAL INTERACTIVE FEATURES               */
/* ============================================== */

// App card hover effect
document.addEventListener('DOMContentLoaded', function() {
    const appCards = document.querySelectorAll('.app-card');
    
    appCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Get button click handlers
document.addEventListener('DOMContentLoaded', function() {
    const getButtons = document.querySelectorAll('.btn-get');
    
    getButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const appCard = this.closest('.app-card');
            const appName = appCard ? appCard.querySelector('.app-name').textContent : 'App';
            
            showNotification(`${appName} - Redirecting to download page...`, 'info');
            
            // Redirect or open modal here
            setTimeout(function() {
                // window.location.href = '/download/' + appName.toLowerCase().replace(/\s+/g, '-');
                console.log('Download:', appName);
            }, 1000);
        });
    });
});

// Parallax effect for hero section
document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('.hero-section');
    
    if (!heroSection) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = heroSection.querySelectorAll('.phone-mockup');
        
        parallaxElements.forEach(function(el, index) {
            const speed = 0.1 + (index * 0.05);
            el.style.transform = `translateY(${scrolled * speed}px) rotate(${el.classList.contains('phone-primary') ? -5 : 8}deg)`;
        });
    });
});

// Console branding
console.log('%c🚀 Gothwad Technologies Pvt. Ltd.', 'font-size: 24px; font-weight: bold; color: #0056B3;');
console.log('%cBuilding the Future of Software', 'font-size: 14px; color: #6C757D;');
console.log('%cFounded by Pawan Gothwad', 'font-size: 12px; color: #6C757D;');
console.log('%c---', 'color: #ccc;');
console.log('%cInterested in working with us? Visit: https://gothwadtech.com/careers', 'font-size: 12px; color: #28A745;');

/* ============================================== */
/* EXPORT FUNCTIONS (if using modules)            */
/* ============================================== */

// For ES6 modules support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        debounce,
        throttle,
        formatNumber,
        isInViewport
    };
}

/* ============================================== */
/* END OF SCRIPT.JS                               */
/* ============================================== */
