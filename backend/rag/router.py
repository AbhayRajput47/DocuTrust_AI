def route_question(question):

    q = question.lower()

    document_keywords = [
        "list",
        "all",
        "every",
        "summary",
        "summarize",
        "overview",
        "contribution",
        "contributions",
        "title",
        "name",
        "author",
        "authors",
        "projects",
        "skills",
        "achievements",
        "datasets",
        "paper",
        "document",
        "pdf",
        "resume",
        "report",
        "project"
    ]

    web_keywords = [
        "current",
        "today",
        "latest",
        "weather",
        "price",
        "rate",
        "news"
    ]

    for word in web_keywords:
        if word in q:
            return "WEB"

    for word in document_keywords:
        if word in q:
            return "DOCUMENT"

    return "RETRIEVAL"