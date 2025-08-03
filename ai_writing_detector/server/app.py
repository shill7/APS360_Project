from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformers import RobertaTokenizer
from model_classifier.hybrid_class import HybridClassifier, LinguisticFeatureExtractor

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# Constants
NUM_LINGUISTIC_FEATURES = 7
MODEL_NAME = 'roberta-base'

# Load components once
tokenizer = RobertaTokenizer.from_pretrained('./tokenizer')
feature_extractor = LinguisticFeatureExtractor()
model = HybridClassifier(NUM_LINGUISTIC_FEATURES)
model.load_state_dict(torch.load('hybrid_classifier_weights.pt', map_location='cpu'))
model.eval()

@app.route('/predict', methods=['POST'])
def predict():
    text = request.json.get('text', '')

    # Tokenize
    encoded = tokenizer(text, return_tensors='pt', truncation=True, padding=True, max_length=512)
    input_ids = encoded['input_ids']
    attention_mask = encoded['attention_mask']

    # Linguistic features
    features = feature_extractor.extract_features(text) 
    linguistic_tensor = torch.tensor([features], dtype=torch.float32)

    # Inference
    with torch.no_grad():
        outputs = model(input_ids, attention_mask, linguistic_tensor)
        temperature = 2.0 # Temporary fix to overconfidence in model
        probs = torch.softmax(outputs/temperature, dim=1).numpy()[0]
        prediction = int(probs.argmax())
        confidence = float(probs[prediction])
        print(outputs.shape)

    return jsonify({
        'prediction': prediction,
        'confidence': confidence
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
