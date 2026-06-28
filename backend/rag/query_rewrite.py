# from openai import OpenAI
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

# client = OpenAI(
#     api_key=os.getenv("OPENROUTER_API_KEY"),
#     base_url="https://openrouter.ai/api/v1"
# )
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

def rewrite_query(question):
    try:

        prompt = f"""
You are a Query Rewriter Agent.

Your task is to rewrite the user's question into a short search query.

Rules:
1. DO NOT answer the question.
2. DO NOT explain anything.
3. DO NOT add extra text.
4. Return ONLY the rewritten search query.
5. Keep it under 10 words.
6. Preserve the original meaning.

Examples:

Question:
Who won FIFA World Cup 2022?

Output:
FIFA World Cup 2022 winner

Question:
What is my CPI in IIT Patna?

Output:
CPI IIT Patna

Question:
Summarize this paper

Output:
paper summary

Question:
List all projects

Output:
all projects

Question:
{question}

Output:
"""

        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                temperature=0,
                max_output_tokens=20,
            )
        )

        return response.text.strip()

    except Exception as e:
        print("Query Rewrite Error:", e)
        return question

