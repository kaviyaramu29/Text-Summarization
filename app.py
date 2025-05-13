from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import BartTokenizer, BartForConditionalGeneration
from summarizer import Summarizer  # bert-extractive-summarizer

app = Flask(__name__)
CORS(app)

# Load models
abstractive_model = BartForConditionalGeneration.from_pretrained('facebook/bart-large-cnn')
abstractive_tokenizer = BartTokenizer.from_pretrained('facebook/bart-large-cnn')
extractive_model = Summarizer()  # Uses BERT by default

@app.route('/summarize', methods=['POST'])
def summarize_text():
    data = request.get_json()
    text = data.get('text', '')
    max_len = int(data.get('max_length', 130))
    min_len = int(data.get('min_length', 30))
    num_sentences = int(data.get('num_sentences', 3))

    # Abstractive summary
    inputs = abstractive_tokenizer([text], max_length=1024, return_tensors='pt', truncation=True)
    summary_ids = abstractive_model.generate(
        inputs['input_ids'],
        max_length=max_len,
        min_length=min_len,
        num_beams=4,
        early_stopping=True
    )
    abstractive_summary = abstractive_tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    # Extractive summary
    extractive_summary = extractive_model(text, num_sentences=num_sentences)

    return jsonify({
        "abstractive": abstractive_summary,
        "extractive": extractive_summary
    })

if __name__ == '__main__':
    app.run(debug=True)
