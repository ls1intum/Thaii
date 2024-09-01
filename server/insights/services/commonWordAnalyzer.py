import nltk
from nltk import pos_tag
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from collections import Counter
import string

nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('stopwords')

cachedStopWords = stopwords.words("english")

# Handler to find common words in messages of users
def handle_array_common_word(array, variant):
    textList = []
    formattedTextList = []
    for value in array:
        textList.append(value['messageText'])
    text = ' '.join(textList)
    common_words = find_common_word(text, variant)
    for key in common_words:
        formattedTextList.append({"keyword": key[0], "frequency": key[1]})
    return formattedTextList

def find_common_word(text, variant):
    words = word_tokenize(text)
    stop_words = set(cachedStopWords)
    words = [word for word in words if word.lower() not in stop_words and word not in string.punctuation]
        
    pos_tags = pos_tag(words)
            
    if(variant == 0):
        countedWords = [word for word, pos in pos_tags if pos == 'NN']
    elif(variant == 1):
        countedWords = [word for word, pos in pos_tags if pos == 'VBP']
    else:
        countedWords = [word for word, pos in pos_tags if pos == 'JJ']
    most_common = Counter(countedWords).most_common()
    return most_common
