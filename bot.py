import requests

# 🔥 REPLACE this with your actual bot token
TOKEN = "8211029824:AAH4GZQgW_I6dAdPx0lEJM8INaTtMS8WdBs"

url = f"https://api.telegram.org/bot{TOKEN}/getUpdates"

response = requests.get(url)
requests.post(url, json={"chat_id": CHAT_ID, "text": "test"})

print(response.text)
