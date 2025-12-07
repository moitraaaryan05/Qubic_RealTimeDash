import requests

BOT_TOKEN = "8211029824:AAH4GZQgW_I6dAdPx0lEJM8INaTtMS8WdBs"   # Replace with new token
CHAT_ID = -1001234567890            # Replace with your group ID
TOPIC_ID = 42                       # Replace with your topic ID
TEXT = "Hello from my bot via Python!"

url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"

payload = {
    "chat_id": CHAT_ID,
    "message_thread_id": TOPIC_ID,
    "text": TEXT
}

response = requests.post(url, data=payload)
print(response.status_code)
print(response.text)

# import requests

# BOT_TOKEN = "8211029824:AAH4GZQgW_I6dAdPx0lEJM8INaTtMS8WdBs"  # paste the new one from BotFather

# url = f"https://api.telegram.org/bot{BOT_TOKEN}/getMe"
# resp = requests.get(url)

# print(resp.status_code)
# print(resp.text)

