const API_BASE = "https://school-api-backend.up.railway.app";

const addForm = document.getElementById('addForm');
const schoolTable = document.getElementById('schoolTable').querySelector('tbody');
const refreshBtn = document.getElementById('refreshList');
const userLatInput = document.getElementById('userLat');
const userLonInput = document.getElementById('userLon');

// Add School
addForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    name: document.getElementById('name').value,
    address: document.getElementById('address').value,
    latitude: parseFloat(document.getElementById('latitude').value),
    longitude: parseFloat(document.getElementById('longitude').value)
  };
  try {
    const res = await fetch(`${API_BASE}/addSchool`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    alert(data.message);
    addForm.reset();
    loadSchools();
  } catch (err) {
    alert(err.message);
  }
});

// Load Schools
async function loadSchools() {
  const lat = userLatInput.value ? parseFloat(userLatInput.value) : "";
  const lon = userLonInput.value ? parseFloat(userLonInput.value) : "";
  try {
    const res = await fetch(`${API_BASE}/listSchools?latitude=${lat}&longitude=${lon}`);
    const schools = await res.json();
    schoolTable.innerHTML = '';
    schools.forEach(s => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${s.id}</td>
        <td><input type="text" value="${s.name}" data-id="${s.id}" class="editName"></td>
        <td><input type="text" value="${s.address}" data-id="${s.id}" class="editAddress"></td>
        <td><input type="number" step="any" value="${s.latitude}" data-id="${s.id}" class="editLat"></td>
        <td><input type="number" step="any" value="${s.longitude}" data-id="${s.id}" class="editLon"></td>
        <td>${s.distance.toFixed(2)}</td>
        <td>
          <button class="action-btn update-btn" onclick="updateSchool(${s.id})">Update</button>
          <button class="action-btn delete-btn" onclick="deleteSchool(${s.id})">Delete</button>
        </td>
      `;
      schoolTable.appendChild(row);
    });
  } catch (err) {
    alert(err.message);
  }
}

// Update School
async function updateSchool(id) {
  const name = document.querySelector(`.editName[data-id='${id}']`).value;
  const address = document.querySelector(`.editAddress[data-id='${id}']`).value;
  const latitude = parseFloat(document.querySelector(`.editLat[data-id='${id}']`).value);
  const longitude = parseFloat(document.querySelector(`.editLon[data-id='${id}']`).value);
  try {
    const res = await fetch(`${API_BASE}/updateSchool/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, address, latitude, longitude })
    });
    const data = await res.json();
    alert(data.message);
    loadSchools();
  } catch (err) {
    alert(err.message);
  }
}

// Delete School
async function deleteSchool(id) {
  if (!confirm("Are you sure you want to delete this school?")) return;
  try {
    const res = await fetch(`${API_BASE}/deleteSchool/${id}`, { method: 'DELETE' });
    const data = await res.json();
    alert(data.message);
    loadSchools();
  } catch (err) {
    alert(err.message);
  }
}

// Refresh Button
refreshBtn.addEventListener('click', loadSchools);

// Initial load
loadSchools();
