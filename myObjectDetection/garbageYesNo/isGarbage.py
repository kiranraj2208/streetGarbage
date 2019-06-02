from keras.preprocessing.image import ImageDataGenerator, array_to_img, img_to_array, load_img
import glob
from keras.models import load_model
import matplotlib.pyplot as plt
import numpy as np
import cv2
import json
data = {}


model = load_model('/home/kiran/kiranRaj/tensorflowNew/myObjectDetection/garbageYesNo/model/garbageModelLatest.h5')

model.load_weights('/home/kiran/kiranRaj/tensorflowNew/myObjectDetection/garbageYesNo/model/eights-improvement-24-0.89.hdf5')

model.compile(loss='binary_crossentropy', optimizer='rmsprop', metrics=['accuracy'])

testPath = '/home/kiran/kiranRaj/tensorflowNew/myObjectDetection/test_images1'

for file in glob.glob(testPath + '/*.jpg'):
  img = cv2.imread(file)
  img = cv2.resize(img, (220, 220))
  img = np.expand_dims(img, axis=0)
  out = 'garbage' if not model.predict_classes(img)[0][0] else 'not garbage'
  print(out)
  data[file.split('/')[-1]] = out
print(data)
with open('/home/kiran/kiranRaj/tensorflowNew/myObjectDetection/garbage.json', 'w') as outFile: 
  json.dump(data, outFile)
