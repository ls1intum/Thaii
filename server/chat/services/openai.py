from openai import OpenAI
from django.conf import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def generate_response(prompt):
    response = client.chat.completions.create(model="gpt-3.5-turbo", messages=[{"role": "user", "content": prompt}], max_tokens=400, temperature=0.1)
    return response
