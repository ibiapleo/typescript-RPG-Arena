export function print(msg: string) {
    const output = document.getElementById("output");
    if (output) {
        output.innerHTML += msg + "\n";
        output.scrollTop = output.scrollHeight;
    } else {
        // fallback para ambiente Node.js
        console.log(msg);
    }
}
