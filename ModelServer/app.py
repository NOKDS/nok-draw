import time
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from keras.models import load_model
import numpy as np
import io
import base64
from PIL import Image
import cv2

app = Flask(__name__)
CORS(app, origins="*")

categories = ["bear", "bird", "cat", "cow", "dog", "elephant", "horse", "lion", "penguin", "rabbit"]
model = load_model('NOK_CNN.h5', compile=False)

def preprocess_canvas_image(base64_str, target_size=(28, 28)):
    # Decode the base64 string
    base64_data = base64_str.split(",")[-1]
    image_data = base64.b64decode(base64_data)
    image = Image.open(io.BytesIO(image_data))

    # Convert transparency to white if necessary
    img = convert_transparency_to_white(image)
    img = np.array(img)

    # Resize the image
    resized_img = cv2.resize(img, target_size, interpolation=cv2.INTER_AREA)

    # Convert to grayscale
    gray_img = cv2.cvtColor(resized_img, cv2.COLOR_BGR2GRAY)

    # If inverting colors is not necessary, comment the next line out
    inverted_img = cv2.bitwise_not(gray_img)

    _, thresholded_img = cv2.threshold(inverted_img, 0, 255, cv2.THRESH_BINARY)
    # Normalize pixel values to the range [0, 1]
    normalized_img = thresholded_img / 255.0

    # Reshape the normalized image to a 3D array
    reshaped_img = normalized_img.reshape((28, 28, 1))

    return reshaped_img

def convert_transparency_to_white(image):
    if image.mode in ('RGBA', 'LA') or (image.mode == 'P' and 'transparency' in image.info):
        # Using a white background
        alpha = image.convert('RGBA').split()[-1]
        bg = Image.new("RGB", image.size, (255, 255, 255))
        bg.paste(image, mask=alpha)
        return bg
    else:
        return image

@app.route('/predict', methods=['POST'])
@cross_origin()
def predict():
    try:
        # Extracting JSON data from POST request
        data = request.json
        if not data:
            return jsonify({'message': 'No data provided'}), 400

        # Extract actual base64 part by removing "data:image...." part
        base64_image = data['canvas_data'].split(",")[-1]
        img_array = preprocess_canvas_image(base64_image)

        # Perform prediction
        predictions = model.predict(np.expand_dims(img_array, axis=0))
        top_classes = np.argsort(predictions[0])[-4:][::-1]

        guesses = [categories[num] for num in top_classes]

        return jsonify({'message': {'guesses': guesses}}), 200
    except Exception as e:
        print(f"Exception during prediction: {e}")
        return jsonify({'error': 'An unexpected error occurred during prediction'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
