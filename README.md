# OMR Scanner with Subject-wise Answer Checking

A sophisticated Optical Mark Recognition (OMR) scanner application that revolutionizes the traditional paper-based assessment process. Built with modern technologies including React, Flask, OpenCV, and Firebase, this application provides an end-to-end solution for automated grading of multiple-choice answer sheets with advanced subject-specific answer validation.

##  Features

- **Subject-wise Answer Management**
  - Dynamic subject addition and management through an intuitive admin interface
  - Secure storage of subject-specific answer keys in Firebase Firestore
  - Real-time answer validation based on selected subject
  - Flexible question count per subject
  - Easy modification of existing answer keys

- **Advanced Image Processing**
  - Sophisticated OpenCV-based OMR sheet detection algorithms
  - Intelligent bubble detection with adaptive thresholding
  - Advanced perspective correction for misaligned images
  - Real-time image preview with visual feedback
  - Support for various OMR sheet formats
  - Robust error handling for image quality issues

- **Modern Web Interface**
  - Sleek, responsive React-based frontend with Tailwind CSS
  - Real-time score calculation and display
  - Interactive answer visualization with correct/incorrect indicators
  - Toast notifications for enhanced user experience
  - Subject-specific result tracking and analytics

- **Secure Backend**
  - RESTful Flask API with proper error handling
  - Firebase integration for secure data storage
  - Subject-wise answer validation with caching
  - Roll number tracking and validation
  - Rate limiting for API protection
  - Logging and monitoring capabilities

##  Technology Stack

### Frontend
- **React.js Framework**
  - Context API for state management
  - Custom hooks for reusable logic
  - React Router v6 for navigation
  - React Toastify for notifications
  - React Icons for UI elements

- **Styling**
  - Tailwind CSS v3 for utility-first styling
  - Custom CSS modules for component-specific styles
  - Responsive design principles
  - CSS animations for enhanced UX

- **Firebase Integration**
  - Firebase SDK v9 with modular imports
  - Real-time database listeners
  - Secure authentication methods
  - Optimized data queries

### Backend
- **Flask Framework**
  - RESTful API architecture
  - Blueprint-based organization
  - Custom middleware for request handling
  - Error handling middleware
  - CORS configuration

- **Image Processing**
  - OpenCV 4.x for advanced image manipulation
  - NumPy for numerical computations
  - Custom algorithms for bubble detection
  - Image preprocessing pipeline
  - Error correction mechanisms

- **Data Handling**
  - Pandas for structured data manipulation
  - Firebase Admin SDK for secure operations
  - JSON response formatting
  - Data validation layers

### Database (Firebase Firestore)
- **Collections Structure**
  - subjects
    - Document ID: subjects
    - Fields: Array of subject names
  
  - answers
    - Document ID: {subject_name}_answers
    - Fields: Question-answer mappings
  
  - results
    - Document ID: roll_no_{number}
    - Fields: score, answers, subject, timestamp

### Technical Implementation Details

### Image Processing Pipeline
```python
def process_omr_sheet(image_path):
    # 1. Image Preprocessing
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]

    # 2. Sheet Detection & Alignment
    contours = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    contours = imutils.grab_contours(contours)
    doc = np.zeros((height, width, 3), np.uint8)
    
    # 3. Bubble Detection
    circles = cv2.HoughCircles(
        gray, cv2.HOUGH_GRADIENT, dp=1.2, minDist=minDistance,
        param1=50, param2=30, minRadius=minRadius, maxRadius=maxRadius
    )

    # 4. Answer Processing
    answers = process_marked_answers(circles, thresh)
    return answers
```

### Database Schema
```javascript
// Firestore Collections Structure

// subjects collection
{
  "subjects": {
    "subjects": ["Math", "Physics", "Chemistry"]  // Array of subject names
  }
}

// answers collection
{
  "math_answers": {
    "q1": "A",
    "q2": "B",
    "q3": "C",
    // ... more questions
  },
  "physics_answers": {
    "q1": "B",
    "q2": "D",
    "q3": "A",
    // ... more questions
  }
}

// results collection
{
  "roll_no_12345": {
    "score": 15,
    "subject": "Math",
    "answers": ["A", "B", "C", "D", ...],
    "marked_questions": [
      {"question": "q1", "marker": "correct"},
      {"question": "q2", "marker": "wrong"},
      // ... more questions
    ],
    "timestamp": "2024-01-20T01:32:28+05:30"
  }
}
```

