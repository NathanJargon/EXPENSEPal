<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
    //console.log('dateChange.js loaded');
    // Get all the expense date elements
    const expenseDateElements = document.querySelectorAll('.expense-date');
    // console.log(expenseDateElements);
=======

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
    //console.log('dateChange.js loaded');
    // Get all the expense date elements
    const expenseDateElements = document.querySelectorAll('.expense-date');

    // Loop through each date element
    expenseDateElements.forEach(function(dateElement) {
        // Get the full date from the element's text content
        const fullDate = dateElement.textContent;

        // Parse the full date as a Date object
        const parsedDate = new Date(fullDate);

        // Format the date as "YY-MM-DD"
        const formattedDate = parsedDate.toLocaleDateString('en-GB', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
        });

        // Set the element's text content to the formatted date
        dateElement.textContent = formattedDate;
    });
});
