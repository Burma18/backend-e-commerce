import { environment } from '@src/environment';
import { Telegraf } from 'telegraf';

export class BotService {
  private bot: Telegraf;

  constructor() {
    this.bot = new Telegraf(environment.telegram.telegramBotToken);

    this.bot.start((ctx) => {
      ctx.reply('Привет! Добро пожаловать в наш магазин.');
    });

    this.bot.hears('Баланс', (ctx) => {
      ctx.reply(`Ваш баланс ..ю`);
    });

    this.bot.launch();
  }
}
