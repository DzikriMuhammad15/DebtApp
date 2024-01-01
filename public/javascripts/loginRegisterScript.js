const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});



// Event listener yang membutuhkan waktu lama
function longRunningOperation() {
    // Menampilkan overlay atau elemen pemuatan saat operasi dimulai
    document.getElementById('loading-overlay').style.display = 'flex';

    // Proses operasi yang membutuhkan waktu lama
    setTimeout(function () {
        // Selesai, menyembunyikan overlay atau elemen pemuatan
        document.getElementById('loading-overlay').style.display = 'none';
    }, 5000); // Contoh: Menunggu 3 detik
}

// Menetapkan event listener ke elemen atau kejadian tertentu
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('loading-overlay').style.display = 'none'; // Pastikan overlay tersembunyi awalnya
    document.getElementById('loading-spinner').style.display = 'none'; // Optional: Jika tidak menggunakan animasi spinner

    // Menetapkan event listener ke tombol atau elemen yang akan memicu operasi yang membutuhkan waktu lama

    // const form = document.querySelector("form");
    //   const emailError = document.querySelector(".email.error");
    //   const passwordError = document.querySelector(".password.error");
    const buttonLogin = document.getElementById("signIn");
    const passwordError = document.querySelector(".password.error");
    const inputEmailLogin = document.getElementById("emailLogin");
    const inputPasswordLogin = document.getElementById("passwordLogin");

    // console.log(buttonLogin);
    // console.log(passwordError);
    // console.log(inputUsernameLogin);
    // console.log(inputPasswordLogin);

    buttonLogin.addEventListener("click", async (e) => {
        e.preventDefault();
        longRunningOperation();
        // console.log("halo");
        // reset errors
        passwordError.textContent = "";

        // get values
        const email = inputEmailLogin.value;
        const password = inputPasswordLogin.value;

        try {
            const res = await fetch("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email: email, password: password }),
                headers: { "Content-Type": "application/json" },
            });
            const response = await res.json();
            console.log(response);
            if (response.user) {
                // login berhasil
                this.location.assign("/dashboard");
            }
            else {
                // login gagal
                const arrayError = Object.values(response.error);
                console.log(arrayError);
                arrayError.forEach((el) => {
                    if (el.length > 0) {
                        passwordError.textContent = el;
                    }
                })
            }

        } catch (err) {
            console.log(err);
        }
    });


    const firstNameInputRegister = document.getElementById("firstNameInputRegister");
    const lastNameInputRegister = document.getElementById("lastNameInputRegister");
    const emailInputRegister = document.getElementById("emailInputRegister");
    const passwordInputRegister = document.getElementById("passwordInputRegister");
    const errorDivRegister = document.querySelector(".error.email");
    const buttonRegister = document.getElementById("buttonSignup");

    // console.log({ firstNameInputRegister, lastNameInputRegister, emailInputRegister, passwordInputRegister, errorDivRegister, buttonRegister });

    buttonRegister.addEventListener("click", async (e) => {
        e.preventDefault();
        longRunningOperation();
        // TODO PASTIIN DULU ISI DARI ERROR DIVNYA KOSONG
        errorDivRegister.textContent = "";
        // TODO PANGGIL POST UNTUK MELAKUKAN REGISTER
        const firstName = firstNameInputRegister.value;
        const lastName = lastNameInputRegister.value;
        const email = emailInputRegister.value;
        const password = passwordInputRegister.value
        try {
            const res = await fetch("/auth/signup", {
                method: "POST",
                body: JSON.stringify({ email: email, password: password, firstName: firstName, lastName: lastName }),
                headers: { "Content-Type": "application/json" },
            });
            // TODO TANGKAP RESPONSENYA
            const response = await res.json();
            console.log(response);
            if (response.user) {
                // TODO JIKA RESPONSENYA BERHASIL, REDIRECT KE DASHBOARD
                this.location.assign("/dashboard");
            }
            else {
                // TODO KALALU RESPONSENYA GAGAL, ATUR SI BAGIAN ERROR DIVNYA
                const arrayError = Object.values(response.error);
                console.log(arrayError);
                arrayError.forEach((el) => {
                    if (el.length > 0 && errorDivRegister.textContent == "") {
                        errorDivRegister.textContent = el;
                    }
                })
            }

        }
        catch (err) {
            console.log(err);
        }
    })


});