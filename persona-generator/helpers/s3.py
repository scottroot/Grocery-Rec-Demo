import json
import os
from dotenv import load_dotenv
import boto3


load_dotenv()
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")

s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY
)


def upload_to_s3(user_id, persona_json):
    if isinstance(persona_json, str):
        persona_json = json.loads(persona_json)
    file_name = f"{user_id}.json"
    with open(f"personas/{str(user_id)}.json", "w") as f:
        json.dump(persona_json, f)

    json_string = json.dumps(persona_json, indent=4)

    s3_client.put_object(
        Bucket=S3_BUCKET_NAME,
        Key=file_name,
        Body=json_string,
        ContentType="application/json"
    )
    s3_url = f"https://{S3_BUCKET_NAME}.s3.amazonaws.com/{file_name}"
    return s3_url
