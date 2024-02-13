/**
 * Get the sum of all arguments.
 * 
 * @returns number
 */
function sum() {
    // Convert the `arguments` object to an array and use Array.reduce to compute for the sum.
    return Array.prototype.slice.call(arguments).reduce((a, b) => a + b, 0);
}

console.log(sum(23, 45 + 1))
console.log(sum(99999, 1))
console.log(sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10))