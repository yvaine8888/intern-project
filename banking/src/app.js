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
    setAccountNum("");
    setPin("");
    setNewName("");
    setNewRole("");
  }

  const removeAfterDelay = (element) => {
    setTimeout(() => {
      if (element) {
        element.remove();
      }
    }, 3000);
  }

  const logging = async (e) => {
    if (e) e.preventDefault();
    const loginInfo = {
      role: role,
      account: accountNum,
      password: pin
    }
    try {
      const response = await fetch('http://127.0.0.1:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginInfo),
      });
      const data = await response.json();
      if (data.status == "ok")
      {
          setCurrentScreen(role);
          setName(data.message);
      }
      else
      {
        const p = document.createElement('p');
        p.textContent = 'Login Failed';
        const section = document.querySelector('#loginScreen');
        section.prepend(p);
        removeAfterDelay(p);
      }
    } catch (error) {
      console.error("Error connecting to Python:", error);
    }
    reset();
  };

  const createAccount = async () => {
    const createInfo = {
      role: newRole,
      name: newName,
      password: pin
    }
    try {
      const response = await fetch('http://127.0.0.1:5001/api/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createInfo),
      });
      const data = await response.json();
      if (data.status == "ok")
      {
          setCurrentScreen('admin');
          const p = document.createElement('p');
          p.textContent = `Created ${newRole} account ${data.message}`;
          const section = document.querySelector('#adminScreen');
          section.prepend(p);
          removeAfterDelay(p);
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
      const response = await fetch('http://127.0.0.1:5001/api/close-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountNum),
      });
      const data = await response.json();
      if (data.status == "ok")
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
      const response = await fetch('http://127.0.0.1:5001/api/modify-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modifyInfo),
      });
      const data = await response.json();
      if (data.status == "ok")
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
          <h3>Are you an admin or user?</h3>
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
          <button onClick={(e) => logging(e)}>Login</button>
          <button onClick={() => setCurrentScreen('role')}>Go Back</button>
        </section>
      )}

      {currentScreen === 'admin' && (
        <section id="adminScreen">
          <h1>Welcome, {name}!</h1>
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
          <h3>Do not need to fill in all.</h3>
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