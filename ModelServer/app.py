import time
from flask import Flask, jsonify, request
from flask_cors import CORS
from keras.models import load_model
from PIL import Image
import numpy as np
import io
import base64
import cv2
app = Flask(__name__)

CORS(app, origins="http://localhost:8080")

categories = [
              "bear", "bird", "cat", "cow", "dog", "elephant",
              "horse", "lion", "penguin", "rabbit"
              ]

model = load_model('NOK_CNN.h5', compile=False)

def save_base64_png(base64_str, output_filename):
    # Extract actual base64 part by removing "data:image/png;base64," part
    base64_data = base64_str.split(",")[-1]

    # Decode the base64 string to binary data
    image_data = base64.b64decode(base64_data)

    # Write the binary data to a file
    with open(output_filename, 'wb') as file:
        file.write(image_data)

    print(f"Image saved as {output_filename}")

def binarize_image(img, threshold=128):
    """Binarize an image using a threshold."""
    print(img)
    img = img.point(lambda p: 255 if p > threshold else 0)
    return img

# def preprocess_canvas_image(base64_str, target_size=(28, 28)):
#     # Decode the base64 string
#     image_data = base64.b64decode(base64_str)
#     image = Image.open(io.BytesIO(image_data))

#     # Convert transparency to white and save
#     image = convert_transparency_to_white(image)
#     image.save("1_converted.png")

#     # Convert to grayscale and save
#     gray_image = image.convert('L')
#     gray_image.save("2_grayscale.png", 'PNG')  # Ensure PNG format is specified    gray_image = image.convert('L')

#     # Resize the image and save
#     resized_image = gray_image.resize(target_size, Image.Resampling.LANCZOS)
#     resized_image.save("3_resized.png")

#     # Convert to numpy array
#     np_image = np.array(resized_image)

#     # Apply a manual threshold
#     threshold = 128  # Adjust this value as needed
#     binarized_image = (np_image > threshold) * 255
#     Image.fromarray(binarized_image.astype(np.uint8)).save("4_binarized.png")

#     # Reshape and normalize
#     img_array = np.expand_dims(binarized_image, axis=0).astype('float32') / 255.0

#     return img_array

# def preprocess_canvas_image(base64_str, target_size=(28, 28)):
#     # Decode the base64 string
#     image_data = base64.b64decode(base64_str)
#     image = Image.open(io.BytesIO(image_data))

#     image.save("imageTransparent.png", 'PNG')
#     # Convert transparency to white and save (if necessary)
#     img = convert_transparency_to_white(image)
#     img = np.array(img)
#     # # Open the image using cv2
#     # img = cv2.imread("image1.png")

#     # Resize the image to (28, 28)
#     resized_img = cv2.resize(img, (28, 28))

#     # Convert to grayscale
#     gray_img = cv2.cvtColor(resized_img, cv2.COLOR_BGR2GRAY)

#     # Invert the colors
#     inverted_img = cv2.bitwise_not(gray_img)

#     # Normalize pixel values to the range [0, 1]
#     normalized_img = inverted_img / 255.0

#     # Reshape the normalized image to a 3D array
#     reshaped_img = normalized_img.reshape((28, 28, 1))

#     # Add an extra dimension to represent a batch (even if it's just one image)
#     img_batch = np.expand_dims(reshaped_img, axis=0)

#     # Extract the first image from the batch and remove the last dimension (since it's 1)
#     image_to_save = img_batch[0, :, :, 0]

#     # Convert the pixel values back to the [0, 255] scale and change the type to uint8
#     image_to_save = (image_to_save * 255).astype(np.uint8)

#     # Save the image
#     cv2.imwrite("saved_image.png", image_to_save)
#     return img_batch

def preprocess_canvas_image(base64_str, target_size=(28, 28)):
    # Decode the base64 string
    image_data = base64.b64decode(base64_str)
    image = Image.open(io.BytesIO(image_data))

    image.save("imageTransparent.png", 'PNG')

    # Convert transparency to white and save (if necessary)
    img = convert_transparency_to_white(image)
    img = np.array(img)

    # Resize the image to (28, 28) using a better interpolation method
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

    # Add an extra dimension to represent a batch (even if it's just one image)
    img_batch = np.expand_dims(reshaped_img, axis=0)

    # Extract the first image from the batch and remove the last dimension (since it's 1)
    image_to_save = img_batch[0, :, :, 0]

    # Save the image without inverting colors and after resizing
    image_to_save = (normalized_img * 255).astype(np.uint8)
    cv2.imwrite("saved_image.png", image_to_save)
    return img_batch


    # image.save("image1.png", 'PNG')
    # # Convert to grayscale
    # # gray_image = image.convert('L')

    # # gray_image.save("resizedImage12.png", 'PNG')
    # # Resize the image
    # resized_image = image.resize(target_size, Image.Resampling.LANCZOS)
    # resized_image.save("resizedImage55.png", 'PNG')

    # # Convert to numpy array
    # np_image = np.array(resized_image)

    # np_image = (np_image > 254) * 255
    # np_image = np_image // 255
    # # Normalize
    # # np_image = np_image.astype('float32') / 255.0
    # print(np_image)

    # return np_image

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
def predict():
    # Extracting JSON data from POST request
    data = request.json
    if not data:
        return jsonify({'message': 'No data provided'}), 400

    # Extract actual base64 part by removing "data:image...." part
    base64_image = data['canvas_data'].split(",")[-1]
    save_base64_png(data['canvas_data'], 'output.png') 
    room = data.get('room_name')
    user_id = data.get('user_id')
    img_array = preprocess_canvas_image(base64_image)
    predictions = model.predict(img_array)
    print(img_array) 
    top_classes = np.argsort(predictions[0])[-4:][::-1]

    guesses = []
    for num in top_classes:
        guesses.append(categories[num])
    
    print(guesses)

    return jsonify({'message': {'guesses': [1,2,3], 'room': room, 'user_id': user_id}}), 200

@app.get('/')
def respond():
    return "Hi"


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)