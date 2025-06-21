
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Initialize Capacitor custom elements
defineCustomElements(window);

// Check for mobile platform
const isMobileApp = window.location.href.includes('capacitor://') || 
                   window.location.href.includes('localhost') || 
                   navigator.userAgent.includes('Android') || 
                   navigator.userAgent.includes('iPhone');

if (isMobileApp) {
  console.log("Running in mobile environment");
  
  // Add mobile-specific initialization here if needed
  document.addEventListener('deviceready', () => {
    console.log("Capacitor device is ready");
  }, false);
}

// Error boundary for the entire application
const renderApp = () => {
  try {
    const rootElement = document.getElementById("root");
    
    if (!rootElement) {
      console.error("Root element not found!");
      return;
    }
    
    createRoot(rootElement).render(<App />);
    
    console.log("Application rendered successfully");
  } catch (error) {
    console.error("Failed to render application:", error);
    
    // Display fallback UI in case of critical error
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center; direction: rtl;">
          <h2>حدث خطأ غير متوقع</h2>
          <p>نعتذر عن هذا الخطأ. يرجى تحديث الصفحة وإعادة المحاولة.</p>
          <button onclick="window.location.reload()" style="padding: 8px 16px; background: #2AA8E0; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">
            إعادة تحميل الصفحة
          </button>
        </div>
      `;
    }
  }
};

// Initialize the app
renderApp();
