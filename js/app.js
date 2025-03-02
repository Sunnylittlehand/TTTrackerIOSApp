// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);

// Global variables
let currentDate = new Date();
let regularMembers = [
    'Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5',
    'Player 6', 'Player 7', 'Player 8', 'Player 9', 'Player 10',
    'Player 11', 'Player 12', 'Player 13', 'Player 14', 'Player 15'
];
let adhocMembers = ['', '', '']; // Empty slots for ad-hoc signups

// Main initialization function
function initApp() {
    // Set the current date to the next Saturday if today is not Saturday
    setToNextSaturday();
    
    // Update the date display
    updateDateDisplay();
    
    // Render the member cards
    renderMemberCards();
    
    // Add event listeners
    document.getElementById('prev-date').addEventListener('click', navigateDate.bind(null, -7));
    document.getElementById('next-date').addEventListener('click', navigateDate.bind(null, 7));
    document.getElementById('save-btn').addEventListener('click', saveAttendance);
    document.getElementById('history-btn').addEventListener('click', showHistory);
    
    // Close modal when clicking the X
    document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('history-modal').style.display = 'none';
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('history-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Load today's attendance if available
    loadAttendance();
}

// Set the current date to the next Saturday
function setToNextSaturday() {
    const day = currentDate.getDay(); // 0 is Sunday, 6 is Saturday
    
    // If today is not Saturday (6), adjust to the next Saturday
    if (day !== 6) {
        const daysUntilSaturday = (6 - day + 7) % 7;
        currentDate.setDate(currentDate.getDate() + daysUntilSaturday);
    }
    
    // Reset time to midnight
    currentDate.setHours(0, 0, 0, 0);
}

// Update the date display in the header
function updateDateDisplay() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = currentDate.toLocaleDateString('en-US', options);
    document.getElementById('current-date').textContent = dateString;
}

// Navigate to previous or next date
function navigateDate(days) {
    currentDate.setDate(currentDate.getDate() + days);
    updateDateDisplay();
    loadAttendance();
}

// Render member cards for both regular and ad-hoc members
function renderMemberCards() {
    const regularContainer = document.getElementById('regular-members');
    const adhocContainer = document.getElementById('adhoc-members');
    
    // Clear existing content
    regularContainer.innerHTML = '';
    adhocContainer.innerHTML = '';
    
    // Render regular member cards
    regularMembers.forEach((name, index) => {
        const card = document.createElement('div');
        card.className = 'member-card';
        card.dataset.index = index;
        card.dataset.type = 'regular';
        card.textContent = name;
        
        card.addEventListener('click', toggleAttendance);
        regularContainer.appendChild(card);
    });
    
    // Render ad-hoc member cards/inputs
    adhocMembers.forEach((name, index) => {
        const card = document.createElement('div');
        card.className = 'member-card';
        card.dataset.index = index;
        card.dataset.type = 'adhoc';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'adhoc-input';
        input.placeholder = 'Guest name';
        input.value = name;
        input.addEventListener('input', updateAdhocMember);
        
        card.appendChild(input);
        card.addEventListener('click', function(e) {
            if (e.target !== input) {
                toggleAttendance.call(this, e);
            }
        });
        
        adhocContainer.appendChild(card);
    });
    
    updateAttendanceCount();
}

// Toggle attendance status when clicking a member card
function toggleAttendance(event) {
    this.classList.toggle('present');
    updateAttendanceCount();
}

// Update ad-hoc member name when input changes
function updateAdhocMember(event) {
    const index = parseInt(this.parentElement.dataset.index);
    adhocMembers[index] = this.value;
}

// Update the attendance count display
function updateAttendanceCount() {
    const presentCount = document.querySelectorAll('.member-card.present').length;
    document.getElementById('present-count').textContent = presentCount;
}