### API Endpoints
```bash
# Backend REST API Structure

# Subject Management
POST /api/subjects/add     # Add new subject
GET /api/subjects/list     # Get all subjects
DELETE /api/subjects/:id   # Delete subject

# Answer Management
POST /api/answers/add      # Add answers for subject
GET /api/answers/:subject  # Get answers for subject
PUT /api/answers/update    # Update subject answers

# OMR Processing
POST /api/upload          # Upload and process OMR sheet
GET /api/results/:rollno  # Get results by roll number
```

### Security Measures
1. **Data Protection**
   - Firebase Security Rules
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Secure subjects collection
       match /subjects/{document} {
         allow read;
         allow write: if request.auth != null;
       }
       
       // Secure answers collection
       match /answers/{document} {
         allow read;
         allow write: if request.auth != null;
       }
       
       // Secure results collection
       match /results/{document} {
         allow read: if request.auth != null;
         allow write: if request.auth != null;
       }
     }
   }
   ```

2. **API Security**
   ```python
   # Flask security middleware
   @app.before_request
   def verify_request():
       if request.endpoint in protected_endpoints:
           token = request.headers.get('Authorization')
           if not token:
               return jsonify({'error': 'No token provided'}), 401
           try:
               decoded_token = auth.verify_id_token(token)
               request.user = decoded_token
           except:
               return jsonify({'error': 'Invalid token'}), 401
   ```

### Performance Optimization
1. **Image Processing**
   ```python
   # Optimize image before processing
   def optimize_image(image):
       # Resize if too large
       if image.shape[0] > 1800 or image.shape[1] > 1800:
           ratio = 1800 / max(image.shape[0], image.shape[1])
           image = cv2.resize(image, None, fx=ratio, fy=ratio)
       
       # Enhance contrast
       clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
       image = clahe.apply(image)
       
       return image
   ```

2. **Database Queries**
   ```javascript
   // Efficient Firestore queries
   const getSubjectAnswers = async (subject) => {
     const answerDoc = await db
       .collection('answers')
       .doc(`${subject}_answers`)
       .get();
     return answerDoc.data();
   };
   ```

##  Prerequisites

- **Python Environment**
  - Python 3.8+ with pip
  - Virtual environment (recommended)
  - OpenCV dependencies
  - Required Python packages (see requirements.txt)

- **Node.js Environment**
  - Node.js 14+ (LTS recommended)
  - npm 6+ or yarn 1.22+
  - React development tools

- **Firebase Setup**
  - Firebase account
  - Project with Firestore enabled
  - Admin SDK configuration
  - Web app configuration

- **Development Tools**
  - Git for version control
  - Code editor (VS Code recommended)
  - Web browser with developer tools
  - Postman for API testing

##  Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone [repository-url]
   cd ScannerOMR
   ```

2. **Backend Setup**
   ```bash
   # Create and activate virtual environment
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   .\venv\Scripts\activate   # Windows
   
   # Install Python dependencies
   pip install -r requirements.txt
   
   # Configure Firebase
   # Place your Firebase admin SDK JSON in the root directory
   # Update the path in app.py:
   # cred = credentials.Certificate('path/to/your/serviceAccountKey.json')
   ```

3. **Frontend Setup**
   ```bash
   # Navigate to frontend directory
   cd Scanner
   
   # Install dependencies
   npm install
   
   # Install additional dev dependencies
   npm install -D @tailwindcss/forms @tailwindcss/typography
   ```

4. **Environment Configuration**
   ```javascript
   // Scanner/src/firebase/firebase_configuration.js
   export const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     projectId: "your-project-id",
     storageBucket: "your-storage-bucket",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id"
   };
   ```

