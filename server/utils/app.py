from flask import Flask, request, jsonify
from textblob import TextBlob
from flask_cors import CORS

# Enable CORS for all routes


app = Flask(__name__)

CORS(app)
# Function to perform sentiment analysis
def analyze_sentiment(text):
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    # Return the sentiment result based on the polarity
    if polarity > 0:
        return "positive"
    elif polarity < 0:
        return "negative"
    else:
        return "neutral"

# API route to handle sentiment analysis requests
@app.route('/sentiment', methods=['POST'])
def sentiment():
    data = request.get_json()  # Get the JSON data from the request
    text = data.get('text')  # Get the text field from the JSON

    if not text:
        return jsonify({"error": "No text provided"}), 400  # Return error if no text is provided

    sentiment_result = analyze_sentiment(text)  # Analyze sentiment of the text
    return jsonify({"sentiment": sentiment_result}), 200  # Return sentiment as a JSON response

if __name__ == '__main__':
    app.run(debug=True)  # Run the Flask app
