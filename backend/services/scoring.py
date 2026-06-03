def calculate_score(text, keywords):

    score = 20

    text = text.lower()

    for keyword in keywords:

        if keyword in text:

            score += 15

    return min(score, 100)