5. **Running the Application**
   ```bash
   # Terminal 1: Start Flask backend
   python app.py
   
   # Terminal 2: Start React frontend
   cd Scanner
   npm start
   
   # Access the application at http://localhost:5713
   ```

##  How It Works

1. **Admin Setup**
   - Access the admin interface through the navigation bar
   - Add new subjects using the "Add Subject" form
   - Create answer keys for each subject:
     1. Select the subject
     2. Set number of questions
     3. Input correct answers
     4. Save to Firestore

2. **Scanning Process**
   Detailed step-by-step workflow:
   1. Subject Selection
      - Choose subject from dropdown
      - System loads corresponding answer key
   
   2. Image Upload
      - Select clear image of OMR sheet
      - Preview appears with alignment guide
   
   3. Image Processing
      - Conversion to grayscale
      - Adaptive thresholding
      - Contour detection
      - Bubble identification
      - Answer extraction
   
   4. Result Generation
      - Answer matching with stored key
      - Score calculation
      - Visual feedback generation
      - Result storage in database

3. **Image Processing Pipeline**
   Detailed technical process:
   ```python
   1. Preprocessing
      - RGB to Grayscale conversion
      - Gaussian blur application
      - Adaptive thresholding
   
   2. Sheet Detection
      - Contour detection
      - Rectangle approximation
      - Perspective transformation
   
   3. Bubble Grid Detection
      - Grid area isolation
      - Circle detection
      - Bubble intensity analysis
   
   4. Answer Extraction
      - Threshold-based marking detection
      - Answer grid mapping
      - Multiple marking detection
      - Error correction
   ```

4. **Result Management**
   - Real-time Processing
     - Immediate score calculation
     - Visual marking overlay
     - Answer correctness indicators
   
   - Data Storage
     - Firebase document creation
     - Roll number indexing
     - Timestamp recording
     - Subject association
   
   - Result Display
     - Score presentation
     - Question-wise breakdown
     - Correct/incorrect highlighting
     - Performance analytics

##  Real-World Applications

1. **Educational Institutions**
   - **Schools and Colleges**
     - Regular class tests and quizzes
     - Term examinations
     - Entrance tests
     - Practice tests
     - Mock examinations
   
   - **Benefits**
     - 90% reduction in grading time
     - Near-zero error rate
     - Immediate result generation
     - Comprehensive analytics
     - Cost-effective solution

2. **Competitive Exams**
   - **Implementation Areas**
     - Entrance examinations
     - Scholarship tests
     - Aptitude assessments
     - Professional certifications
   
   - **Advantages**
     - High-volume processing
     - Standardized evaluation
     - Rapid result publication
     - Secure data handling

3. **Training Centers**
   - **Use Cases**
     - Progress assessments
     - Skill evaluations
     - Certification exams
     - Practice tests
   
   - **Features**
     - Custom test formats
     - Progress tracking
     - Performance analytics
     - Batch processing

4. **Corporate Assessment**
   - **Applications**
     - Recruitment tests
     - Employee certifications
     - Skill assessments
     - Training evaluations
   
   - **Benefits**
     - Standardized evaluation
     - Quick turnaround time
     - Cost efficiency
     - Data-driven insights

##  Best Practices

1. **Image Quality Guidelines**
   - **Lighting Conditions**
     - Use uniform, bright lighting
     - Avoid shadows and glare
     - Maintain consistent illumination
   
   - **Image Capture**
     - Hold camera parallel to sheet
     - Ensure all corners are visible
     - Use high resolution settings
     - Keep sheet flat and unwrinkled

2. **Answer Key Management**
   - **Data Entry**
     - Double verification of answers
     - Regular audits of answer keys
     - Version control for updates
   
   - **Organization**
     - Clear subject categorization
     - Systematic naming conventions
     - Regular backups
     - Access control implementation

3. **System Usage**
   - **Pre-scanning Checks**
     - Verify subject selection
     - Check image quality
     - Confirm roll number format
     - Test system connectivity
   
   - **Maintenance**
     - Regular software updates
     - Database optimization
     - Performance monitoring
     - Security audits

##  Thank You for Choosing ScannerOMR!