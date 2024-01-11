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

$(document).on("click", ".changePassword", () => {
    sidebar.classList.toggle('hide');
    profile.classList.remove('active');
})

$(document).on("click", ".changePasswordButton", async (e) => {
    e.preventDefault();
    try {

        // todo ambil dulu value dari newPassword dan newPasswordConfirmation
        const newPassword = document.getElementById("newPassword").value;
        const newPasswordConfirmation = document.getElementById("newPasswordConfirmation").value;
        // todo ambil _id dari current user (pada res.locals)
        const id = document.getElementById("modalChangePassword").getAttribute("data-id");
        // todo ambil element penampung error
        const penampungError = document.querySelector(".changePasswordError");
        // todo panggil endpoint untuk change password (dalam try catch)
        const url = `/auth/changePassword`;
        const data = { newPassword: newPassword, newPasswordConfirmation: newPasswordConfirmation, id: id };
        const option = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        const result = await fetch(url, option);
        const hasil = await result.json();
        if (!hasil.error) {
            // todo jika hasilnya adalah success, maka keluarkan pesan berhasil pada penampung error (dengan elemen berhasil)
            const isianBerhasil = `<div class="alert alert-primary" role="alert">
            Password has been changed
          </div>`;
            penampungError.innerHTML = isianBerhasil;
        }
        else {
            // todo jika hasilnya adalah error, maka keluarkan pesan error.password pada penampung error (dengan elemen gagal)
            const isianGagal = `<div class="alert alert-danger" role="alert">
            ${hasil.error.password}
          </div>`;
            penampungError.innerHTML = isianGagal;
        }
    }
    catch (err) {
        console.log(err);
    }
})