from fastapi import FastAPI
from pydantic import BaseModel
from transformers import BertTokenizer, BertForSequenceClassification
import torch
import os

# Initialize FastAPI app
app = FastAPI(
    title="Sentiment Analysis API",
    description="API for sentiment analysis using BERT model",
    version="1.0.0"
)

# Load model - using raw string for Windows path
model_path = r"D:\Devan baru\New folder\NLP\sentiment-analysis\backend\model"  # Ganti dengan forward slash

try:
    # Verify model files exist
    required_files = ['config.json', 'model.safetensors', 'tokenizer_config.json']
    for file in required_files:
        if not os.path.exists(os.path.join(model_path, file)):
            raise FileNotFoundError(f"Missing required file: {file}")
    
    # Load model and tokenizer
    tokenizer = BertTokenizer.from_pretrained(model_path)
    model = BertForSequenceClassification.from_pretrained(model_path)
    model.eval()  # Set model to evaluation mode
    
    # Move model to GPU if available
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = model.to(device)
    print(f"Model successfully loaded on {device}")
    
except Exception as e:
    print(f"Error loading model: {str(e)}")
    raise e

# Input model for API
class TextInput(BaseModel):
    text: str

# Root endpoint
@app.get("/", tags=["Root"])
def read_root():
    return {
        "message": "Sentiment Analysis API is running",
        "interactive_docs": "/docs",
        "api_endpoint": "/predict",
        "usage_example": {
            "method": "POST",
            "url": "/predict",
            "body": {"text": "Your text to analyze here"}
        }
    }

# Prediction endpoint
@app.post("/predict", tags=["Prediction"])
def predict(input: TextInput):
    try:
        # Tokenize input text
        encoded_input = tokenizer(
            input.text,
            return_tensors="pt",
            truncation=True,
            max_length=512
        ).to(device)  # Move input to same device as model
        
        # Get prediction
        with torch.no_grad():
            output = model(**encoded_input)
        
        # Process output
        prediction = torch.argmax(output.logits).item()
        confidence = torch.softmax(output.logits, dim=1)[0].max().item()
        
        return {
            "text": input.text,
            "sentiment": "positive" if prediction == 1 else "negative",
            "confidence": float(f"{confidence:.4f}"),
            "success": True
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": "Failed to process request"
        }