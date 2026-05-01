document.getElementById("logout").addEventListener("click", function() {
     window.location.href = "index.html";
});

document.getElementById("openButton").addEventListener("click", function() {
    document.getElementById("adminScreen").style.display = "none";
    document.getElementById("openScreen").style.display = "grid";
    localStorage.setItem("screen", "openScreen");
});

document.getElementById("closeButton").addEventListener("click", function() {
    document.getElementById("adminScreen").style.display = "none";
    document.getElementById("closeScreen").style.display = "grid";
    localStorage.setItem("screen", "closeScreen");
});

document.getElementById("modifyButton").addEventListener("click", function() {
    document.getElementById("adminScreen").style.display = "none";
    document.getElementById("modifyScreen").style.display = "grid";
    localStorage.setItem("screen", "modifyScreen");
});

document.getElementById("openEnter").addEventListener("click", function() {
    document.getElementById("openScreen").style.display = "none";
    document.getElementById("result").style.display = "grid";
    document.getElementById("textResult").textContent = "You opened an account. Yay!";
    localStorage.setItem("screen", "result");
});

document.getElementById("closeEnter").addEventListener("click", function() {
    document.getElementById("closeScreen").style.display = "none";
    document.getElementById("result").style.display = "grid";
    document.getElementById("textResult").textContent = "You closed an account. Yay!";
    localStorage.setItem("screen", "result");
});


document.getElementById("pinEnter").addEventListener("click", function() {
    document.getElementById("pinInput").style.display = "none";
    document.getElementById("modifyInput").style.display = "grid";
});

document.getElementById("modifyEnter").addEventListener("click", function() {
    document.getElementById("modifyScreen").style.display = "none";
    document.getElementById("result").style.display = "grid";
    document.getElementById("textResult").textContent = "You modified an account. Yay!";
    localStorage.setItem("screen", "result");
});

function goBack() {
    const currentScreen = localStorage.getItem("screen");
    document.getElementById(currentScreen).style.display = "none";
    document.getElementById("adminScreen").style.display = "grid";
}

// Loop through each button and add the click event listener
document.querySelectorAll('.back').forEach(button => {
    button.addEventListener('click', goBack);
});