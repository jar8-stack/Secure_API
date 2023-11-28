from flask import Flask, request, jsonify
import face_recognition
from PIL import Image
from io import BytesIO
import base64
import numpy as np

app = Flask(__name__)

def base64_to_image(base64_string):
    image_data = base64.b64decode(base64_string)
    return Image.open(BytesIO(image_data))

def image_to_np_array(image):
    return np.array(image)

def convert_to_rgb(image):
    if image.mode != 'RGB':
        image = image.convert('RGB')
    return image

def compare_faces(image_base64_1, image_base64_2):
    image1 = base64_to_image(image_base64_1)
    image2 = base64_to_image(image_base64_2)

    np_image1 = image_to_np_array(convert_to_rgb(image1))
    np_image2 = image_to_np_array(convert_to_rgb(image2))

    face_encodings1 = face_recognition.face_encodings(np_image1)
    face_encodings2 = face_recognition.face_encodings(np_image2)

    if not face_encodings1 or not face_encodings2:
        return 0.0

    face_encodings1 = np.array(face_encodings1)
    face_encodings2 = np.array(face_encodings2)

    face_distance = face_recognition.face_distance(face_encodings1, face_encodings2)
    similarity_percentage = (1 - face_distance[0]) * 100

    return similarity_percentage

@app.route('/compare_faces', methods=['POST'])
def compare_faces_api():
    try:
        data = request.get_json()
        image_base64_1 = data.get('image_base64_1', '')
        image_base64_2 = data.get('image_base64_2', '')

        if not image_base64_1 or not image_base64_2:
            return jsonify({'error': 'Ambas imágenes deben ser proporcionadas'}), 400

        similarity = compare_faces(image_base64_1, image_base64_2)

        return jsonify({'similarity_percentage': similarity})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=4545)
