// Mobile Menu Toggle
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    // Toggle Nav
    nav.classList.toggle('nav-active');
    
    // Animate Links
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
    
    // Burger Animation
    burger.classList.toggle('toggle');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !burger.contains(e.target) && nav.classList.contains('nav-active')) {
        nav.classList.remove('nav-active');
        burger.classList.remove('toggle');
    }
});

// Admin functionality
let token = localStorage.getItem('adminToken');
const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
const adminDashboard = document.getElementById('adminDashboard');
const mainContent = document.querySelectorAll('section');
const contactsContainer = document.getElementById('contacts');

// Check if admin is logged in
if (token) {
    showAdminDashboard();
    fetchContacts();
}

// Login Form Handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            token = data.token;
            localStorage.setItem('adminToken', token);
            loginModal.hide();
            showAdminDashboard();
            fetchContacts();
        } else {
            alert('Invalid credentials');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Login failed');
    }
});

// Logout Handler
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    token = null;
    hideAdminDashboard();
});

function showAdminDashboard() {
    mainContent.forEach(section => section.style.display = 'none');
    adminDashboard.style.display = 'block';
    document.querySelector('header').style.display = 'none';
}

function hideAdminDashboard() {
    mainContent.forEach(section => section.style.display = 'block');
    adminDashboard.style.display = 'none';
    document.querySelector('header').style.display = 'flex';
}

// Fetch Contacts
async function fetchContacts() {
    try {
        const response = await fetch('/api/contacts', {
            headers: {
                'Authorization': token
            }
        });
        const contacts = await response.json();
        displayContacts(contacts);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Display Contacts
function displayContacts(contacts) {
    contactsContainer.innerHTML = contacts.map(contact => `
        <div class="card contact-card ${!contact.isRead ? 'unread' : ''} mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="card-title">${contact.name}</h5>
                    <small class="text-muted">${new Date(contact.createdAt).toLocaleString()}</small>
                </div>
                <h6 class="card-subtitle mb-2 text-muted">${contact.email} | ${contact.phone || 'No phone'}</h6>
                <p class="card-text"><strong>Solution:</strong> ${contact.solution}</p>
                <p class="card-text">${contact.message}</p>
                ${!contact.isRead ? `
                    <button class="btn btn-sm btn-primary mark-read" data-id="${contact._id}">
                        Mark as Read
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');

    // Add event listeners for "Mark as Read" buttons
    document.querySelectorAll('.mark-read').forEach(button => {
        button.addEventListener('click', async () => {
            const id = button.dataset.id;
            try {
                const response = await fetch(`/api/contacts/${id}/read`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': token
                    }
                });
                if (response.ok) {
                    fetchContacts();
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });
}

// Contact Form Handler
document.querySelector('#contact form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        name: e.target.querySelector('input[type="text"]').value,
        email: e.target.querySelector('input[type="email"]').value,
        phone: e.target.querySelector('input[type="tel"]').value,
        solution: e.target.querySelector('select').value,
        message: e.target.querySelector('textarea').value
    };

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Message sent successfully!');
            e.target.reset();
        } else {
            alert('Failed to send message. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form Submission Handler
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to your server
        console.log('Form submitted:', data);
        
        // Show success message
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
}

// Add scroll event listener for header
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll) {
        // Scrolling down
        header.style.transform = 'translateY(-80px)';
    } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Add animation to feature cards on scroll
const featureCards = document.querySelectorAll('.feature-card');
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

featureCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// Analytics Tracking
const API_URL = 'http://localhost:3000/api';

// Track page view
function trackPageView() {
    const data = {
        eventType: 'pageview',
        page: window.location.pathname,
        userAgent: navigator.userAgent,
        ipAddress: '' // This would be set by the server
    };

    fetch(`${API_URL}/analytics`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).catch(error => console.error('Error tracking page view:', error));
}

// Track link clicks
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
        const data = {
            eventType: 'click',
            page: window.location.pathname,
            userAgent: navigator.userAgent,
            ipAddress: '' // This would be set by the server
        };

        fetch(`${API_URL}/analytics`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).catch(error => console.error('Error tracking click:', error));
    });
});

// Track form submissions
if (contactForm) {
    contactForm.addEventListener('submit', function() {
        const data = {
            eventType: 'form_submit',
            page: window.location.pathname,
            userAgent: navigator.userAgent,
            ipAddress: '' // This would be set by the server
        };

        fetch(`${API_URL}/analytics`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).catch(error => console.error('Error tracking form submission:', error));
    });
}

// Track initial page view
trackPageView(); 