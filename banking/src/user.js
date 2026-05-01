document.getElementById("logout").addEventListener("click", function() {
     window.location.href = "index.html";
});

document.getElementById("balButton").addEventListener("click", function() {
    document.getElementById("userScreen").style.display = "none";
    document.getElementById("result").style.display = "grid";
    document.getElementById("textResult").textContent = "Your balance is blank!";
    localStorage.setItem("screen", "result");
});

document.getElementById("withButton").addEventListener("click", function() {
    document.getElementById("userScreen").style.display = "none";
    document.getElementById("withScreen").style.display = "grid";
    localStorage.setItem("screen", "withScreen");
});

document.getElementById("depButton").addEventListener("click", function() {
    document.getElementById("userScreen").style.display = "none";
    document.getElementById("depScreen").style.display = "grid";
    localStorage.setItem("screen", "depScreen");
});

document.getElementById("withEnter").addEventListener("click", function() {
    document.getElementById("withScreen").style.display = "none";
    document.getElementById("result").style.display = "grid";
    document.getElementById("textResult").textContent = "You withdrew blank!";
    localStorage.setItem("screen", "result");
});

document.getElementById("depEnter").addEventListener("click", function() {
    document.getElementById("depScreen").style.display = "none";
    document.getElementById("result").style.display = "grid";
    document.getElementById("textResult").textContent = "You deposited blank!";
    localStorage.setItem("screen", "result");
});


function goBack() {
    const currentScreen = localStorage.getItem("screen");
    document.getElementById(currentScreen).style.display = "none";
    document.getElementById("userScreen").style.display = "grid";
}

document.querySelectorAll('.back').forEach(button => {
    button.addEventListener('click', goBack);
});