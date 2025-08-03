import torch
import torch.nn as nn
from transformers import RobertaModel
import nltk
from nltk.corpus import stopwords
from textstat import flesch_reading_ease
import string

nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('punkt_tab', quiet=True)

MODEL_NAME = 'roberta-base'

# --------------------------
# Hybrid Model Architecture
# --------------------------
class HybridClassifier(nn.Module):
    def __init__(self, n_linguistic_features, n_classes=2):
        super(HybridClassifier, self).__init__()
        self.roberta = RobertaModel.from_pretrained(MODEL_NAME)
        self.linguistic_fc = nn.Linear(n_linguistic_features, 32)
        self.classifier = nn.Sequential(
            nn.Linear(self.roberta.config.hidden_size + 32, 64),
            nn.ReLU(),
            nn.Dropout(0.1),
            nn.Linear(64, n_classes)
        )

    def forward(self, input_ids, attention_mask, linguistic_features):
        roberta_output = self.roberta(
            input_ids=input_ids,
            attention_mask=attention_mask
        )

        pooled_output = roberta_output.pooler_output
        linguistic_output = torch.relu(self.linguistic_fc(linguistic_features))

        combined = torch.cat((pooled_output, linguistic_output), dim=1)
        return self.classifier(combined)


class LinguisticFeatureExtractor:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))

    def extract_features(self, text):
        # Sentence-level features
        sentences = nltk.sent_tokenize(text)
        sentence_count = len(sentences)
        words = nltk.word_tokenize(text)
        word_count = len(words)

        # Avg. sentence length
        avg_sentence_length = word_count / sentence_count if sentence_count > 0 else 0

        # Avg. word length
        char_count = sum(len(word) for word in words)
        avg_word_length = char_count / word_count if word_count > 0 else 0

        # Stopword ratio
        stopword_count = sum(1 for word in words if word.lower() in self.stop_words)
        stopword_ratio = stopword_count / word_count if word_count > 0 else 0

        # Punctuation count
        punctuation_count = sum(1 for char in text if char in string.punctuation)

        # Uppercase word ratio
        uppercase_count = sum(1 for word in words if word.isupper())
        uppercase_ratio = uppercase_count / word_count if word_count > 0 else 0

        # Readability score
        readability_score = flesch_reading_ease(text)

        # Type-token ratio
        unique_words = set(words)
        type_token_ratio = len(unique_words) / word_count if word_count > 0 else 0

        return [
            avg_sentence_length,
            avg_word_length,
            stopword_ratio,
            punctuation_count,
            uppercase_ratio,
            readability_score,
            type_token_ratio
        ]