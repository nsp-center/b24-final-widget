// --- НАСТРОЙКИ ФРОНТЕНДА ---
// Вставьте сюда URL вашего "Мозга" - скрипта из Шага 1
const LOGIC_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxre3IH3WPbGedF1pIoEsWHL9C-0dj7lN_Sn-gPC4pzYmef7ak3q_ps_cJfp8Bj0uQ/exec";
// --- КОНЕЦ НАСТРОЕК ---

exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
    body: `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <title>Виджет Новой Почты</title>
      <script src="//api.bitrix24.com/api/v1/"></script>
      <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 15px; background-color: #f9fafb; }
          .form-group { margin-bottom: 15px; position: relative; }
          label { display: block; font-weight: 600; margin-bottom: 5px; color: #555; }
          input { width: 100%; padding: 8px 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
          .autocomplete-results { border: 1px solid #ddd; border-top: none; max-height: 200px; overflow-y: auto; background: #fff; position: absolute; width: 100%; z-index: 10; }
          .result-item { padding: 10px; cursor: pointer; }
          .result-item:hover { background-color: #f0f0f0; }
          .result-item small { color: #888; }
          #btn-create-ttn { background-color: #00aaff; color: white; border: none; padding: 12px 15px; font-size: 16px; border-radius: 4px; cursor: pointer; width: 100%; }
          #btn-create-ttn:disabled { background-color: #ccc; }
          .hidden { display: none; }
      </style>
    </head>
    <body>
      <h3>Создание ТТН Новой Почты</h3>
      
      <div class="form-group">
        <label for="city-input">Город или село:</label>
        <input type="text" id="city-input" autocomplete="off" placeholder="Начните вводить название...">
        <div class="autocomplete-results hidden" id="city-results"></div>
      </div>

      <div class="form-group hidden" id="warehouse-group">
        <label for="warehouse-input">Отделение, почтомат или адрес:</label>
        <input type="text" id="warehouse-input" autocomplete="off" placeholder="Введите номер или улицу...">
        <div class="autocomplete-results hidden" id="warehouse-results"></div>
      </div>

      <button id="btn-create-ttn" disabled>Создать ТТН</button>

      <script>
        // --- Переменные состояния ---
        let selectedCityRef = null;
        let selectedWarehouseRef = null;
        let citySearchTimeout;
        let warehouseSearchTimeout;
        
        // --- Элементы DOM ---
        const cityInput = document.getElementById('city-input');
        const cityResults = document.getElementById('city-results');
        const warehouseGroup = document.getElementById('warehouse-group');
        const warehouseInput = document.getElementById('warehouse-input');
        const warehouseResults = document.getElementById('warehouse-results');
        const createTtnBtn = document.getElementById('btn-create-ttn');

        // --- Логика ---
        
        // Поиск городов
        cityInput.addEventListener('keyup', () => {
          clearTimeout(citySearchTimeout);
          const query = cityInput.value;
          if (query.length < 2) {
            cityResults.classList.add('hidden');
            return;
          }
          // "Debounce" - ждем 300мс после окончания ввода, чтобы не слать запросы на каждую букву
          citySearchTimeout = setTimeout(() => {
            fetch(\`\${'${LOGIC_SCRIPT_URL}'}?action=searchCities&query=\${query}\`)
              .then(res => res.json())
              .then(result => {
                if (result.success && result.data.length > 0) {
                  cityResults.innerHTML = '';
                  result.data.forEach(city => {
                    const item = document.createElement('div');
                    item.className = 'result-item';
                    item.innerHTML = \`\${city.description} <small>\${city.area}</small>\`;
                    item.onclick = () => selectCity(city);
                    cityResults.appendChild(item);
                  });
                  cityResults.classList.remove('hidden');
                } else {
                  cityResults.classList.add('hidden');
                }
              });
          }, 300);
        });

        // Выбор города
        function selectCity(city) {
          cityInput.value = city.description;
          selectedCityRef = city.ref;
          cityResults.classList.add('hidden');
          warehouseGroup.classList.remove('hidden');
        }

        // Поиск отделений
        warehouseInput.addEventListener('keyup', () => {
          clearTimeout(warehouseSearchTimeout);
          const query = warehouseInput.value;
          if (query.length < 1) {
            warehouseResults.classList.add('hidden');
            return;
          }
          warehouseSearchTimeout = setTimeout(() => {
            fetch(\`\${'${LOGIC_SCRIPT_URL}'}?action=searchWarehouses&cityRef=\${selectedCityRef}&query=\${query}\`)
              .then(res => res.json())
              .then(result => {
                if (result.success && result.data.length > 0) {
                  warehouseResults.innerHTML = '';
                  result.data.forEach(wh => {
                    const item = document.createElement('div');
                    item.className = 'result-item';
                    item.textContent = wh.description;
                    item.onclick = () => selectWarehouse(wh);
                    warehouseResults.appendChild(item);
                  });
                  warehouseResults.classList.remove('hidden');
                } else {
                  warehouseResults.classList.add('hidden');
                }
              });
          }, 300);
        });

        // Выбор отделения
        function selectWarehouse(wh) {
          warehouseInput.value = wh.description;
          selectedWarehouseRef = wh.ref;
          warehouseResults.classList.add('hidden');
          createTtnBtn.disabled = false; // Активируем кнопку
        }

        // Скрытие списков, если клик был вне полей
        document.addEventListener('click', (e) => {
          if (!cityInput.contains(e.target)) cityResults.classList.add('hidden');
          if (!warehouseInput.contains(e.target)) warehouseResults.classList.add('hidden');
        });

        // TODO: Логика кнопки "Создать ТТН"
        createTtnBtn.onclick = () => {
            alert(\`Готово до створення ТТН!\\nМісто Ref: \${selectedCityRef}\\nВідділення Ref: \${selectedWarehouseRef}\`);
            // Здесь будет вызов GAS для создания накладной
        };

      </script>
    </body>
    </html>
    `
  };
};