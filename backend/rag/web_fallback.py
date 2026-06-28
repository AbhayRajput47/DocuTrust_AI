from rag.web_search import search_web
from rag.web_generator import generate_web_answer

def web_fallback(question):

    web_context = search_web(question)

    answer = generate_web_answer(
        web_context,
        question
    )

    return answer