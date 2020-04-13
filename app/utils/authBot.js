const Telegraf = require('telegraf');
const config = require('../config');
const controllers = require('../controllers');

const bot = new Telegraf(config.telegram.AUTH_TOKEN);
bot.start(async ctx => {
  try {
    const reg = /[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}/i;
    const [uuid] = ctx.message.text.match(reg);
    if (uuid) {
      const res = await controllers.lecturer.auth(uuid, ctx.from);
      if (res) {
        ctx.reply(`Welcome`);
      } else ctx.reply(`this uuid is not exsist`);
    } else ctx.reply(`You have not token, please try again`);
  } catch (error) {
    ctx.reply(`happend somth bad`);
  }
});

module.exports.launch = () => bot.launch();

// tg://resolve?domain=authorization_by_telegram_bot&start=testtoken
