"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const changeMessageButton = document.getElementById('changeMessageBtn');
    changeMessageButton.addEventListener('click', () => {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
          <h2>Message Changed!</h2>
          <p>You clicked the button, and the message has changed.</p>
      `;
    });
});
