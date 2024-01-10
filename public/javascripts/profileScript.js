function menuToggle() {
    const toggleMenu = document.querySelector(".menu");
    toggleMenu.classList.toggle("active");
}

// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');
const logoutButton = document.querySelector(".btnLogout");
const profile = document.getElementById("profile")

menuBar.addEventListener('click', function () {
    sidebar.classList.toggle('hide');
    profile.classList.remove('active');
})

logoutButton.addEventListener("click", () => {
    sidebar.classList.toggle('hide');
    profile.classList.remove('active');

})

$(document).on("click", ".btnLogout", () => {
    sidebar.classList.toggle('hide');
    profile.classList.remove('active');
})