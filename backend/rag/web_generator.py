# from openai import OpenAI
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()
genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.5-flash")
# client = OpenAI(
#     api_key=os.getenv("OPENROUTER_API_KEY"),
#     base_url="https://openrouter.ai/api/v1"
# )

def generate_web_answer(context, question):

    prompt = f"""
You are a web search assistant.

Use ONLY the search results below.

Give a short, direct and factual answer.

If the answer is not available in the search results, return exactly:

NOT_FOUND

Search Results:
{context}

Question:
{question}
"""

    try:

        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                temperature=0,
                max_output_tokens=200
            )
        )

        return response.text.strip()

    except Exception as e:
        print("Web Generator Error:", e)
        return "NOT_FOUND"


# def generate_web_answer(context, question):

#     prompt = f"""
#     Answer the question using the search results below.

#     Give a short and direct answer.

#     Search Results:
#     {context}

#     Question:
#     {question}
#     """

#     response = client.chat.completions.create(
#         model="deepseek/deepseek-chat-v3-0324",
#         messages=[
#             {
#                 "role": "user",
#                 "content": prompt
#             }
#         ]
#     )

#     return response.choices[0].message.content