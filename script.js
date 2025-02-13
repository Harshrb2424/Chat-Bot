document.getElementById('sendButton').addEventListener('click', sendMessage);
const conversation = document.getElementById('conversation');
let currentState = 'start'; // Tracks the state of the conversation

async function sendMessage() {
  const userInput = document.getElementById('userInput').value.trim();
  if (!userInput && currentState !== 'interests') return;

  // Display user message
  addMessage(userInput, 'user-message');

  // Clear input field
  document.getElementById('userInput').value = '';

  // Process bot response based on current state
  setTimeout(() => {
    handleBotResponse(userInput);
  }, 500);
}

function addMessage(text, className) {
  const messageDiv = document.createElement('div');
  messageDiv.className = className;
  messageDiv.textContent = text;
  conversation.appendChild(messageDiv);

  // Scroll to the bottom of the conversation
  conversation.scrollTop = conversation.scrollHeight;
}

function handleBotResponse(input) {
  if (currentState === 'start') {
    // Ask for interests with a dropdown
    const interestsDropdown = `
      <div class="dropdown-container">
        <select id="interestsDropdown" multiple>
          <option value="technology">Technology</option>
          <option value="business">Business</option>
          <option value="arts">Arts</option>
          <option value="science">Science</option>
        </select>
        <button id="submitInterests">Submit</button>
      </div>
    `;
    addMessage("Hello! I'm here to help you choose a course and find the best college. Please select your interests:", 'bot-message');
    conversation.innerHTML += interestsDropdown;

    // Handle dropdown submission
    document.getElementById('submitInterests').addEventListener('click', () => {
      const selectedInterests = Array.from(document.getElementById('interestsDropdown').selectedOptions).map(option => option.value);
      if (selectedInterests.length > 0) {
        addMessage(`You selected: ${selectedInterests.join(', ')}.`, 'user-message');
        handleSelectedInterests(selectedInterests);
      } else {
        addMessage("Please select at least one interest.", 'bot-message');
      }
    });

    currentState = 'interests';
  } else if (currentState === 'colleges') {
    const collegeMapping = mapColleges(input);
    addMessage(`Here are some colleges offering these courses: ${collegeMapping.join(', ')}.`, 'bot-message');
    currentState = 'end';
  } else if (currentState === 'end') {
    addMessage("Thank you for using the Educational Tutoring Chatbot! If you have more questions, feel free to ask.", 'bot-message');
    disableInputAndAddRetryButton();
  }
}

function handleSelectedInterests(interests) {
  const recommendedCourses = recommendCourses(interests);
  addMessage(`Based on your interests (${interests.join(', ')}), here are some recommended courses: ${recommendedCourses.join(', ')}.`, 'bot-message');
  addMessage(`Which course would you prefer?`, 'bot-message');
  currentState = 'colleges';
}

function recommendCourses(interests) {
  const courses = {
    technology: [
      'Computer Science and Engineering (CSE)',
      'CSE (Artificial Intelligence and Machine Learning)',
      'CSE (Data Science)',
      'CSE (Cyber Security)',
      'Information Technology (IT)',
      'Electronics and Communication Engineering (ECE)',
      'Electrical and Electronics Engineering (EEE)',
      'Mechanical Engineering',
      'Civil Engineering'
    ],
    business: [
      'Master of Business Administration (MBA)',
      'BBA',
      'Commerce-related courses'
    ],
    arts: [
      'Programs in various arts disciplines',
      'B.Sc. in Health Psychology',
      'Dialysis Technology',
      'Dental Technology'
    ],
    science: [
      'Bachelor of Medicine, Bachelor of Surgery (MBBS)',
      'Bachelor of Dental Surgery (BDS)',
      'Bachelor of Pharmacy (B.Pharm)',
      'Agriculture and related disciplines',
      'Basic and applied sciences'
    ]
  };

  let recommended = [];
  interests.forEach(interest => {
    recommended = recommended.concat(courses[interest] || []);
  });
  return [...new Set(recommended)]; // Remove duplicates
}

function mapColleges(course) {
  const collegeMap = {
    'Computer Science and Engineering (CSE)': ['MREC', 'MRCET'],
    'CSE (Artificial Intelligence and Machine Learning)': ['MREC', 'MRCET'],
    'CSE (Data Science)': ['MREC', 'MRCET'],
    'CSE (Cyber Security)': ['MRCET'],
    'Information Technology (IT)': ['MREC', 'MRCET'],
    'Electronics and Communication Engineering (ECE)': ['MREC', 'MRCET'],
    'Electrical and Electronics Engineering (EEE)': ['MREC', 'MRCET'],
    'Mechanical Engineering': ['MREC', 'MRCET'],
    'Civil Engineering': ['MREC'],
    'Mining Engineering': ['MREC'],
    'Master of Business Administration (MBA)': ['MREC', 'MRCET', 'MRIM'],
    'BBA': ['MRU'],
    'Commerce-related courses': ['MRU'],
    'Programs in various arts disciplines': ['MRU'],
    'B.Sc. in Health Psychology': ['MRU'],
    'Dialysis Technology': ['MRU'],
    'Dental Technology': ['MRU'],
    'Bachelor of Medicine, Bachelor of Surgery (MBBS)': ['MRIMS'],
    'Bachelor of Dental Surgery (BDS)': ['MRIDS'],
    'Bachelor of Pharmacy (B.Pharm)': ['MRCP'],
    'Agriculture and related disciplines': ['MRU'],
    'Basic and applied sciences': ['MRU']
  };

  return collegeMap[course] || ['Local Community College'];
}

function disableInputAndAddRetryButton() {
  document.getElementById('userInput').disabled = true;
  document.getElementById('sendButton').disabled = true;

  const retryButton = document.createElement('button');
  retryButton.textContent = 'Retry';
  retryButton.id = 'retryButton';
  retryButton.addEventListener('click', () => {
    resetConversation();
  });

  const messageDiv = document.createElement('div');
  messageDiv.appendChild(retryButton);
  conversation.appendChild(messageDiv);
}

function resetConversation() {
  conversation.innerHTML = ''; // Clear conversation
  currentState = 'start';
  document.getElementById('userInput').disabled = false;
  document.getElementById('sendButton').disabled = false;
  handleBotResponse('');
}