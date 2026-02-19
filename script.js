// ===== Scroll Animation =====

const frameCount = 240;
const canvas = document.getElementById("animationCanvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const currentFrame = index =>
  `frames/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;

const images = [];
const image = new Image();

for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

const scrollAnimation = () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const frameIndex = Math.min(
    frameCount - 1,
    Math.floor((scrollTop / maxScroll) * frameCount)
  );

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
};

window.addEventListener("scroll", scrollAnimation);


// ===== Chatbot =====

// 🔒 STRICT RESUME CONTEXT
const SYSTEM_PROMPT = `
You are a resume assistant.
Answer ONLY using the following resume data.
If the answer is not found, respond with:
"I can only answer questions based on the resume."

Resume Data:
Name: ANANTH R
Location: Thoothukudi, Tamil Nadu
Phone: 6385822656
Email: damiananth2618@gmail.com
CGPA: 8.2
Degree: B.E. Electronics and Communication Engineering
College: Government College of Engineering, Tirunelveli
School: St. Antony's Matric Higher Secondary School
Skills: C, Embedded C, Python, Digital Electronics, Analog Communication,
Microprocessors, Embedded Systems, MS Office, MATLAB
Projects:
1. Embedded System Based Mini Project
2. Electronics Simulation Project
DOB: 26.01.2006
Languages: Tamil, English
`;

async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value;
  if (!message) return;

  const chatBox = document.getElementById("chat-messages");
  chatBox.innerHTML += `<div><strong>You:</strong> ${message}</div>`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_OPENAI_API_KEY"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ]
    })
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;

  chatBox.innerHTML += `<div><strong>Bot:</strong> ${reply}</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;

  input.value = "";
}
