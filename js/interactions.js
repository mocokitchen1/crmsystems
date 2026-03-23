/**
 * interactions.js
 * Logic for managing customer interaction logs.
 */

document.addEventListener('DOMContentLoaded', () => {
    loadCustomersToSelect();
    loadInteractions();
    
    // Handle form submission
    document.getElementById('interactionForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveInteraction();
    });
});

function loadCustomersToSelect() {
    const customers = StorageService.getCustomers();
    const select = document.getElementById('intCustomer');
    select.innerHTML = '<option value="">Select Customer</option>';
    
    customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;
        option.textContent = customer.name;
        select.appendChild(option);
    });
}

function loadInteractions() {
    const interactions = StorageService.getInteractions();
    const customers = StorageService.getCustomers();
    const timeline = document.getElementById('interactionTimeline');
    timeline.innerHTML = '';

    // Sort by date descending
    interactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (interactions.length === 0) {
        timeline.innerHTML = '<p style="text-align: center; color: var(--text-muted); margin-top: 50px;">No interactions logged yet.</p>';
        return;
    }

    interactions.forEach(int => {
        const customer = customers.find(c => c.id === int.customerId);
        
        const card = document.createElement('div');
        card.className = 'stat-card';
        card.style.marginBottom = '16px';
        card.style.borderLeft = `4px solid ${getInteractionColor(int.type)}`;
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <div>
                    <span style="font-weight: 600; font-size: 1.1rem; color: var(--primary-color);">${int.type}</span>
                    <span style="color: var(--text-muted); margin: 0 8px;">with</span>
                    <span style="font-weight: 500;">${customer ? customer.name : 'Unknown Customer'}</span>
                </div>
                <div style="color: var(--text-muted); font-size: 0.8rem;">
                    ${new Date(int.createdAt).toLocaleString()}
                </div>
            </div>
            <div style="font-size: 0.95rem; line-height: 1.5; color: var(--text-main);">
                ${int.notes}
            </div>
            <div style="display: flex; justify-content: flex-end; margin-top: 12px;">
                <button class="btn btn-sm btn-danger" onclick="deleteInteraction('${int.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        timeline.appendChild(card);
    });
}

function getInteractionColor(type) {
    switch (type) {
        case 'Call': return '#3b82f6'; // Blue
        case 'WhatsApp': return '#10b981'; // Green
        case 'Meeting': return '#f59e0b'; // Orange
        case 'Email': return '#6366f1'; // Indigo
        default: return '#6b7280'; // Gray
    }
}

function openModal() {
    const modal = document.getElementById('interactionModal');
    const form = document.getElementById('interactionForm');
    form.reset();
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('interactionModal').style.display = 'none';
}

function saveInteraction() {
    const interactionData = {
        customerId: document.getElementById('intCustomer').value,
        type: document.getElementById('intType').value,
        notes: document.getElementById('intNotes').value
    };

    StorageService.saveInteraction(interactionData);
    closeModal();
    loadInteractions();
}

function deleteInteraction(id) {
    if (confirm('Are you sure you want to delete this log entry?')) {
        StorageService.deleteInteraction(id);
        loadInteractions();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('interactionModal');
    if (event.target == modal) {
        closeModal();
    }
};
