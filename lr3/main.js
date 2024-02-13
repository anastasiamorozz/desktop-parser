const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const axios = require('axios');
const cheerio = require('cheerio');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    // Викликаємо функцію parseWebsite після завантаження вікна
    mainWindow.webContents.once('did-finish-load', () => {
        parseWebsite('https://compendium.com.ua/uk/atc/');
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('asynchronous-message', async (event, arg) => {
    console.log(arg); // prints "ping" in the Node console
    // Call parseWebsite function and send back the headings
    const headings = await parseWebsite(arg); // Assuming arg is the URL to parse
    event.reply('asynchronous-reply', headings);
});

// Функція для парсингу HTML і виводу результатів в додаток
async function parseWebsite(urlToParse) {
    try {
        const response = await axios.get(urlToParse); // Завантажуємо вміст веб-сторінки
        const $ = cheerio.load(response.data); // Використовуємо cheerio для парсингу HTML
        
        const headings = [];
        $('.cp-nodes-tree__node-root').each((index, element) => {
            headings.push($(element).text());
        });

        console.log(headings);
        return headings; // Повертаємо заголовки з функції parseWebsite
    } catch (error) {
        console.error('Error parsing website:', error);
        return []; // Повертаємо порожній масив у випадку помилки
    }
}
