const express = require("express");
const { Telegraf } = require("telegraf");
const pgp = require("pg-promise")();

const TOKEN = "";
const PORT = 3000;

const app = express();
const bot = new Telegraf(TOKEN);

const db = pgp("postgres://postgres:12345@localhost:5432/postgres");

const getUser = () => {
    return db.any("select * from tmp");
};

// db.any()
//     .then((data) => {
//         console.log(data);
//     })
//     .catch((error) => {
//         console.log("Ошибка запроса:", error);
//     });

// bot.start((ctx) => {
//     // ctx.reply(db.any("SELECT id from tmp"));
// });
bot.command("get", async (ctx) => {
    try {
        const users = await getUser();
        const userNames = users.map((user) => user.name);
        ctx.reply(userNames[0]);
    } catch (error) {
        console.error(error);
        ctx.reply("Произошла ошибка при получении пользователей");
    }
});
bot.command("get", (ctx) => {
    // Выполнение запроса к базе данных
    db.any("SELECT * FROM tmp")
        .then((data) => {
            // Отправка данных в чат
            ctx.reply(JSON.stringify(data));
        })
        .catch((error) => {
            // Обработка ошибок
            console.error(error);
        });
});
bot.command("add", (ctx) => {
    // Выполнение запроса к базе данных
    db.any("insert into tmp values(2,'ars')")
        .then((data) => {
            // Отправка данных в чат
            ctx.reply("added");
        })
        .catch((error) => {
            // Обработка ошибок
            console.error(error);
        });
});

bot.launch();
app.listen(PORT, () => console.log("Server running on port ${PORT}"));
