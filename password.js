const fs = require('fs');
const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

const checkPassword = async () => {
    try {
        const fileContent = fs.readFileSync('password.txt', 'utf8');
        
        if (fileContent.trim()) {
            const storedHash = fileContent.trim();
            
            const password = await new Promise((resolve) => {
                rl.question('Please enter the password: ', (answer) => {
                    resolve(answer);
                });
            });

            const inputHash = hashPassword(password);
            
            if (inputHash === storedHash) {
                console.log('Correct password!');
            } else {
                console.log('Incorrect password!');
            }
        } else {
            await setNewPassword();
        }
    } catch (error) {
        await setNewPassword();
    }
    
    rl.close();
};

const setNewPassword = async () => {
    const password = await new Promise((resolve) => {
        rl.question('Create a new password: ', (answer) => {
            resolve(answer);
        });
    });

    const confirmPassword = await new Promise((resolve) => {
        rl.question('Confirm the password: ', (answer) => {
            resolve(answer);
        });
    });

    if (password === confirmPassword) {
        const hash = hashPassword(password);
        fs.writeFileSync('password.txt', hash);
        console.log('Password saved successfully!');
    } else {
        console.log('The passwords do not match! Try again.');
        await setNewPassword();
    }
};

checkPassword();
