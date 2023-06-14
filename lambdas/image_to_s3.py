import base64
import json

import boto3
from botocore.exceptions import ClientError


s3_client = boto3.client('s3')

def lambda_handler(event, context):
    json_file = json.loads(event['body'])
    image = json_file['image']
    file_name = json_file['fileName']
    metadata = json_file['x-amz-meta-preprocess_function']
    metadata_file_name = json_file['x-amz-meta-name_of_file']
    
    image = image[image.find(",") + 1:]
    file_content = base64.b64decode(image)

    try:
        response = s3_client.put_object(Body=file_content, Bucket='sourcebacket6', Key=file_name, Metadata={'name_of_file':metadata_file_name,'preprocess_function': metadata})
    except ClientError as e:
        raise

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps({
        'success': True,
        })
    }
