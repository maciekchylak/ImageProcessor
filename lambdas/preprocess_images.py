#name of the function on AWS Lambda: test_lambda_py3_8

import boto3
import os
import sys
import uuid
from urllib.parse import unquote_plus
from PIL import Image
import PIL.Image
import time
            
s3_client = boto3.client('s3')
            
def resize_image(image_path, resized_path):
  with Image.open(image_path) as image:
    image.thumbnail(tuple(x / 2 for x in image.size))
    image.save(resized_path)

def rotate_image(image_path, rotated_path):
    with Image.open(image_path) as image:
        image=image.rotate(90)
        image.save(rotated_path)

def to_grayscale(image_path, grayscale_path):
    with Image.open(image_path) as image:
        image=image.convert('L')
        image.save(grayscale_path)
    
def random_function(image_path, random_path):
    with Image.open(image_path) as image:
        image=image.convert('L')
        image=image.convert('1')
        image.save(random_path)
            
def lambda_handler(event, context):
  for record in event['Records']:
    bucket = record['s3']['bucket']['name']
    key = unquote_plus(record['s3']['object']['key'])
    
    time.sleep(0.5) #wait for metadata
    #gets metadata
    response = s3_client.head_object(Bucket=bucket, 
                                    Key=key)
    try:
        given_file_name= response['Metadata']['name_of_file']
        preprocess_function= response['Metadata']['preprocess_function']
    except:
        given_file_name= 'Ala ma kotka'
        preprocess_function= 'random_function'

    tmpkey = key.replace('/', '')
    download_path = '/tmp/{}{}'.format(uuid.uuid4(), tmpkey)
    upload_path = '/tmp/resized-{}'.format(tmpkey)
    s3_client.download_file(bucket, key, download_path)

    if preprocess_function == 'resize_image':
        resize_image(download_path, upload_path)
    elif preprocess_function == 'rotate_image':
        rotate_image(download_path, upload_path)
    elif preprocess_function == 'to_grayscale':
        to_grayscale(download_path, upload_path)
    else:
        random_function(download_path, upload_path)
        preprocess_function = 'random_function'

    
    #upload image with metadata
    s3_client.upload_file(upload_path, #filename
                          '{}-resized'.format(bucket), #bucket name
                          'resized-{}'.format(key), #key
                          ExtraArgs={'Metadata': {
                                                    'name_of_file': given_file_name,
                                                    'preprocess_function': preprocess_function }
                                        })
