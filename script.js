// script.js

document.getElementById('sendButton').addEventListener('click', sendMessage);

const conversation = document.getElementById('conversation');
let currentState = 'start'; // Tracks the state of the conversation

async function sendMessage() {
  const userInput = document.getElementById('userInput').value.trim();
  if (!userInput) return;

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
    addMessage("Hello! I'm here to help you choose a course and find the best college. What are your interests? (e.g., technology, business, arts)", 'bot-message');
    currentState = 'interests';
  } else if (currentState === 'interests') {
    const interest = input.toLowerCase();
    const recommendedCourses = recommendCourses(interest);
    addMessage(`Based on your interest in ${interest}, here are some recommended courses: ${recommendedCourses.join(', ')}.`, 'bot-message');
    currentState = 'colleges';
  } else if (currentState === 'colleges') {
    const collegeMapping = mapColleges(input);
    addMessage(`Here are some top colleges offering these courses: ${collegeMapping.join(', ')}.`, 'bot-message');
    currentState = 'end';
  } else if (currentState === 'end') {
    addMessage("Thank you for using the Educational Tutoring Chatbot! If you have more questions, feel free to ask.", 'bot-message');
    currentState = 'start'; // Reset state for new conversation
  }
}

function recommendCourses(interest) {
  const courses = {
    technology: ['Computer Science', 'Data Science', 'Artificial Intelligence', 'Cybersecurity'],
    business: ['Business Administration', 'Finance', 'Marketing', 'Entrepreneurship'],
    arts: ['Graphic Design', 'Fine Arts', 'Creative Writing', 'Film Studies'],
    default: ['General Studies', 'Liberal Arts']
  };
  return courses[interest] || courses['default'];
}

function mapColleges(course) {
  const collegeMap = {
    'Computer Science': ['MIT', 'Stanford University', 'Carnegie Mellon University'],
    'Data Science': ['Harvard University', 'University of California, Berkeley', 'University of Washington'],
    'Business Administration': ['Wharton School', 'Harvard Business School', 'INSEAD'],
    'Graphic Design': ['Rhode Island School of Design', 'Parsons School of Design', 'Pratt Institute'],
    default: ['Local Community College', 'State University']
  };
  return collegeMap[course] || collegeMap['default'];
}