// Save attendance data to local storage
function saveAttendance() {
    const dateKey = formatDateKey(currentDate);
    const attendanceData = {
        date: currentDate.toISOString(),
        regularAttendance: [],
        adhocAttendance: []
    };
    
    // Collect regular member attendance
    document.querySelectorAll('#regular-members .member-card').forEach((card, index) => {
        attendanceData.regularAttendance.push({
            name: regularMembers[index],
            present: card.classList.contains('present')
        });
    });
    
    // Collect ad-hoc member attendance
    document.querySelectorAll('#adhoc-members .member-card').forEach((card, index) => {
        const name = adhocMembers[index];
        if (name.trim() !== '') {
            attendanceData.adhocAttendance.push({
                name: name,
                present: card.classList.contains('present')
            });
        }
    });
    
    // Save to local storage
    const allAttendance = JSON.parse(localStorage.getItem('tabletennis-attendance') || '{}');
    allAttendance[dateKey] = attendanceData;
    localStorage.setItem('tabletennis-attendance', JSON.stringify(allAttendance));
    
    // Show confirmation
    alert('Attendance saved successfully!');
}

// Load attendance data for the current date
function loadAttendance() {
    const dateKey = formatDateKey(currentDate);
    const allAttendance = JSON.parse(localStorage.getItem('tabletennis-attendance') || '{}');
    const attendanceData = allAttendance[dateKey];
    
    // Reset all cards
    document.querySelectorAll('.member-card').forEach(card => {
        card.classList.remove('present');
    });
    
    // Reset ad-hoc members
    adhocMembers = ['', '', ''];
    
    if (attendanceData) {
        // Set regular member attendance
        attendanceData.regularAttendance.forEach((member, index) => {
            if (member.present) {
                const card = document.querySelector(`#regular-members .member-card[data-index="${index}"]`);
                if (card) card.classList.add('present');
            }
        });
        
        // Set ad-hoc member attendance
        attendanceData.adhocAttendance.forEach((member, index) => {
            if (index < 3) {
                adhocMembers[index] = member.name;
                const card = document.querySelector(`#adhoc-members .member-card[data-index="${index}"]`);
                if (card) {
                    card.querySelector('input').value = member.name;
                    if (member.present) card.classList.add('present');
                }
            }
        });
    }
    
    updateAttendanceCount();
}

// Show attendance history
function showHistory() {
    const historyContent = document.getElementById('history-content');
    historyContent.innerHTML = '';
    
    const allAttendance = JSON.parse(localStorage.getItem('tabletennis-attendance') || '{}');
    const dates = Object.keys(allAttendance).sort().reverse();
    
    if (dates.length === 0) {
        historyContent.innerHTML = '<p>No attendance records found.</p>';
    } else {
        dates.forEach(dateKey => {
            const data = allAttendance[dateKey];
            const date = new Date(data.date);
            const dateString = date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            const presentRegular = data.regularAttendance.filter(m => m.present).map(m => m.name);
            const presentAdhoc = data.adhocAttendance.filter(m => m.present).map(m => m.name);
            const totalPresent = presentRegular.length + presentAdhoc.length;
            
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <h3>${dateString}</h3>
                <p>Total Attendance: ${totalPresent}/18</p>
                <details>
                    <summary>View Details</summary>
                    <div class="attendance-details">
                        <h4>Regular Members (${presentRegular.length}/15)</h4>
                        <ul>${presentRegular.map(name => `<li>${name}</li>`).join('')}</ul>
                        ${presentAdhoc.length > 0 ? `
                            <h4>Ad-hoc Members (${presentAdhoc.length}/3)</h4>
                            <ul>${presentAdhoc.map(name => `<li>${name}</li>`).join('')}</ul>
                        ` : ''}
                    </div>
                </details>
            `;
            
            historyContent.appendChild(historyItem);
        });
    }
    
    document.getElementById('history-modal').style.display = 'block';
}

// Format date as a string key for storage
function formatDateKey(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

// Function to edit regular member names
function editMemberNames() {
    const newNames = prompt('Enter the names of your 15 regular members, separated by commas:');
    if (newNames) {
        const nameArray = newNames.split(',').map(name => name.trim());
        if (nameArray.length === 15) {
            regularMembers = nameArray;
            localStorage.setItem('tabletennis-members', JSON.stringify(regularMembers));
            renderMemberCards();
        } else {
            alert('Please enter exactly 15 names.');
        }
    }
}

// Load saved member names if available
const savedMembers = localStorage.getItem('tabletennis-members');
if (savedMembers) {
    regularMembers = JSON.parse(savedMembers);
}

// Add service worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
} 
