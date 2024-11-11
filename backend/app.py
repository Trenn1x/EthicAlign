from flask import Flask, jsonify, request
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

# Initialize sentiment analysis model
sentiment_analyzer = pipeline("sentiment-analysis")

@app.route('/')
def home():
    return jsonify({"message": "EthicAlign backend is running!"})

@app.route('/analyze-sentiment', methods=['POST'])
def analyze_sentiment():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    result = sentiment_analyzer(text)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
