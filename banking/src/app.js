import React, { useState } from 'react';

function App() {

  const [currentScreen, setCurrentScreen] = useState('role');
  const [role, setRole] = useState('');
  const [accountNum, setAccountNum] = useState('');
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [amount, setAmount] = useState('');
  const [newAccount, setNewAccount] = useState('');

  const reset = () => {
    setNewAccount("");
    setPin("");
    setNewName("");
    setNewRole("");
  }

  const removeAfterDelay = (element) => {
    setTimeout(() => {
      if (element) {
        element.remove();
      }
    }, 5000);
  }

  const logging = async () => {
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
        p.textContent = 'Invalid Credentials';
        const section = document.querySelector('#loginScreen');
        section.prepend(p);
        removeAfterDelay(p);
      }
    } catch (error) {
      console.error("Error connecting to Python:", error);
    }
    reset();
  };

  const checkBalance = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountNum),
      });
      const data = await response.json();
      document.getElementById("balance").textContent = `Your balance is $${data.amount}`;
    } catch (error) {
      console.error("Error connecting to Python:", error);
    }
  };

    const changeBalance = async (task) => {
      const info = {
        task: task,
        account: accountNum,
        amount: amount
      }
      try {
        const response = await fetch('http://127.0.0.1:5001/api/change-balance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(info),
      });
      const data = await response.json();
      const p = document.createElement('p');
      if (data.status == "ok")
      {
          if (task == "with"){
            p.textContent = `You withdrew $${amount} successfully.`;
          }
          else{
            p.textContent = `You deposited $${amount} successfully.`;
          }
      }
      else
      {
        p.textContent = "Failed";
      }
      const section = document.querySelector(`#${task}Screen`);
      section.prepend(p);
      removeAfterDelay(p);
    } catch (error) {
      console.error("Error connecting to Python:", error);
    }
    setAmount("");
  };

  const transfer = async () => {
    const info = {
      account: accountNum,
      otherAccount: newAccount,
      amount: amount
    }
    try {
       const response = await fetch('http://127.0.0.1:5001/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info),
      });
      const data = await response.json();
      const p = document.createElement('p');
      if (data.status == "ok")
      {
          p.textContent = `You transferred $${amount} to ${newAccount} successfully.`;
      }
      else
      {
        p.textContent = "Failed";
      }
      const section = document.querySelector('#transferScreen');
      section.prepend(p);
      removeAfterDelay(p);
    } catch (error) {
      console.error("Error connecting to Python:", error);
    }
    setNewAccount("");
    setAmount("");
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
      const p = document.createElement('p');
      const data = await response.json();
      if (data.status == "ok")
      {
          p.textContent = `Created ${newRole} account ${data.message}`;
      }
      else
      {
        p.textContent = "Failed to create account.";
      }
      const section = document.querySelector('#createScreen');
      section.prepend(p);
      removeAfterDelay(p);
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
        body: JSON.stringify(newAccount),
      });
      const data = await response.json();
      const p = document.createElement('p');
      if (data.status == "ok")
      {
          p.textContent = `Closed account ${newAccount}`;
      }
      else
      {
        p.textContent = "Account not found.";
      }
      const section = document.querySelector('#closeScreen');
      section.prepend(p);
      removeAfterDelay(p);
    } catch (error) {
      console.error("Error connecting to Python:", error);
    }
    reset();
  };

  const modifyAccount = async () => {
    const modifyInfo = {
      account: newAccount,
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
      const p = document.createElement('p');
      if (data.status == "ok")
      {
          p.textContent = `Modified account ${newAccount}`;
      }
      else
      {
        p.textContent = "Failed to modify account";
      }
      const section = document.querySelector('#modifyScreen');
      section.prepend(p);
      removeAfterDelay(p);
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
          type="password" 
          placeholder="Enter PIN" 
          value={pin} 
          onChange={(e) => setPin(e.target.value)} />
          <button onClick={(e) => logging(e)}>Login</button>
          <button onClick={() => {setCurrentScreen('role'); setAccountNum('')}}>Go Back</button>
        </section>
      )}

      {currentScreen === 'admin' && (
        <section id="adminScreen">
          <h1>Welcome, {name}!</h1>
          <h1>What would you like to do?</h1>
          <button onClick={() => setCurrentScreen('open')}> Open Account </button>
          <button onClick={() => setCurrentScreen('close')}> Close Account </button>
          <button onClick={() => setCurrentScreen('modify')}> Modify Account </button>
          <button onClick={() => {setCurrentScreen('role'); setAccountNum('')}}>Logout</button>
        </section>
      )}

      {currentScreen === 'user' && (
        <section id="userScreen">
          <h1>Welcome, {name}!</h1>
          <h1>What would you like to do?</h1>
          <button onClick={() => {setCurrentScreen('balance'); checkBalance()}}> Check Balance </button>
          <button onClick={() => setCurrentScreen('withdraw')}> Withdraw </button>
          <button onClick={() => setCurrentScreen('deposit')}> Deposit </button>
          <button onClick={() => setCurrentScreen('transfer')}> Transfer </button>
          <button onClick={() => {setCurrentScreen('role'); setAccountNum('')}}>Logout</button>
        </section>
      )}

      {currentScreen === 'balance' && (
        <section id="balScreen">
          <h1>Check Balance</h1>
          <h3 id="balance">:(</h3>
          <button onClick={() => setCurrentScreen(role)}>Go Back</button>
        </section>
      )}

      {currentScreen === 'withdraw' && (
        <section id="withScreen">
          <h1>Withdraw from Account</h1>
        <input 
          type="text" 
          placeholder="Enter amount" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} />
          <button onClick={() => changeBalance('with')}>Enter</button>
          <button onClick={() => setCurrentScreen(role)}>Go Back</button>
        </section>
      )}

      {currentScreen === 'deposit' && (
        <section id="depScreen">
          <h1>Deposit into Account</h1>
        <input 
          type="text" 
          placeholder="Enter amount" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} />
          <button onClick={() => changeBalance('dep')}>Enter</button>
          <button onClick={() => setCurrentScreen(role)}>Go Back</button>
        </section>
      )}

      {currentScreen === 'transfer' && (
        <section id="transferScreen">
          <h1>Transfer Money</h1>
        <input 
          type="text" 
          placeholder="Enter account number" 
          value={newAccount} 
          onChange={(e) => setNewAccount(e.target.value)} />
        <input 
          type="text" 
          placeholder="Enter amount" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} />
          <button onClick={() => transfer()}>Enter</button>
          <button onClick={() => setCurrentScreen(role)}>Go Back</button>
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
          type="password" 
          placeholder="Enter password" 
          value={pin} 
          onChange={(e) => setPin(e.target.value)} />
          <button onClick={() => createAccount()}>Create</button>
          <button onClick={() => setCurrentScreen(role)}>Go Back</button>
        </section>
      )}

      {currentScreen === 'close' && (
        <section id="closeScreen">
          <h1>Close Account</h1>
        <input 
          type="text" 
          placeholder="Enter account number" 
          value={newAccount} 
          onChange={(e) => setNewAccount(e.target.value)} />
          <button onClick={() => closeAccount()}>Enter</button>
          <button onClick={() => setCurrentScreen(role)}>Go Back</button>
        </section>
      )}

      {currentScreen === 'modify' && (
        <section id="modifyScreen">
          <h1>Modify Account</h1>
        <input 
          type="text" 
          placeholder="Enter account number" 
          value={newAccount} 
          onChange={(e) => setNewAccount(e.target.value)} />
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
          type="password" 
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
          <button onClick={() => setCurrentScreen(role)}>Go Back</button>
        </section>
      )}
    </main>
  );
}

export default App;

