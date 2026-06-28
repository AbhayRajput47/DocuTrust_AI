from ddgs import DDGS

def search_web(query):

    print("SEARCH QUERY =", query)

    results = []

    with DDGS() as ddgs:
        for r in ddgs.text(
            query,
            max_results=5
        ):
            results.append(
                r.get("body", "")
            )

    print("RESULT COUNT =", len(results))

    return "\n".join(results)