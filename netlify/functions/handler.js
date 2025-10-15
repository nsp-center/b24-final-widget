exports.handler = async function(event, context) {
  // Эта функция ловит любой запрос от Битрикс24 (включая POST с "хвостом")
  // и в ответ отдает готовый HTML-код нашего виджета.
  // Это решает и проблему с POST-запросом (ошибка 405/404), и проблему с "белым экраном".

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
    body: `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <title>Тестовый виджет</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; text-align: center; color: #333; margin: 0; }
            div { border: 2px dashed #4caf50; padding: 40px; border-radius: 8px; background-color: #f9fff9; }
            h1 { color: #4caf50; }
        </style>
    </head>
    <body>
        <div>
            <h1>✅ Виджет успешно загружен!</h1>
            <p>Все технические проблемы с интеграцией решены.</p>
        </div>
    </body>
    </html>
    `
  };
};