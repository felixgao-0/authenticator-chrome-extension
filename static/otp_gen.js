let totp = null;
const secret = 'JA7PUOR62RDWHS7S';

function getTOTPCode(secret) {
    const currentTime = Math.floor(Date.now() / 1000);

    return {
        code: totp.generate(secret),
        step: totp.options.step
    }
};

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded :D');
    totp = window.otplib.totp;
    totp.options = { step: 30 };

    document.querySelectorAll('.copy-button').forEach((copyBtn) => {
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
        
    setInterval(() => {
        otpInfo = getTOTPCode(secret);
        otpCodeField = document.getElementById('code');

        otpCodeField.innerText = otpInfo.code

        const currentTime = Math.floor(Date.now() / 1000);
        const timeLeft = totp.options.step - (currentTime % totp.options.step);
        document.getElementById('progress-bar').style.width = timeLeft / 30 * 100 + '%';


        if (timeLeft <= 5) {
            otpCodeField.classList.add("flash");
        } else if (otpCodeField.classList.contains("flash")) {
            otpCodeField.classList.remove("flash");
        }
    }, 1000);
});