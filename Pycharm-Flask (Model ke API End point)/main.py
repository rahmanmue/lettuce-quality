from flask import Flask, request
from PIL import Image
import numpy as np
import tensorflow as tf
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route('/selada', methods = ['POST'])

def selada_classifier():

    # get image from request
    image_request = request.files['image']

    # image to array
    image_pil = Image.open(image_request).convert('RGB')

    # Resize image
    image_size = (256,256)
    resized_image_pil = image_pil.resize(image_size)

    # generate array with numpy
    image_array = np.array(resized_image_pil)
    rescaled_image_array = image_array/255.
    batched_rescaled_image_array = np.array([rescaled_image_array])

    # print(rescaled_image_array.shape)
    # print(batched_rescaled_image_array.shape)

    # load model
    loaded_model = tf.keras.models.load_model('model.h5')
    # print(loaded_model.get_config())

    # predict image
    predict = loaded_model.predict(batched_rescaled_image_array)

    return get_predict_result(predict)

def get_predict_result(predict_result):
    classes = ['Healthy', 'Mildew', 'Min-Nutrition', 'Not-Lettuce','Rot']
    conditions = ['Selada Sehat', 'Berpenyakit Jamur', 'Mengalami Defisiensi Nutrisi', 'Bukan Selada', 'Selada Busuk']
    # a = [[1.4912529e-02 , 9.4042043e-06, 1.0107334e-05, 9.8506790e-01]]
    quality_predictions = classes[np.argmax(predict_result[0])]
    condition = conditions[np.argmax(predict_result[0])]
    confidence = round(100 * (np.max(predict_result[0])), 2)

    data_predicted = {
            'quality' : quality_predictions,
            'condition' : condition,
            'confidence' : confidence
            }

    return data_predicted


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    app.run()


