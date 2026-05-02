import React, { useState } from 'react';

function App() {

  const [currentScreen, setCurrentScreen] = useState('role');
  const [role, setRole] = useState('');
  const [accountNum, setAccountNum] = useState('');
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');

  const reset = () => {
    setAccountNum() = "";
    setPin() = "";
    setNewName() = "";
    setNewRole() = "";
  }

  const logging = async () => {
    const loginInfo = {
      role: role,
      account: accountNum,
      password: pin
    }
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginInfo),
      });
      const data = await response.json();
      if (response.ok)
      {
          setCurrentScreen(role);
          setName(data.messsage);
          document.getElementById(role + "Welcome").textContent = "Welcome, " + name + "!";
          reset();
      }
      else
      {
        alert("Login failed.");
      }
    } catch (error) {
      console.error("Error connecting to Python:", error);
    }
  };

  const createAccount = async () => {
    const createInfo = {
      role: newRole,
      name: name,
      password: pin
    }
    try {
      const response = await fetch('http://localhost:5000/api/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createInfo),
      });
      const data = await response.json();
      if (response.ok)
      {
          setCurrentScreen('admin');
          alert('Created ${newRole} account ${data.messsage}');
      }
      else
      {
        alert("Failed to create account.");
      }
    } catch (error) {
      console.error("Error connecting to Python:", error);
    }
    reset();
  };

  const closeAccount = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/close-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountNum),
      });
      if (response.ok)
      {
          setCurrentScreen('admin');
          alert('Closed account ${accountNum}');
      }
      else
      {
        alert("Failed to close account.");
      }
    } catch (error) {
      console.error("Error connecting to Python:", error);
    }
    reset();
  };

  const modifyAccount = async () => {
    const modifyInfo = {
      account: accountNum,
      name: newName,
      password: pin
    }
    try {
      const response = await fetch('http://localhost:5000/api/modify-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modifyInfo),
      });
      if (response.ok)
      {
          setCurrentScreen('admin');
          alert('Modify account ${accountNum}');
      }
      else
      {
        alert("Failed to modify account.");
      }
    } catch (error) {
      console.error("Error connecting to Python:", error);
    }
    reset();
  };

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
            placeholder="Enter account" 
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

      {currentScreen === 'admin' && (
        <section id="adminScreen">
          <h1 id = "adminWelcome">Welcome</h1>
          <h1>What would you like to do?</h1>
          <button onClick={() => setCurrentScreen('open')}> Open Account </button>
          <button onClick={() => setCurrentScreen('close')}> Close Account </button>
          <button onClick={() => setCurrentScreen('modify')}> modify Account </button>
          <button onClick={() => setCurrentScreen('role')}>Logout</button>
        </section>
      )}

      {currentScreen === 'open' && (
        <section id="createScreen">
          <h1>Opening Account</h1>
          <input 
            type="text" 
            placeholder="Enter role" 
            value={newRole} 
            onChange={(e) => setNewRole(e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Enter name" 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)} 
          />
        <input 
          type="text" 
          placeholder="Enter password" 
          value={pin} 
          onChange={(e) => setPin(e.target.value)} />
          <button onClick={() => createAccount()}>Create</button>
          <button onClick={() => setCurrentScreen('admin')}>Go Back</button>
        </section>
      )}

      {currentScreen === 'close' && (
        <section id="closeScreen">
          <h1>Close Account</h1>
        <input 
          type="text" 
          placeholder="Enter account number" 
          value={accountNum} 
          onChange={(e) => setAccountNum(e.target.value)} />
          <button onClick={() => closeAccount()}>Enter</button>
          <button onClick={() => setCurrentScreen('admin')}>Go Back</button>
        </section>
      )}

      {currentScreen === 'modify' && (
        <section id="modifyScreen">
          <h1>Modify Account</h1>
        <input 
          type="text" 
          placeholder="Enter account number" 
          value={accountNum} 
          onChange={(e) => setAccountNum(e.target.value)} />
          <p>Do not need to fill in all.</p>
        <input 
          type="text" 
          placeholder="Enter new name" 
          value={newName} 
          onChange={(e) => {
            if (e.target.value) {
              setNewName(e.target.value);
            } else {
              setNewName("");
            }
          }} />

        <input 
          type="text" 
          placeholder="Enter new password" 
          value={pin} 
          onChange={(e) => {
              if (e.target.value) {
                setPin(e.target.value);
              } else {
                setPin("");
              }
            }}/>
          <button onClick={() => modifyAccount()}>Enter</button>
          <button onClick={() => setCurrentScreen('admin')}>Go Back</button>
        </section>
      )}
    </main>
  );
}

export default App;