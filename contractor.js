// Contractor dashboard logic

let allHouses = [];
let currentBlock = 'block1';

fetch('data/houses.json')
  .then(response => response.json())
  .then(houses => {
    allHouses = houses;
    renderDashboard();
  });

document.getElementById('block-select').addEventListener('change', function() {
  currentBlock = this.value;
  renderDashboard();
});

function renderDashboard() {
  const dashboard = document.getElementById('dashboard');
  let filtered = [];
  if (currentBlock === 'block1') {
    filtered = allHouses.filter(h => h.legal && h.legal.toLowerCase().includes('block 1'));
  } // blocks 2,3,4 are empty for now
  dashboard.innerHTML = filtered.length === 0 ? '<p>No houses available for this block.</p>' :
    filtered.map((house, idx) => `
      <div class="house-row" style="margin-bottom:16px;padding:12px 10px;border-radius:8px;border:1px solid #eee;display:flex;align-items:center;justify-content:space-between;">
        <span style="font-weight:bold;">${house.legal}</span>
        <select data-idx="${allHouses.indexOf(house)}" class="status-select" style="padding:6px 12px;border-radius:6px;border:1px solid #ccc;">
          <option value="available" ${house.status === 'available' ? 'selected' : ''}>Available (Green)</option>
          <option value="sold" ${house.status === 'sold' ? 'selected' : ''}>Sold (Red)</option>
          <option value="reserved" ${house.status === 'reserved' ? 'selected' : ''}>Reserved (Yellow)</option>
          <option value="inactive" ${house.status === 'inactive' ? 'selected' : ''}>Inactive (Grey)</option>
        </select>
      </div>
    `).join('');

  document.querySelectorAll('.status-select').forEach(select => {
    select.addEventListener('change', function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      allHouses[idx].status = this.value;
      saveHouses(allHouses);
    });
  });
}

function saveHouses(houses) {
  fetch('data/houses.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(houses, null, 2)
  }).then(() => {
    alert('House status updated! Refresh the map to see changes.');
  }).catch(() => {
    alert('Failed to update house status.');
  });
}
