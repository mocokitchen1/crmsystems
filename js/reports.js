/**
 * reports.js
 * Logic for generating reports and charts.
 */

document.addEventListener('DOMContentLoaded', () => {
    loadReportStats();
    renderCharts();
    loadTopCustomers();
});

function loadReportStats() {
    const deals = StorageService.getDeals();
    const stats = StorageService.getStats();
    
    document.getElementById('rep-total-revenue').textContent = `R ${stats.totalRevenue.toLocaleString()}`;
    document.getElementById('rep-deals-won').textContent = stats.completedSales;
    
    const enquiries = deals.filter(d => d.status === 'New Enquiry').length;
    document.getElementById('rep-enquiries').textContent = enquiries;
    
    const totalDeals = deals.length;
    const conversionRate = totalDeals > 0 ? (stats.completedSales / totalDeals * 100).toFixed(1) : 0;
    document.getElementById('rep-conversion-rate').textContent = `${conversionRate}%`;
}

function renderCharts() {
    const deals = StorageService.getDeals();
    const interactions = StorageService.getInteractions();
    
    // Deals by Stage Chart
    const stages = ['New Enquiry', 'Proposal Sent', 'Order Confirmed', 'In Preparation', 'Delivered', 'Payment Received', 'Closed Won', 'Closed Lost'];
    const stageData = stages.map(stage => deals.filter(d => d.status === stage).length);
    
    new Chart(document.getElementById('dealsStageChart'), {
        type: 'bar',
        data: {
            labels: stages,
            datasets: [{
                label: 'Number of Deals',
                data: stageData,
                backgroundColor: '#3b82f6',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } }
            }
        }
    });
    
    // Interactions Type Chart
    const types = ['Call', 'WhatsApp', 'Meeting', 'Email', 'Other'];
    const typeData = types.map(type => interactions.filter(i => i.type === type).length);
    
    new Chart(document.getElementById('interactionsChart'), {
        type: 'doughnut',
        data: {
            labels: types,
            datasets: [{
                data: typeData,
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#6b7280']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function loadTopCustomers() {
    const deals = StorageService.getDeals();
    const customers = StorageService.getCustomers();
    const tableBody = document.getElementById('topCustomersTable');
    tableBody.innerHTML = '';
    
    const customerStats = customers.map(customer => {
        const customerDeals = deals.filter(d => d.customerId === customer.id && d.status === 'Closed Won');
        const totalValue = customerDeals.reduce((sum, d) => sum + parseFloat(d.value), 0);
        return {
            name: customer.name,
            location: customer.location || 'N/A',
            totalValue: totalValue,
            count: customerDeals.length
        };
    });
    
    // Sort by value descending
    customerStats.sort((a, b) => b.totalValue - a.totalValue);
    
    // Take top 5
    const top5 = customerStats.filter(c => c.totalValue > 0).slice(0, 5);
    
    if (top5.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No completed sales yet.</td></tr>';
        return;
    }
    
    top5.forEach(stat => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><div style="font-weight: 600;">${stat.name}</div></td>
            <td>${stat.location}</td>
            <td style="font-weight: bold; color: var(--accent-color);">R ${stat.totalValue.toLocaleString()}</td>
            <td>${stat.count} deals</td>
        `;
        tableBody.appendChild(row);
    });
}
