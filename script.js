document.getElementById('sendButton').addEventListener('click', sendMessage);
const conversation = document.getElementById('conversation');
let currentState = 'start'; // Tracks the state of the conversation

async function sendMessage() {
  const userInput = document.getElementById('userInput').value.trim();
  if (!userInput && currentState !== 'interests' && currentState !== 'courses') return;

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
        <select id="interestsDropdown">
          <option value="">Select an Interest</option>
          <option value="computer">Computer</option>
          <option value="data">Data</option>
          <option value="law">Law</option>
          <option value="business">Business</option>
        </select>
        <button id="submitInterests">Submit</button>
      </div>
    `;
    addMessage("Hello! I'm here to help you choose a course and find the best college. Please select your interest:", 'bot-message');
    conversation.innerHTML += interestsDropdown;

    // Handle dropdown submission
    document.getElementById('submitInterests').addEventListener('click', () => {
      const selectedInterest = document.getElementById('interestsDropdown').value;
      if (selectedInterest) {
        addMessage(`You selected: ${selectedInterest.charAt(0).toUpperCase() + selectedInterest.slice(1)}.`, 'user-message');
        handleSelectedInterest(selectedInterest);
      } else {
        addMessage("Please select an interest.", 'bot-message');
      }
    });

    currentState = 'interests';
  } else if (currentState === 'courses') {
    const collegeMapping = mapColleges(input);
    addMessage(`Here are some colleges offering this course: ${collegeMapping.join(', ')}.`, 'bot-message');
    currentState = 'end';
  } else if (currentState === 'end') {
    addMessage("Thank you for using the Educational Tutoring Chatbot! If you have more questions, feel free to ask.", 'bot-message');
    disableInputAndAddRetryButton();
  }
}

function handleSelectedInterest(interest) {
  const courses = recommendCourses(interest);
  const coursesDropdown = `
    <div class="dropdown-container">
      <select id="coursesDropdown">
        <option value="">Select a Course</option>
        ${courses.map(course => `<option value="${course}">${course}</option>`).join('')}
      </select>
      <button id="submitCourse">Submit</button>
    </div>
  `;
  addMessage(`Based on your interest in ${interest.charAt(0).toUpperCase() + interest.slice(1)}, here are some recommended courses:`, 'bot-message');
  conversation.innerHTML += coursesDropdown;

  // Handle course selection
  document.getElementById('submitCourse').addEventListener('click', () => {
    const selectedCourse = document.getElementById('coursesDropdown').value;
    if (selectedCourse) {
      addMessage(`You selected: ${selectedCourse}.`, 'user-message');
      currentState = 'courses';
      handleBotResponse(selectedCourse);
    } else {
      addMessage("Please select a course.", 'bot-message');
    }
  });
}

function recommendCourses(interest) {
  const courses = {
    computer: [
      'Computer Science and Engineering (CSE)',
      'CSE (Artificial Intelligence and Machine Learning)',
      'CSE (Data Science)',
      'CSE (Cyber Security)',
      'Information Technology (IT)'
    ],
    data: [
      'CSE (Data Science)',
      'Data Analytics',
      'Big Data Engineering'
    ],
    law: [
      'Bachelor of Laws (LLB)',
      'Master of Laws (LLM)',
      'Corporate Law'
    ],
    business: [
      'Master of Business Administration (MBA)',
      'BBA',
      'Commerce-related courses'
    ]
  };
  return courses[interest] || [];
}

function mapColleges(course) {
  const collegeMap = {
    'Computer Science and Engineering (CSE)': ['MREC', 'MRCET'],
    'CSE (Artificial Intelligence and Machine Learning)': ['MREC', 'MRCET'],
    'CSE (Data Science)': ['MREC', 'MRCET'],
    'CSE (Cyber Security)': ['MRCET'],
    'Information Technology (IT)': ['MREC', 'MRCET'],
    'Data Analytics': ['MRU'],
    'Big Data Engineering': ['MRU'],
    'Bachelor of Laws (LLB)': ['MRU'],
    'Master of Laws (LLM)': ['MRU'],
    'Corporate Law': ['MRU'],
    'Master of Business Administration (MBA)': ['MREC', 'MRCET', 'MRIM'],
    'BBA': ['MRU'],
    'Commerce-related courses': ['MRU']
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