// Функція відправки форми
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    if (password !== confirmPassword) {
        document.getElementById('message').innerText = 'Паролі не співпадають!';
        return;
    }

    const response = await fetch('/register', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    document.getElementById('message').innerText = result.message;
    e.target.reset();
});

// Функція завантаження клієнтів
async function loadClients() {
    const response = await fetch('/clients');
    const clients = await response.json();

    const container = document.getElementById('clientsList');
    container.innerHTML = '';
    clients.forEach(client => {
        const div = document.createElement('div');
        div.classList.add('client-item');
        div.innerHTML = `
            <p><strong>Ім'я:</strong> ${client.name}</p>
            <p><strong>Email:</strong> ${client.email}</p>
            <button onclick="editClient(${client.id})">Редагувати</button>
            <button onclick="deleteClient(${client.id})">Видалити</button>
            <hr>
        `;
        container.appendChild(div);
    });
}

// Редагування клієнта
async function editClient(id) {
    const newName = prompt('Введіть нове ім\'я:');
    if (newName) {
        await fetch(`/clients/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName })
        });
        loadClients();
    }
}

// Видалення клієнта
async function deleteClient(id) {
    if (confirm('Ви впевнені, що хочете видалити цього клієнта?')) {
        await fetch(`/clients/${id}`, { method: 'DELETE' });
        loadClients();
    }
}
