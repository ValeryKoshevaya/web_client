const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Налаштування завантаження фото
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Файл бази даних
const clientsFile = 'clients.json';

// Реєстрація клієнта
app.post('/register', upload.single('photo'), (req, res) => {
    const { name, email, password, phone, dob, gender, country, agreement, result_test, result_game } = req.body;
    const photo = req.file ? req.file.path : '';
    const newClient = {
        id: Date.now(),
        name,
        email,
        password,
        phone,
        dob,
        gender,
        country,
        photo,
        agreement: agreement === 'true',
        result_test,
        result_game
    };

    let clients = [];
    if (fs.existsSync(clientsFile)) {
        clients = JSON.parse(fs.readFileSync(clientsFile));
    }
    clients.push(newClient);
    fs.writeFileSync(clientsFile, JSON.stringify(clients, null, 2));

    res.json({ message: 'Клієнта зареєстровано' });
});

// Отримання клієнтів
app.get('/clients', (req, res) => {
    if (fs.existsSync(clientsFile)) {
        const clients = JSON.parse(fs.readFileSync(clientsFile));
        res.json(clients);
    } else {
        res.json([]);
    }
});

// Оновлення клієнта
app.put('/clients/:id', (req, res) => {
    const clients = JSON.parse(fs.readFileSync(clientsFile));
    const client = clients.find(c => c.id === parseInt(req.params.id));
    if (client) {
        client.name = req.body.name;
        fs.writeFileSync(clientsFile, JSON.stringify(clients, null, 2));
        res.json({ message: 'Інформацію оновлено' });
    } else {
        res.status(404).json({ message: 'Клієнта не знайдено' });
    }
});

// Видалення клієнта
app.delete('/clients/:id', (req, res) => {
    let clients = JSON.parse(fs.readFileSync(clientsFile));
    clients = clients.filter(c => c.id !== parseInt(req.params.id));
    fs.writeFileSync(clientsFile, JSON.stringify(clients, null, 2));
    res.json({ message: 'Клієнта видалено' });
});

app.listen(PORT, () => console.log(`🚀 Сервер запущено на http://localhost:${PORT}`));
