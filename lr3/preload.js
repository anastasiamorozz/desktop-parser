const { ipcRenderer } = require('electron');

ipcRenderer.on('asynchronous-reply', (_event, arg) => {
    console.log(arg); // prints the received list in the DevTools console
    const parsedDataElement = document.getElementById('parsedData');
    const list = document.createElement('ul'); // створюємо елемент <ul>
    
    arg.forEach(item => { // перебираємо елементи списку та додаємо їх до елементу <ul>
        const listItem = document.createElement('li'); // створюємо елемент <li>
        listItem.textContent = item; // встановлюємо текст елементу <li>
        list.appendChild(listItem); // додаємо елемент <li> до елементу <ul>
    });

    parsedDataElement.appendChild(list); // додаємо елемент <ul> до контейнера parsedData
});


ipcRenderer.send('asynchronous-message', 'https://compendium.com.ua/uk/atc/')