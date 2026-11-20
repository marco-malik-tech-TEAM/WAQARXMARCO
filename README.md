<h1 align="center">MARCO X WAQAR MD BOT</h1>

<p align="center">
  <img src="assets/bot.jpg" alt="MARCO X WAQAR MD BOT" width="60%" />
</p>

<p align="center"><b>Official WhatsApp MD Bot · Together for Better Experience</b></p>

<p align="center">
  <b>Marco Malik</b> — Developer &nbsp;·&nbsp; <b>WAQAR WRITES</b> — Co-Owner
</p>

<p align="center">
  <a href="https://whatsapp.com/channel/0029VbE1PSOGzzKS8DCvLM32">
    <img src="https://img.shields.io/badge/Join%20our%20WhatsApp%20Channel-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" />
  </a>
</p>

## Setup (Railway mini bot)

1. Upload the files to GitHub and deploy the repo on Railway - see `RAILWAY_STEPS.md`.
2. Generate a domain for the service and open it: that is the **pairing website**.
3. Enter your number (with country code, without `+`), get the 8-letter code and type it in
   WhatsApp -> Settings -> Linked Devices -> Link a Device -> Link with phone number instead.
4. The bot starts by itself. Telegram pairing is optional (`TELEGRAM_BOT_TOKEN`).

Optional variables are listed in `.env.example`.

## Channel features

- **Auto-follow:** every WhatsApp account that links this bot automatically follows the official channel.
- **Auto-react:** the bot reacts to every new post in the channel by itself.
- **Menu:** when someone types `.menu`, the menu appears as *Forwarded from the channel*.

If you ever need to turn them off: `CHANNEL_AUTOFOLLOW=false` / `CHANNEL_AUTOREACT=false`.

## Notes

- All commands are included in the `commands` folder. Nothing is downloaded from outside when the bot starts.
- Never share `telegram_token.txt`, `SESSION_ID` or the `auth_info_baileys` folder with anyone.

<p align="center"><sub>Powered By Marco X Waqar</sub></p>
