# 🧠 AI Writing Detector
This project uses a hybrid classifier that combines linguistic features with RoBERTa embeddings to detect AI-generated text.

## 🔧 Model Weights Required
To run the prediction API, you must manually download the following files: 
| File/Folder Name                    | Description                                |
|-----------------------------|--------------------------------------------|
| `hybrid_classifier_weights.pt` | PyTorch weights for the hybrid model        |
| `feature_extractor.pkl`       | Pre-trained linguistic feature extractor   |
| `tokenizer/`                 | HuggingFace tokenizer folder (`roberta-base`) |

## 📁 Where to Place the Files

Place the files in the **root directory** of the project like this:
<pre><code>server/ 
├── app.py 
├── hybrid_classifier_weights.pt 
├── feature_extractor.pkl 
├── tokenizer/ 
│ ├── tokenizer_config.json
│ ├── vocab.json 
│ └── merges.txt 
├── model_classifier/</code></pre>


> ⚠️ These files are **not included in the GitHub repository** due to their size. Please obtain them from the Google Drive.

## 🚀 Getting Started

### **Backend**
**1. Install dependencies**
> pip install -r requirements.

**2. Run the backend**
> cd server <br/> python app.py

### **Frontend**
**1. Install dependencies**
> npm install

**2. Run the frontend**
> cd ai_writing_detector <br/> npm run dev


## ✅ Example
1. Paste a paragraph of text with at least 50 words into the text box
2. Click "Check"
3. The model will return:
>  Prediction: Human-written or AI-generated <br/>Confidence Score: A visual confidence score of AI generated from 0–100%