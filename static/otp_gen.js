//const totp = window.otplib.totp;
const authenticator = window.otplib.authenticator;
const globalSecret = 'UZN2D6GDLLPQKP73';

function getFutureOtpCode(secret) {
    authenticator.options = { epoch: Date.now() + authenticator.options.step * 1000 };
    return authenticator.generate(secret);
};

function displayCodes() {
    authenticator.options = { epoch: Date.now() };
    const otpCode = authenticator.generate(globalSecret);
    const nextOtpCode = getFutureOtpCode(globalSecret);

    const otpCodeField = document.getElementById('code');
    const nextOTPCodeField = document.getElementById('next-code');

    if (otpCodeField.innerText !== otpCode) {
        // Split it in half so it looks cool :)
        const optSplit = Math.ceil(otpCode.length / 2);
        const nextOtpSplit = Math.ceil(nextOtpCode.length / 2);

        otpCodeField.innerText = otpCode.slice(0, optSplit) + ' ' + otpCode.slice(optSplit);
        nextOTPCodeField.innerText = nextOtpCode.slice(0, nextOtpSplit) + ' ' + otpCode.slice(nextOtpSplit);
    }

    const timeLeft = authenticator.timeRemaining();

    console.log(otpCode, "-", nextOtpCode, "-", timeLeft, "secs until regen");
    document.getElementById('progress-bar').style.width = timeLeft / 30 * 100 + '%';


    if (timeLeft <= 5) {
        otpCodeField.classList.add("flash");
    } else if (otpCodeField.classList.contains("flash")) {
        otpCodeField.classList.remove("flash");
    }
}


document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded :D');
    authenticator.options = { step: 30 };

    document.querySelectorAll('.copy-btn').forEach((copyBtn) => {
        copyBtn.addEventListener('click', () => {
            const otpCode = copyBtn.textContent;

            // Copy text to clipboard
            navigator.clipboard.writeText(otpCode).then(() => {
                console.log('Text copied to clipboard: ' + otpCode);
            }).catch((err) => {
                alert('Failed to copy text: ', err);
            });
        });
    });
    
    // Run immediately so no need to wait for za first interval
    displayCodes();
    setInterval(displayCodes, 1000);
});