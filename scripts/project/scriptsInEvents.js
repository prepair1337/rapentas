


const scriptsInEvents = {

	async Tetris_Event1_Act29(runtime, localVars)
	{
		window.ysdk.multiplayer.sessions.init()
	},

	async Tetris_Event2_Act29(runtime, localVars)
	{
		window.ysdk.multiplayer.sessions.init()
	},

	async Tetris_Event115_Act12(runtime, localVars)
	{
		
	},

	async Tetris_Event117_Act1(runtime, localVars)
	{
		window.ysdk.features.GameplayAPI?.start();
	},

	async Menu_Event1_Act1(runtime, localVars)
	{
		// Генерация ID один раз и сохранение в локалку
		if (!localStorage.getItem("playerNumericId")) {
		    const newId = Math.floor(Math.random() * 6000) + 1;
		    localStorage.setItem("playerNumericId", newId);
		    runtime.globalVars.playerNumericId = newId;
		    log("✅ Сгенерирован новый playerNumericId: " + newId);
		} else {
		    const savedId = parseInt(localStorage.getItem("playerNumericId"));
		    runtime.globalVars.playerNumericId = savedId;
		    log("✅ Загружен playerNumericId из локалки: " + savedId);
		}
		
		
		// Инициализация SDK (если не было)
		if (!window.ysdk) {
		    YaGames.init().then(ysdk => {
		        window.ysdk = ysdk;
		        console.log("✅ SDK готов");
		    });
		}
	},

	async Tetris3_Event22_Act1(runtime, localVars)
	{
		const ysdk = await YaGames.init();
		
		// Сообщаем о старте геймплея.
		ysdk.features.GameplayAPI?.start()
		
		// Игровой процесс активен.
	},

	async Tetris3_Event360_Act3(runtime, localVars)
	{
		ysdk.multiplayer.sessions.commit({
		  score: runtime.globalVars.sravnaochi,   // Текущие очки
		  nick: runtime.globalVars.nick           // Ник игрока (чтобы был виден в записи)
		});
	},

	async Tetris3_Event735_Act1(runtime, localVars)
	{
		ysdk.multiplayer.sessions.push({
		  meta1: runtime.globalVars.sravnaochi,
		  meta2: runtime.globalVars.nick
		});
	},

	async Gameover_Event1_Act1(runtime, localVars)
	{
try {
    const log = (msg) => {
        const textObj = runtime.objects["среднерога16отладка"].getFirstInstance();
        if (textObj) textObj.text += "\n" + msg;
        else console.log("[Log]", msg);
    };

    const score = parseInt(runtime.globalVars.score) || 0;
    const playerId = parseInt(runtime.globalVars.playerNumericId) || 0;
    const matchCode = 1104; // ← Обновлённый режим
    const meta1 = matchCode * 1_000_000 + score;

    log(`📤 Пуш сессии: score=${score}, playerId=${playerId}, matchCode=${matchCode}, meta1=${meta1}`);

    window.ysdk.multiplayer.sessions.push({
        meta1: meta1,
        meta2: playerId
    });

    log("✅ Сессия запушена!");
} catch (err) {
    const log = (msg) => console.log("[Log]", msg);
    log("💥 Ошибка при пуше: " + (err?.message || err));
}
	},

	async Gameover_Event1_Act2(runtime, localVars)
	{
		const ysdk = await YaGames.init();
		
		
		ysdk.features.GameplayAPI?.stop()
	},

	async Tutu2_Event22_Act1(runtime, localVars)
	{
		(async () => {
		  const log = (msg) => {
		    const textObj = runtime.objects["среднерога16отладка"].getFirstInstance();
		    if (textObj) textObj.text += "\n" + msg;
		    else console.log("[Log]", msg);
		  };
		
		  const myId = parseInt(runtime.globalVars.playerNumericId);
		  const myNick = runtime.globalVars.nick;
		  const played = JSON.parse(localStorage.getItem("playedSessions") || "[]");
		
		  let opponent = null;
		
		  try {
		    const response = await fetch("https://lebmkbapqahnahjeycvd.supabase.co/rest/v1/matches", {
		      method: "GET",
		      headers: {
		        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlYm1rYmFwcWFobmFoamV5Y3ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwODk1OTMsImV4cCI6MjA2OTY2NTU5M30.XpkbQSxJeM-JlrRoBPypVUKPOVeR3kprNt0DgX-FJQU",
		        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlYm1rYmFwcWFobmFoamV5Y3ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwODk1OTMsImV4cCI6MjA2OTY2NTU5M30.XpkbQSxJeM-JlrRoBPypVUKPOVeR3kprNt0DgX-FJQU",
		        "Content-Type": "application/json"
		      }
		    });
		
		    const data = await response.json();
		    log("✅ Получено записей: " + data.length);
		
		    for (const row of data) {
		      const opId = parseInt(row.idishnik);
		      const opNick = row.nickname;
		
		      if (opId !== myId && opNick !== myNick && !played.includes(opId)) {
		        opponent = row;
		        break;
		      }
		    }
		
		    if (opponent) {
		      log("🎯 Найден соперник: " + opponent.nickname + " (id " + opponent.idishnik + ")");
		      runtime.globalVars.OpponentId = parseInt(opponent.idishnik);
		      runtime.globalVars.OpponentName = opponent.nickname;
		      runtime.globalVars.OpponentScoreJSON = opponent.score;
		
		      try {
		        const parsed = JSON.parse(opponent.score);
		
		        if (parsed.c2array && Array.isArray(parsed.data)) {
		          runtime.globalVars.ResizeArrayX = parsed.size[0];
		          runtime.globalVars.ResizeArrayY = parsed.size[1];
		          runtime.globalVars.ResizeArrayZ = parsed.size[2];
		          runtime.globalVars.FlagResizeArray = 1;
		
		          log("📦 OpponentScoreJSON загружен, массив готов к вставке. Размер: " +
		              parsed.size[0] + "×" + parsed.size[1] + "×" + parsed.size[2]);
		
		          // ⬇️ ВСТАВЛЯЕМ ЗДЕСЬ: распарсим "очки_секунды" в отдельный массив
		          const rawData = parsed.data;
		          const splitArray = rawData.map(entry => {
		            const [score, sec] = entry[0][0].split("_").map(Number);
		            return { score, sec };
		          });
		
		          // Сохраняем в глобал
		          runtime.globalVars.ParsedOpponentArray = JSON.stringify(splitArray);
		          log("📊 Распаршенный массив оппонента сохранён. Записей: " + splitArray.length);
		        } else {
		          log("⚠️ OpponentScoreJSON в неверном формате");
		        }
		
		      } catch (e) {
		        log("💥 Ошибка парсинга OpponentScoreJSON: " + e.message);
		      }
		
		      played.push(parseInt(opponent.idishnik));
		      localStorage.setItem("playedSessions", JSON.stringify(played));
		      // ⛔️ shadowOpponentFound НЕ трогаем — ты его сам выставляешь позже
		    } else {
		      log("🕓 Соперник не найден, добавляю себя в ожидание...");
		      runtime.globalVars.shadowOpponentFound = 0;
		      runtime.callFunction("POST_Себя_В_Supabase");
		    }
		
		  } catch (err) {
		    log("💥 Ошибка подключения: " + (err?.message || err));
		    runtime.globalVars.shadowOpponentFound = 0;
		  }
		})();
	},

	async Tetrisshadowevent_Event3_Act3(runtime, localVars)
	{
		ysdk.multiplayer.sessions.commit({
		  score: runtime.globalVars.sravnaochi  // Вставь сюда твою переменную Construct с очками
		});
	},

	async Tetrisshadowevent_Event4_Act1(runtime, localVars)
	{
		ysdk.on('multiplayer-sessions-transaction', ({ opponentId, transactions }) => {
		  transactions.forEach(transaction => {
		    const score = transaction.payload.score;
		    const nick = transaction.payload.nick;  // Добавляем получение ника из payload
		
		    runtime.globalVars.opponentScore = score;   // Правильно записываем очки
		    runtime.globalVars.opponentNick = nick;     // Сохраняем ник в переменную Construct
		  });
		});
		
		ysdk.on('multiplayer-sessions-finish', (opponentId) => {
		  runtime.globalVars.opponentFinished = 1;      // Это оставляй — реакция на завершение игры соперника
		});
	},

	async Tetrisshadowevent_Event5_Act1(runtime, localVars)
	{
		const ysdk = await YaGames.init();
		
		// Сообщаем о старте геймплея.
		ysdk.features.GameplayAPI?.start()
		
		// Игровой процесс активен.
	},

	async Tetrisshadowevent_Event113_Act1(runtime, localVars)
	{
		ysdk.multiplayer.sessions.commit({
		  score: runtime.globalVars.sravnaochi,     // Очки
		  nick: runtime.globalVars.nick             // Ник
		});
	},

	async Tetrisshadowevent_Event113_Act2(runtime, localVars)
	{
		const ysdk = await YaGames.init();
		
		
		ysdk.features.GameplayAPI?.stop()
	},

	async Tetrisshadowevent_Event114_Act1(runtime, localVars)
	{
		ysdk.multiplayer.sessions.commit({
		  score: runtime.globalVars.sravnaochi,     // Очки
		  nick: runtime.globalVars.nick             // Ник
		});
	},

	async Tetrisshadowevent_Event114_Act2(runtime, localVars)
	{
		const ysdk = await YaGames.init();
		
		
		ysdk.features.GameplayAPI?.stop()
	},

	async Tetrisshadowevent_Event115_Act1(runtime, localVars)
	{
		ysdk.multiplayer.sessions.commit({
		  score: runtime.globalVars.sravnaochi,     // Очки
		  nick: runtime.globalVars.nick             // Ник
		});
	},

	async Tetrisshadowevent_Event115_Act2(runtime, localVars)
	{
		const ysdk = await YaGames.init();
		
		
		ysdk.features.GameplayAPI?.stop()
	},

	async Tetrisshadowevent_Event116_Act1(runtime, localVars)
	{
		ysdk.multiplayer.sessions.commit({
		  score: runtime.globalVars.sravnaochi,     // Очки
		  nick: runtime.globalVars.nick             // Ник
		});
	},

	async Tetrisshadowevent_Event116_Act2(runtime, localVars)
	{
		const ysdk = await YaGames.init();
		
		
		ysdk.features.GameplayAPI?.stop()
	},

	async Tetrisshadowevent_Event117_Act1(runtime, localVars)
	{
		ysdk.multiplayer.sessions.commit({
		  score: runtime.globalVars.sravnaochi,     // Очки
		  nick: runtime.globalVars.nick             // Ник
		});
	},

	async Tetrisshadowevent_Event117_Act2(runtime, localVars)
	{
		const ysdk = await YaGames.init();
		
		
		ysdk.features.GameplayAPI?.stop()
	},

	async Tetrisshadowevent_Event118_Act1(runtime, localVars)
	{
		ysdk.multiplayer.sessions.commit({
		  score: runtime.globalVars.sravnaochi,     // Очки
		  nick: runtime.globalVars.nick             // Ник
		});
	},

	async Tetrisshadowevent_Event118_Act2(runtime, localVars)
	{
		const ysdk = await YaGames.init();
		
		
		ysdk.features.GameplayAPI?.stop()
	},

	async Tetrisshadoweventreal_Event21_Act1(runtime, localVars)
	{
		
		// Сообщаем о старте геймплея.
		window.ysdk.features.GameplayAPI?.start()
		
		// Игровой процесс активен.
	},

	async Tetrisshadoweventreal_Event22_Act1(runtime, localVars)
	{
		
		// Сообщаем о старте геймплея.
		window.ysdk.features.GameplayAPI?.start()
		
		// Игровой процесс активен.
	},

	async Tetrisshadoweventreal_Event261_Act2(runtime, localVars)
	{
		window.ysdk.features.GameplayAPI?.stop()
	},

	async Tetrisshadoweventreal_Event294_Act3(runtime, localVars)
	{
		window.ysdk.multiplayer.sessions.commit({
		    score: runtime.globalVars.sravnaochi
		});
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

