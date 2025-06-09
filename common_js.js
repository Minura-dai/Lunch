// Global variables
let currentUser = {
  id: null,
  name: null
};

// Prevent duplicate submissions
let isProcessing = false;
let lastActionTime = 0;

// Debounce function to prevent double clicks
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Prevent rapid successive calls
function canExecuteAction() {
  const now = Date.now();
  if (isProcessing || (now - lastActionTime) < 1000) {
    console.log("Action blocked - too soon or already processing");
    return false;
  }
  lastActionTime = now;
  isProcessing = true;
  return true;
}

function resetProcessingState() {
  isProcessing = false;
}

// Initialize current user from session storage
function initializeUser() {
  const storedId = sessionStorage.getItem("employeeId");
  const storedName = sessionStorage.getItem("employeeName");
  
  if (storedId && storedName) {
    currentUser.id = storedId;
    currentUser.name = storedName;
    return true;
  }
  return false;
}

// Check if user is logged in, redirect to login if not
function requireLogin() {
  if (!initializeUser()) {
    window.location.href = "index.html";
    return false;
  }
  return true;
}

// Update user names in all relevant elements
function updateUserNames() {
  const nameElements = document.querySelectorAll('[data-user-name]');
  
  nameElements.forEach(element => {
    element.textContent = currentUser.name || "";
  });
}

// Utility functions
function showStatusMessage(elementId, message, type) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  element.innerHTML = `<div class="status ${type}">${message}</div>`;
}

function formatDateJapanese(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
}

function parseDateJapanese(dateStr) {
  const parts = dateStr.replace(/年|月/g, '/').replace('日', '').split('/');
  return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
}

function logout() {
  currentUser.id = null;
  currentUser.name = null;
  sessionStorage.clear();
  window.location.href = "index.html";
}

// Collect orders from table
function collectOrdersFromTable(tableBodyId) {
  const tbody = document.getElementById(tableBodyId);
  const rows = tbody.querySelectorAll("tr");
  const orders = [];

  rows.forEach(row => {
    const date = row.children[0].textContent.trim();
    const selectedRadio = row.querySelector("input[type=radio]:checked");
    if (selectedRadio) {
      orders.push({ 
        date: date, 
        order: selectedRadio.value 
      });
    }
  });

  return orders;
}