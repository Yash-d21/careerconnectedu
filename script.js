/**
 * Career Connect Educational Consultancy LLP - Landing Page Script
 * Functions: Sticky Header, Mobile Navigation Menu, Scroll Animations, Count-up Stats, Form validation
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Sticky Navigation & Active Link Highlight
    // ==========================================
    const header = document.querySelector('.header-nav');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        // Sticky Header effect
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Active Nav Link highlight on scroll
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 150; // Offset for header height
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================
    // 2. Mobile Menu Toggle
    // ==========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const links = document.querySelectorAll('.nav-menu .nav-link, .nav-menu .btn');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            // Toggle body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking nav links
        links.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ==========================================
    // 3. Scroll Reveal Animations (Intersection Observer)
    // ==========================================
    const animatedElements = document.querySelectorAll('.scroll-animate');
    const staggeredCards = document.querySelectorAll('.stagger-card');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animates once
            }
        });
    }, revealOptions);
    
    animatedElements.forEach(element => {
        revealObserver.observe(element);
    });
    
    // Stagger animation for grid cards
    const staggerObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Apply a minor delay to each intersecting card
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 120);
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    staggeredCards.forEach(card => {
        staggerObserver.observe(card);
    });

    // ==========================================
    // 4. Statistics Count-Up Animation
    // ==========================================
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedStats = false;
    
    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const suffix = stat.getAttribute('data-suffix') || '';
            const duration = 2000; // 2 seconds animation
            const startTime = performance.now();
            
            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out quad formula
                const easeProgress = progress * (2 - progress);
                const currentValue = Math.floor(easeProgress * target);
                
                stat.innerText = currentValue + suffix;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.innerText = target + suffix;
                }
            };
            
            requestAnimationFrame(updateCounter);
        });
    };
    
    if (statsSection && statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animatedStats) {
                    animateStats();
                    animatedStats = true; // Run only once
                }
            });
        }, { threshold: 0.3 });
        
        statsObserver.observe(statsSection);
    }

    // ==========================================
    // 5. Contact Form Submission & Validation
    // ==========================================
    const contactForm = document.getElementById('consultingForm');
    const formContainer = document.getElementById('formContainer');
    const successContainer = document.getElementById('successContainer');
    const successStudentName = document.getElementById('successStudentName');
    
    if (contactForm && formContainer && successContainer) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Extract inputs
            const nameInput = document.getElementById('studentName');
            const mobileInput = document.getElementById('mobileNumber');
            const emailInput = document.getElementById('emailAddress');
            const courseInput = document.getElementById('interestedCourse');
            
            // Simple validation check
            let isValid = true;
            
            // Name check
            if (!nameInput.value.trim()) {
                showInputError(nameInput, 'Please enter your name');
                isValid = false;
            } else {
                clearInputError(nameInput);
            }
            
            // Mobile check (Indian standard length 10 digits)
            const mobileReg = /^[6-9]\d{9}$/;
            if (!mobileInput.value.trim() || !mobileReg.test(mobileInput.value.trim().replace(/[-\s]/g, ''))) {
                showInputError(mobileInput, 'Please enter a valid 10-digit mobile number');
                isValid = false;
            } else {
                clearInputError(mobileInput);
            }
            
            // Email check
            const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value.trim() && !emailReg.test(emailInput.value.trim())) {
                showInputError(emailInput, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearInputError(emailInput);
            }
            
            // Course check
            if (!courseInput.value) {
                showInputError(courseInput, 'Please select a course');
                isValid = false;
            } else {
                clearInputError(courseInput);
            }
            
            if (isValid) {
                // Animate to success state
                formContainer.style.opacity = '0';
                setTimeout(() => {
                    formContainer.style.display = 'none';
                    successContainer.style.display = 'block';
                    successContainer.style.opacity = '1';
                    if (successStudentName) {
                        successStudentName.innerText = nameInput.value.trim();
                    }
                }, 300);
            }
        });
        
        // Helper functions for validation styling
        function showInputError(input, message) {
            let errorElement = input.parentElement.querySelector('.error-text');
            input.style.borderColor = '#ef4444';
            
            if (!errorElement) {
                errorElement = document.createElement('span');
                errorElement.className = 'error-text';
                errorElement.style.color = '#ef4444';
                errorElement.style.fontSize = '0.75rem';
                errorElement.style.marginTop = '0.25rem';
                errorElement.style.display = 'block';
                input.parentElement.appendChild(errorElement);
            }
            errorElement.innerText = message;
        }
        
        function clearInputError(input) {
            input.style.borderColor = '';
            const errorElement = input.parentElement.querySelector('.error-text');
            if (errorElement) {
                errorElement.remove();
            }
        }
    }
    
    // Add reset button action on success container
    const successResetBtn = document.getElementById('successResetBtn');
    if (successResetBtn) {
        successResetBtn.addEventListener('click', () => {
            contactForm.reset();
            successContainer.style.display = 'none';
            formContainer.style.display = 'block';
            formContainer.style.opacity = '1';
        });
    }
});
