const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter a string: ', (str) => {
    // Validate
    if (!str) {
        console.error('Please enter a string.')

        process.exit();
    }

    rl.question('Enter a number: ', (num) => {
        // Validate
        if (!num || isNaN(num)) {
            console.error('Please enter a valid number.')

            process.exit();
        }

        rl.question('Enter a character: ', (char) => {
            // Validate
            if (!char) {
                console.error('Please enter a character.')

                process.exit();
            }

            const S = str.trim();
            const N = parseInt(num);
            const C = char.trim();

            let finalString = '';

            // Generate finalString
            // Loop until N times and append S repeatedly
            for (let i = 0; i <= N; i++) {
                finalString += S

                // If finalString length is >= N, then substring it by N length and stop the loop
                if (finalString.length >= N) {
                    finalString = finalString.substring(0, N)

                    break;
                }
            }

            // To get the occurrences, split the string by C and get the length minus 1.
            const occurrences = finalString.split(C).length - 1;

            console.log(`Final string: ${finalString}`)
            console.log(`${occurrences} occurrences.`);

            rl.close();
        });
    });
});