//const totp = window.otplib.totp;
const authenticator = window.otplib.authenticator;

const demoData = { // todo: hookup to sync storage
    'b1c4d2e3-1a2b-3c4d-5e6f-7g8h9i0j1k2l': { uuid: 'b1c4d2e3-1a2b-3c4d-5e6f-7g8h9i0j1k2l', issuer: 'Discord', account: 'elon.musk@tesla.com', secret: 'LQ7INECGKQVOAOPJ' },
    'm3n4o5p6-q7r8-9s0t-u1v2-w3x4y5z6a7b8': { uuid: 'm3n4o5p6-q7r8-9s0t-u1v2-w3x4y5z6a7b8', issuer: 'GitHub', account: 'notreal@felixgao.dev', secret: 'MSYEHCOI4VQJQJ5B' },
    'c7d8e9f0-g1h2-i3j4-k5l6-m7n8o9p0q1r2': { uuid: 'c7d8e9f0-g1h2-i3j4-k5l6-m7n8o9p0q1r2', issuer: 'Google', account: 'blahaj@gmail.com', secret: 'J66X4EGI67LQN5WO' },
    's3t4u5v6-w7x8-y9z0-a1b2-c3d4e5f6g7h8': { uuid: 's3t4u5v6-w7x8-y9z0-a1b2-c3d4e5f6g7h8', issuer: 'Slack', account: 'blahaj@gmail.com', secret: 'O5LQDS5P3DCBMXC4' },
    'i9j0k1l2-m3n4-o5p6-q7r8-s9t0u1v2w3x4': { uuid: 'i9j0k1l2-m3n4-o5p6-q7r8-s9t0u1v2w3x4', issuer: 'Twitter', account: '@elonMusk', secret: 'LNECSJUQH43KSZOO' },
    'y5z6a7b8-c9d0-e1f2-g3h4-i5j6k7l8m9n0': { uuid: 'y5z6a7b8-c9d0-e1f2-g3h4-i5j6k7l8m9n0', issuer: 'Facebook', account: 'who-uses-facebook?', secret: 'J2Z4OP5N5HAQ533J' }
};


function getFutureOtpCode(secret) {
    authenticator.options = { epoch: Date.now() + authenticator.options.step * 1000 };
    return authenticator.generate(secret);
};

function setupCodes() {
    const codeHousing = document.getElementById('otp-container');
    const timeLeft = authenticator.timeRemaining();

    Object.values(demoData).forEach((item) => {
        const itemDiv = document.createElement('div'); // housing unit built
        const itemUuidInput = document.createElement('input');
        itemUuidInput.type = 'hidden';
        itemUuidInput.value = item.uuid;
        itemUuidInput.classList.add('otp-uuid');
        itemDiv.classList.add('otp-item', 'border-2', 'border-gray-400', 'rounded-lg', 'my-2', 'overflow-hidden', 'relative');

        const gridDiv = document.createElement('div'); // Split items inside in a grid
        gridDiv.classList.add('grid', 'grid-cols-2', 'm-1');

        gridDiv.innerHTML = `
            <div>
                <p>${item.issuer}</p>
                <button class="otp-code copy-btn text-3xl">••• •••</button>
                <p>${item.account}</p>
            </div>
            <div class="flex flex-col items-end place-content-between text-gray-500">
                <img height="32" width="32" src="https://cdn.simpleicons.org/github/black" />
                <div>
                    <p class="text-xs text-right">Next:</p>
                    <button class="otp-next-code copy-btn text-xl">••• •••</button>
                </div>
            </div>
        `;

        const progressContainer = document.createElement('div');
        progressContainer.classList.add('bg-gray-300', 'progress-container');

        progressContainer.innerHTML = `<div class="progress-bar" style="width: ${timeLeft}%;"></div>`;

        itemDiv.appendChild(gridDiv);
        itemDiv.appendChild(itemUuidInput);
        itemDiv.appendChild(progressContainer);

        codeHousing.appendChild(itemDiv);
    });
    
};

function displayCodes() {
    document.querySelectorAll('.otp-item').forEach((otpItem, index) => {
        try {
            authenticator.options = { epoch: Date.now() };
            const timeLeft = authenticator.timeRemaining();
            otpItem.querySelector(".progress-bar").style.width = timeLeft / 30 * 100 + '%';

            otpItemData = demoData[otpItem.querySelector('.otp-uuid').value];

            const otpCodeField = otpItem.querySelector(".otp-code");

            const otpCode = authenticator.generate(otpItemData.secret);
            if (otpCodeField.innerText.replace(/\s/g, '') !== otpCode) { // means new otp code!
                const nextOtpCode = getFutureOtpCode(otpItemData.secret);
                const nextOTPCodeField = otpItem.querySelector(".otp-next-code");

                // Split it in half bc it looks cool :)
                const optSplit = Math.ceil(otpCode.length / 2);
                const nextOtpSplit = Math.ceil(nextOtpCode.length / 2);
    
                otpCodeField.innerText = `${otpCode.slice(0, optSplit)} ${otpCode.slice(optSplit)}`;
                nextOTPCodeField.innerText = `${nextOtpCode.slice(0, nextOtpSplit)} ${nextOtpCode.slice(nextOtpSplit)}`;
            }

            if (timeLeft <= 5) {
                otpCodeField.classList.add("flash");
            } else if (otpCodeField.classList.contains("flash")) {
                otpCodeField.classList.remove("flash");
            }

            //console.log(otpItemData.issuer, otpCode, "-", /*nextOtpCode,*/ "-", timeLeft, "secs until regen");
        } catch (error) {
            console.error('Failed to update OTP prompt:', error);
            otpItem.querySelector(".otp-code").innerText = "Error";
            otpItem.querySelector(".otp-next-code").innerText = "Error";
        }
    });
    //console.log('---');
}

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded :D');
    authenticator.options = { step: 30 };

    //document.getElementById('add-code-btn').addEventListener('click', addCode());

    document.querySelectorAll('.copy-btn').forEach((copyBtn) => {
        copyBtn.addEventListener('click', () => {
            const otpCode = copyBtn.textContent.replace(/\s/g, "");

            // Copy text to clipboard
            navigator.clipboard.writeText(otpCode).then(() => {
                console.log('Text copied to clipboard: ' + otpCode);
            }).catch((err) => {
                alert('Failed to copy text: ', err);
            });
        });
    });
    
    setupCodes();

    // Run immediately so no need to wait for za first interval
    displayCodes();
    setInterval(displayCodes, 100);
});