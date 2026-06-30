/**
 * CODE BOT LOCAL GENERATION ENGINE (100% OFFLINE)
 */

"use strict";

// Local database containing structured template responses
const localCodeDatabase = {
    login: {
        html: `<div class="login-card">\n  <h2>Welcome Back</h2>\n  <input type="email" placeholder="Email Address">\n  <input type="password" placeholder="Password">\n  <button id="loginBtn">Sign In</button>\n</div>`,
        css: `.login-card {\n  background: #1e1f26;\n  padding: 30px;\n  border-radius: 10px;\n  text-align: center;\n}\ninput {\n  width: 100%;\n  padding: 10px;\n  margin: 10px 0;\n  background: #131417;\n  border: 1px solid #2c303b;\n  color: white;\n}\nbutton {\n  background: #00ffd5;\n  color: black;\n  padding: 12px;\n  border: none;\n  width: 100%;\n  cursor: pointer;\n}`,
        js: `document.getElementById('loginBtn').addEventListener('click', () => {\n  alert('Logged in locally via Code Bot!');\n});`
    },
    calculator: {
        html: `<div class="calc">\n  <input type="text" id="display" readonly>\n  <div class="keys">\n    <button onclick="press('1')">1</button>\n    <button onclick="press('2')">2</button>\n    <button onclick="clearCalc()">C</button>\n  </div>\n</div>`,
        css: `.calc {\n  background: #222;\n  padding: 20px;\n  border-radius: 8px;\n}\n#display {\n  width: 100%;\n  height: 40px;\n  margin-bottom: 10px;\n  text-align: right;\n}\nbutton {\n  padding: 15px;\n  margin: 5px;\n}`,
        js: `function press(num) {\n  document.getElementById('display').value += num;\n}\nfunction clearCalc() {\n  document.getElementById('display').value = '';\n}`
    },
    button: {
        html: `<button id="magicBtn">Hover / Click Me!</button>`,
        css: `#magicBtn {\n  background: linear-gradient(45deg, #ff4a5a, #00ffd5);\n  color: white;\n  font-size: 20px;\n  padding: 15px 30px;\n  border: none;\n  border-radius: 50px;\n  cursor: pointer;\n  transition: transform 0.2s;\n}\n#magicBtn:hover {\n  transform: scale(1.1);\n}`,
        js: `document.getElementById('magicBtn').addEventListener('click', () => {\n  alert('Magic triggered!');\n});`
    },
    todo: {
        html: `<div class="todo-app">\n  <input type="text" id="taskInput" placeholder="New Task...">\n  <button id="addBtn">Add Task</button>\n  <ul id="taskList"></ul>\n</div>`,
        css: `.todo-app { background: #1e1f26; padding: 20px; border-radius: 8px; }\nul { list-style: none; padding-top: 10px; }`,
        js: `document.getElementById('addBtn').addEventListener('click', () => {\n  const task = document.getElementById('taskInput').value;\n  if(!task) return;\n  const li = document.createElement('li');\n  li.textContent = task;\n  document.getElementById('taskList').appendChild(li);\n  document.getElementById('taskInput').value = '';\n});`
    },
    default: {
        html: `<div class="container">\n  <h1>Custom Code Bot Element</h1>\n  <p>Ready to customize layout specs.</p>\n</div>`,
        css: `.container {\n  padding: 20px;\n  border: 1px dashed #00ffd5;\n  text-align: center;\n}`,
        js: `console.log("Custom code asset instantiated successfully.");`
    }
};

function generateLocalCodeOffline() {
    const inputVal = document.getElementById('codePromptField').value.toLowerCase();
    
    let matchedTemplate = localCodeDatabase.default;

    // Direct string keyword checking
    if (inputVal.includes('login') || inputVal.includes('form')) {
        matchedTemplate = localCodeDatabase.login;
    } else if (inputVal.includes('calc') || inputVal.includes('calculator')) {
        matchedTemplate = localCodeDatabase.calculator;
    } else if (inputVal.includes('btn') || inputVal.includes('button')) {
        matchedTemplate = localCodeDatabase.button;
    } else if (inputVal.includes('todo') || inputVal.includes('task') || inputVal.includes('list')) {
        matchedTemplate = localCodeDatabase.todo;
    }

    // Direct injection instantly without fetch lag
    document.getElementById('htmlOutputBox').value = matchedTemplate.html;
    document.getElementById('cssOutputBox').value = matchedTemplate.css;
    document.getElementById('jsOutputBox').value = matchedTemplate.js;
}

function copyCodePayload(id) {
    const box = document.getElementById(id);
    if (!box.value) return;
    box.select();
    navigator.clipboard.writeText(box.value);
    alert("Copied to clipboard!");
               }
            
