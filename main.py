from pathlib import Path
from typing import Union, Annotated

import os
from fastapi import FastAPI, UploadFile
import openai
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=["*"],
    allow_headers=["*"],
)

openai.api_key = os.getenv("OPENAI_API_KEY")

UPLOAD_DIR = Path() / 'uploads'


# Generate mail templates for provided responses or 
@app.post("/mailgen")
async def mail_template(data:dict):
    if data['context']:
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=f"Write a response to the following email.  Don't include the subject line. The tone of the response should be {data['tone']}. Your name is {data['name']}. If necessary, please use the following additional context to inform your response: {data['context']}. Context provided: '{data['message']}'",
            temperature=1,
            max_tokens=700)
    else:
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=f"Write an email. Don't include the subject line. The tone of the response should be {data['tone']}. Your name is {data['name']}. Context provided: '{data['message']}'",
            temperature=1,
            max_tokens=700)
    choice = response.get('choices')[0]
    result =  {"Template": choice.text}
    return result

# Generate social media posts for the specified platform
@app.post("/postgen")
async def media_posts(data:dict):
    response = openai.Completion.create(
            model="text-davinci-003",
            prompt=f"Create a {data['platform']} post with the following context: '{data['context']}'" ,
            temperature=1,
            max_tokens=700)
    choice = response.get('choices')[0]
    result =  {"Post": choice.text}
    return result

# Generate transcripts of sales calls ====> can later be used to do sentiment analysis
@app.post("/transcriptgen")
async def media_posts(file: UploadFile):
    data = await file.read()
    save_to = UPLOAD_DIR / file.filename
    with open(save_to, "wb") as f:
        f.write(data)
    audio_file = open(UPLOAD_DIR /file.filename, "rb")
    transcript = openai.Audio.transcribe("whisper-1", audio_file)   
    result =  {"Transcript": transcript.text}
    return result

