//
document.addEventListener('DOMContentLoaded', function() {
    const detailsElements = document.querySelectorAll('details');
    detailsElements.forEach((details) => {
        const summary = details.querySelector('summary');
        summary.addEventListener('click', () => {
            details.classList.toggle('open');
        });
    });
});
