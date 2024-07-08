import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import string

nltk.download('punkt')
nltk.download('stopwords')

def handle_array_keyword(array):
    textList = []
    for value in array:
        textList.append(value['messageText'])
    text = ' '.join(textList)
    if(len(text) > 0):
        keywords = extract_keywords(text)
    else: 
        keywords = []
    return keywords


def extract_keywords(text, num_keywords=10):
    # Tokenize the text
    tokens = word_tokenize(text.lower())

    # Remove punctuation and stopwords
    tokens = [word for word in tokens if word.isalnum()]
    stop_words = set(stopwords.words('english'))
    filtered_tokens = [word for word in tokens if word not in stop_words]

    # Convert list of tokens to a single string
    filtered_text = ' '.join(filtered_tokens)

    # Use TF-IDF Vectorizer to find important words
    tfidf = TfidfVectorizer(max_features=num_keywords)
    tfidf_matrix = tfidf.fit_transform([filtered_text])
    
    # Get the words with highest TF-IDF scores
    feature_names = tfidf.get_feature_names_out()
    scores = tfidf_matrix.toarray()[0]
    keyword_scores = {feature_names[i]: scores[i] for i in range(len(feature_names))}

    # Sort keywords by their scores
    sorted_keywords = sorted(keyword_scores.items(), key=lambda item: item[1], reverse=True)
    # Return top N keywords
    top_keywords = [{"keyword": keyword, "frequency": float(score)} for keyword, score in sorted_keywords]
    return top_keywords

