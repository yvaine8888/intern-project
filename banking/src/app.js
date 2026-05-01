import React, { useState } from 'react';

function App() {

  const logging = () => {
    setScreen('login');
  };

  const [currentScreen, setCurrentScreen] = useState('role');
  const [role, setRole] = useState('');
  const [accountNum, setAccountNum] = useState('');
  const [pin, setPin] = useState('');

  return (
    <main>
      {currentScreen === 'role' && (
        <section id="roleScreen">
          <h1>Welcome to this Online Banking System!</h1>
          <p>Are you an admin or user?</p>
          <button onClick={() => {setCurrentScreen('login'); setRole('admin')}}>
            Administrator
          </button>
          <button onClick={() => {setCurrentScreen('login'); setRole('user')}}>
            Account Holder
          </button>
        </section>
      )}

      {currentScreen === 'login' && (
        <section id="loginScreen">
          <h1>Login</h1>
          <input 
            type="text" 
            placeholder="Enter account number" 
            value={accountNum} 
            onChange={(e) => setAccountNum(e.target.value)} 
          />
        <input 
          type="text" 
          placeholder="Enter PIN" 
          value={pin} 
          onChange={(e) => setPin(e.target.value)} />
          <button onClick={() => logging()}>Login</button>
          <button onClick={() => setCurrentScreen('role')}>Go Back</button>
        </section>
      )}
    </main>
  );
}

export default App;
// document.getElementById("adminButton").addEventListener("click", function() {
//     document.getElementById("roleScreen").style.display = "none";
//     document.getElementById("loginScreen").style.display = "grid";
//     localStorage.setItem("userRole", "admin");
// });

// document.getElementById("userButton").addEventListener("click", function() {
//     document.getElementById("roleScreen").style.display = "none";
//     document.getElementById("loginScreen").style.display = "grid";
//     localStorage.setItem("userRole", "user");
// });

// document.getElementById("loginButton").addEventListener("click", async function() {
//     const loginData = {
//         bankRole: role,
//         username: document.getElementById('accountNum').value,
//         password: document.getElementById('pin').value
//     };

//     try {
//         const response = await fetch('/api/login', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(loginData)
//         });

//         if (response.ok) {
//             const data = await response.json();
//             localStorage.setItem("name", data.message);
//             if (role == "admin"){
//                 window.location.href = "adminFunctions.html";
//             }
//             else{
//                 window.location.href = "userFunctions.html";
//             }
//         } else {
//             alert("Login failed.");
//         }
//     } catch (error) {
//         console.error("Connection error:", error);
//     }
// });