document.getElementById("adminButton").addEventListener("click", function() {
    document.getElementById("roleScreen").style.display = "none";
    document.getElementById("loginScreen").style.display = "grid";
    localStorage.setItem("userRole", "admin");
});

document.getElementById("userButton").addEventListener("click", function() {
    document.getElementById("roleScreen").style.display = "none";
    document.getElementById("loginScreen").style.display = "grid";
    localStorage.setItem("userRole", "user");
});

document.getElementById("loginButton").addEventListener("click", async function() {
    const loginData = {
        bankRole: role,
        username: document.getElementById('accountNum').value,
        password: document.getElementById('pin').value
    };

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });

        const message = await response.text();
        if (message == "y")
        {
            if (role == "admin"){
                window.location.href = "adminFunctions.html";
            }
            else{
                window.location.href = "userFunctions.html";
            }
        } else {
            alert("Login failed.");
        }
    } catch (error) {
        console.error("Connection error:", error);
    }
});