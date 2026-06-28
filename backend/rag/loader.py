import fitz

def extract_text_from_pdf(pdf_path):

    full_text = ""
    pages = []

    pdf = fitz.open(pdf_path)

    for page_num, page in enumerate(pdf):

        text = page.get_text()

        full_text += text

        pages.append({
            "page": page_num + 1,
            "text": text
        })

    pdf.close()

    return full_text, pages