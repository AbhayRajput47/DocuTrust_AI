# from openai import OpenAI
# from multiprocessing import context

# from backend.rag import retriever
import google.generativeai as genai
from dotenv import load_dotenv
import os


load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# client = OpenAI(
#     api_key=os.getenv("OPENROUTER_API_KEY"),
#     base_url="https://openrouter.ai/api/v1"
# )
model = genai.GenerativeModel("gemini-3.1-flash-lite")

def generate_answer(context, question):

    prompt = f"""
    You are a document question answering assistant.

    Rules:
    1. Answer ONLY using the provided context.
    2. Do not use outside knowledge.
    3. If the answer is not explicitly present in the context, return exactly:

    
    Special Instructions:

    • If the user asks for a summary:
    - Produce a complete summary.
    - Cover objective, methodology, architecture, contributions, results, and conclusion.
    - Use 5-8 concise bullet points.
    - Each bullet should be 1-2 sentences.
    - Do NOT stop after the first point.

    • If the user asks for:
    - title → return only the title.
    - authors → list all authors.
    - overview → provide one concise paragraph.
    - projects → list every project.
    - skills → list every skill.
    - achievements → list every achievement.

    If the answer is NOT present in the document, return exactly:
    NOT_FOUND

    Context:
    {context}

    Question:
    {question}
    """

    # response = client.chat.completions.create(
    #     model="deepseek/deepseek-chat-v3-0324",
    #     messages=[
    #         {
    #             "role": "user",
    #             "content": prompt
    #         }
    #     ]
    # )
    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                temperature=0,
                max_output_tokens=512,
            )
        )
        print(response.candidates[0].finish_reason)
        print("=" * 50)
        print(response.text)
        print("=" * 50)
        return response.text.strip()
    except Exception as e:
        print("Error generating answer:", e)
        return "NOT_FOUND"
   
    # return response.choices[0].message.content