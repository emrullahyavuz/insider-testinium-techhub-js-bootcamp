// Collatz Problemi: 1 milyondan küçük en uzun zinciri hangi sayı başlatır?

function collatzLength(n) {
    let length = 1;
    while (n !== 1) {
        if (n % 2 === 0) {
            n = n / 2;
        } else {
            n = 3 * n + 1;
        }
        length++;
    }
    return length;
}

let maxLength = 0;
let startingNumber = 0;

for (let i = 1; i < 1_000_000; i++) {
    const length = collatzLength(i);
    if (length > maxLength) {
        maxLength = length;
        startingNumber = i;
    }
}

console.log(`En uzun zinciri başlatan sayı: ${startingNumber}`);
console.log(`Zincir uzunluğu: ${maxLength}`); 