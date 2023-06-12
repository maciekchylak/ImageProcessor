#name of the Lambda funtion on AWS: get_latest_images

import boto3
import os
import sys
import uuid
from urllib.parse import unquote_plus
import time
from datetime import datetime
import json

s3 = boto3.resource('s3')            
            
def lambda_handler(event, context):
  bucket_name = event['path'].replace('/', '')
  my_bucket = s3.Bucket(bucket_name) #predefined bucket name, the only one we use
  last_modified_date = datetime(1939, 9, 1).replace(tzinfo=None)
  files_list=[]
  i=0
  for file in my_bucket.objects.all():
    i+=1
    file_date = file.last_modified.replace(tzinfo=None)
    files_list.append((file_date, file.key))
    if len(files_list) > 15:
        files_list.sort(key=lambda tup: tup[0])
        files_list=files_list[-10:]
  
  files_list.sort(key=lambda tup: tup[0])
  files_list=files_list[-10:]

  names_list=[tup[1] for tup in files_list][::-1]
  names_list_json=json.dumps(names_list)
  return {
    'isBase64Encoded': False, #this is important, otherwise you will get an error 'Internal server error
    'statusCode': 200,
    'headers': {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
    'body': names_list_json
    }
