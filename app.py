from flask import Flask, request, render_template
import os
import subprocess
import pandas as pd
import datetime
import firebase_admin
from time import strftime, localtime
from firebase_admin import credentials, firestore
from flask_cors import CORS 
from flask import jsonify


app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'Input'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize Firebase
cred = credentials.Certificate('ormscanner-2a06f-firebase-adminsdk-kutn6-a7e013c155.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/')
def upload_form():
    return render_template('upload.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part'
    file = request.files['file']
    subject = request.form.get('subject')
    
    if file.filename == '':
        return 'No selected file'
    if not subject:
        return 'No subject selected'
        
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)
    
    # Run the processing script
    result = subprocess.run(['python', 'main.py', '-i', app.config['UPLOAD_FOLDER']], capture_output=True, text=True)
    output = result.stdout
    error = result.stderr
    
    # Delete the uploaded file
    os.remove(file_path)
    
    # Fetch correct answers from Firebase based on subject
    correct_answers_ref = db.collection('answers').document(f'{subject}_answers')
    correct_answers_doc = correct_answers_ref.get()
    
    if not correct_answers_doc.exists:
        return jsonify({'error': f'No answers found for subject {subject}'}), 404
        
    correct_answers = correct_answers_doc.to_dict()
    
    # Read the results from the CSV file
    TIME_NOW_HRS = strftime("%I%p", localtime())
    results_df = pd.read_csv(os.path.join('outputs', 'Results', f'Results_{TIME_NOW_HRS}.csv'))

    # Extract relevant information
    score = results_df['score'].tolist()
    roll_no = results_df['Roll_no'].tolist()
    answers = results_df[[col for col in results_df.columns if col.startswith('q')]].values.tolist()
    
    # Calculate score based on marked responses
    score = 0
    marked_questions = []
    for i, response in enumerate(answers[0]):
        correct_answer = correct_answers.get(f'q{i+1}', None)
        if response == correct_answer:
            score += 1
            marked_questions.append({'question': f'q{i+1}', 'marker': 'correct'})
        else:
            marked_questions.append({'question': f'q{i+1}', 'marker': 'wrong'})

    # Overwrite the results file with just the header
    results_df.iloc[0:0].to_csv(os.path.join('outputs', 'Results', f'Results_{TIME_NOW_HRS}.csv'), index=False)

    return jsonify({
        'score': score, 
        'roll_no': roll_no[0], 
        'answers': answers[0], 
        'marked_questions': marked_questions,
        'subject': subject
    }), 200

if __name__ == '__main__':
    app.run(debug=True)
