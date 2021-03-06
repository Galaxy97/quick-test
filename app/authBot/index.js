const Telegraf = require('telegraf');
const config = require('../config');
const {lecturer} = require('../controllers');

const bot = new Telegraf(config.telegram.AUTH_TOKEN);

bot.start(async ctx => {
  try {
    const reg = /[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}/i;
    const [uuid] = ctx.message.text.match(reg);
    if (uuid) {
      const res = await lecturer.auth(uuid, ctx.from);
      if (res) {
        ctx.reply(`Welcome, you can return to app`);
      } else ctx.reply(`this uuid is not exsist`);
    } else ctx.reply(`You have not token, please try again`);
  } catch (error) {
    ctx.reply(`happen something bad`);
  }
});

module.exports.launch = () => bot.launch();

// tg://resolve?domain=authorization_by_telegram_bot&start=testtoken
