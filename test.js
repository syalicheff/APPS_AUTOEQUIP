let debut = new Date()

var date = padTo2Digits(debut.getDate()) + "." + padTo2Digits(debut.getMonth()+1) + "."+debut.getFullYear()

console.log(date)
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}