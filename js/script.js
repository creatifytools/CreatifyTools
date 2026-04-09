/* ========================================
   CreatifyTools - Main JavaScript
   Handles UI interactions and utilities
   ======================================== */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  
  // ========== MOBILE MENU TOGGLE ==========
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function() {
      navLinks.classList.toggle('show');
    });
    
    // Close menu when clicking a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
      });
    });
  }
  
  // ========== TOOLS NAVIGATION ==========
  const toolsNavLink = document.getElementById('toolsNavLink');
  if (toolsNavLink) {
    toolsNavLink.addEventListener('click', (e) => {
      e.preventDefault();
      const firstSection = document.querySelector('.section-title');
      if (firstSection) {
        const offset = 80;
        const elementPosition = firstSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  }
  
  // ========== SCROLL ANIMATIONS ==========
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Animate cards on scroll
  document.querySelectorAll('.tool-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
    observer.observe(card);
  });
  
  // ========== SHORTLINK UTILITY FUNCTION ==========
  window.redirectToShortlink = function(fileData, filename, toolName) {
    // Store file data in sessionStorage for download.html
    sessionStorage.setItem('creatify_download_data', JSON.stringify({
      dataUrl: fileData,
      filename: filename,
      tool: toolName,
      timestamp: Date.now()
    }));
    
    // Shortlink placeholder - Replace with actual shortlink URL
    const shortlinkUrl = 'https://example.com/link?tool=' + encodeURIComponent(toolName);
    
    // Redirect to shortlink
    window.location.href = shortlinkUrl;
  };
  
  // ========== INSTAGRAM DOWNLOADER HANDLER ==========
  window.handleInstagramDownload = function(reelUrl) {
    if (!reelUrl || !reelUrl.includes('instagram.com/reel/')) {
      alert('Please enter a valid Instagram Reel URL');
      return false;
    }
    
    // Store target for after shortlink
    sessionStorage.setItem('creatify_instagram_target', 'https://snapinsta.app');
    
    // Redirect to shortlink
    const shortlinkUrl = 'https://example.com/link?tool=instagram';
    window.location.href = shortlinkUrl;
    return true;
  };
  
  // Check if coming from shortlink redirect for Instagram
  if (sessionStorage.getItem('creatify_instagram_target')) {
    const target = sessionStorage.getItem('creatify_instagram_target');
    sessionStorage.removeItem('creatify_instagram_target');
    window.location.href = target;
  }
  
  // ========== FORM VALIDATION (Contact Page) ==========
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const sendBtn = contactForm.querySelector('button');
    if (sendBtn) {
      sendBtn.addEventListener('click', function() {
        const name = document.getElementById('name')?.value || '';
        const email = document.getElementById('email')?.value || '';
        const message = document.getElementById('msg')?.value || '';
        
        if (!name.trim() || !email.trim() || !message.trim()) {
          alert('Please fill in all fields');
          return;
        }
        
        if (!email.includes('@') || !email.includes('.')) {
          alert('Please enter a valid email address');
          return;
        }
        
        alert('Thanks for reaching out! We\'ll respond soon.');
        // Clear form
        if (document.getElementById('name')) document.getElementById('name').value = '';
        if (document.getElementById('email')) document.getElementById('email').value = '';
        if (document.getElementById('msg')) document.getElementById('msg').value = '';
      });
    }
  }
  
  // ========== LOADING ANIMATION HELPER ==========
  window.showLoading = function(elementId) {
    const loader = document.getElementById(elementId);
    if (loader) loader.style.display = 'block';
  };
  
  window.hideLoading = function(elementId) {
    const loader = document.getElementById(elementId);
    if (loader) loader.style.display = 'none';
  };
  
  // ========== TOOL SPECIFIC HELPERS ==========
  
  // Image compression helper
  window.compressImage = function(file, quality, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        callback(compressedDataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };
  
  // Password generator helper
  window.generateSecurePassword = function(length, options) {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+[]{}<>?';
    
    let chars = '';
    if (options.uppercase) chars += upper;
    if (options.lowercase) chars += lower;
    if (options.numbers) chars += numbers;
    if (options.symbols) chars += symbols;
    
    if (!chars) return 'Select at least one option';
    
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    return password;
  };
  
  // QR Code helper note - QR library will be loaded separately
  console.log('CreatifyTools - Script loaded successfully');
});

// ========== DOWNLOAD PAGE HANDLER ==========
// This runs on download.html
if (window.location.pathname.includes('download.html')) {
  (async function() {
    let blobData = null;
    let fileName = 'download.file';
    
    try {
      const stored = sessionStorage.getItem('creatify_download_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.dataUrl) {
          const response = await fetch(parsed.dataUrl);
          blobData = await response.blob();
          fileName = parsed.filename || 'download.file';
        }
      }
    } catch(e) {
      console.warn('Error retrieving download data:', e);
    }
    
    const finalDownloadBtn = document.getElementById('finalDownloadBtn');
    if (finalDownloadBtn) {
      finalDownloadBtn.addEventListener('click', function() {
        if (blobData) {
          const url = URL.createObjectURL(blobData);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          sessionStorage.removeItem('creatify_download_data');
        } else {
          alert('Your file is ready! Download will start shortly.');
        }
      });
    }
  })();
}