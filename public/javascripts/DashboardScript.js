const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item => {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i => {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});




// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');
const logoutButton = document.querySelector(".btnLogout");

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})

logoutButton.addEventListener("click", () => {
	sidebar.classList.toggle('hide');
})







const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
	if (window.innerWidth < 576) {
		e.preventDefault();
		searchForm.classList.toggle('show');
		if (searchForm.classList.contains('show')) {
			searchButtonIcon.classList.replace('bx-search', 'bx-x');
		} else {
			searchButtonIcon.classList.replace('bx-x', 'bx-search');
		}
	}
})





if (window.innerWidth < 768) {
	sidebar.classList.add('hide');
} else if (window.innerWidth > 576) {
	searchButtonIcon.classList.replace('bx-x', 'bx-search');
	searchForm.classList.remove('show');
}


window.addEventListener('resize', function () {
	if (this.innerWidth > 576) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})



const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
	if (this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})

// $("#body").on("click", ".lastLogoutButton", () => {
// 	// redirect ke logout
// 	location.assign("/auth/logout")
// })



// ! LOGIC
const acceptButtons = document.getElementsByClassName('acceptRequest');

console.log(acceptButtons);

for (let i = 0; i < acceptButtons.length; i++) {
	acceptButtons[i].addEventListener('click', async function (e) {
		e.preventDefault()
		try {
			// TODO ambil dulu data id yang tersimpan di dalam buttonnya
			const id = acceptButtons[i].getAttribute("data-id");
			// TODO lakukan fetch api post ke endpoint /social/acceptRequest dengan bodynya adalah id:(id yang tersimpan dalam button)
			const url = "/social/acceptRequest";
			console.log({ id: id });
			const data = { id: id };
			const option = {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			}
			await fetch(url, option);
			location.assign('/social/addFriend');

		}
		catch (err) {
			console.log(err);
		}
	})
}

const searchAddFriend = document.getElementsByClassName("searchAddFriend");
console.log(searchAddFriend);
if (searchAddFriend.length > 0) {
	searchAddFriend[0].addEventListener('click', async function (e) {
		try {
			e.preventDefault();
			var input = document.getElementById("emailAddFriend").value;
			location.assign(`/social/addFriend/searchEmail/${input}`)
			// const url = "/social/addFriend/searchEmail";
			// const data = { email: input };
			// const option = {
			// 	method: "POST",
			// 	headers: {
			// 		'Content-Type': 'application/json'
			// 	},
			// 	body: JSON.stringify(data)
			// }
			// await fetch(url, option);
		}
		catch (err) {
			console.log(err);
		}
	})
}

const buttonAccept = document.getElementsByClassName("buttonAccept");
console.log(buttonAccept)
if (buttonAccept.length > 0) {
	buttonAccept[0].addEventListener('click', async function (e) {
		e.preventDefault();
		const url = "/social/requestFriend";
		const email = buttonAccept[0].getAttribute("data-email");
		const data = { email: email };
		const option = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}
		await fetch(url, option);
		location.assign("/social/addFriend");
	})
}

const buttonVerify = document.getElementsByClassName("verifyDebt");
if (buttonVerify.length > 0) {
	for (let i = 0; i < buttonVerify.length; i++) {
		buttonVerify[i].addEventListener("click", async function (e) {
			e.preventDefault();
			// console.log(buttonVerify[i].getAttribute("data-id"));
			const url = "/debt/verifyDebtRequest";
			const transactionId = buttonVerify[i].getAttribute("data-id");
			const data = { idTransaksi: transactionId };
			const option = {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			}
			await fetch(url, option);
			location.assign("/debt")
		})
	}
}


// Gunakan event delegation pada elemen yang selalu ada (document dalam contoh ini)
$(document).on("click", ".createNewDebtButton", async (e) => {
	try {
		e.preventDefault();
		const emailError = document.querySelector(".email.error");
		const amountError = document.querySelector(".amount.error");

		emailError.textContent = "";
		amountError.textContent = "";

		// TODO: ambil dulu inputan dari form
		const emailInput = document.getElementById("emailInputDebt");
		const amountInput = document.getElementById("amountInputDebt");
		const descInput = document.getElementById("descriptionInputDebt");
		console.log(emailInput.value);
		console.log(amountInput.value);
		console.log(descInput.value);

		const url = "/debt/createDebtRequest";
		const data = { email: emailInput.value, amount: amountInput.value, description: descInput.value };
		const option = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}
		const result = await fetch(url, option);
		const hasil = await result.json();
		if (hasil.error) {
			emailError.textContent = hasil.error.email;
			amountError.textContent = hasil.error.amount;
		}
		if (hasil.result) {
			location.assign("/debt");
		}
	}
	catch (err) {
		console.log(err);
	}

});


const payDebtButton = document.getElementsByClassName("payDebt");
if (payDebtButton.length > 0) {
	for (let i = 0; i < payDebtButton.length; i++) {
		payDebtButton[i].addEventListener("click", async function (e) {
			e.preventDefault();
			const idTransaction = payDebtButton[i].getAttribute("data-id");
			// munculkan modal
			var modal = new bootstrap.Modal(document.getElementById("modalCreatePaymentRequest"));
			modal.show();
			const submitPayButton = document.getElementById("submitPayButton");
			const amount = document.getElementById("amountInputPay");
			const description = document.getElementById("descriptionInputPay");
			submitPayButton.addEventListener("click", async function (e) {
				e.preventDefault();
				const amountError = document.getElementById("amountErrorDiv");
				amountError.textContent = "";
				const url = "/payment/createPayment";
				const data = { amount: amount.value, description: description.value, idTransaction };
				const option = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)
				}
				const result = await fetch(url, option);
				const hasil = await result.json();
				console.log(amountError);
				if (hasil.ok) {
					location.assign("/payment");
				}
				else {
					// error
					amountError.textContent = hasil.error.amount
				}
			})
		})
	}
}

const verifyPaymentButton = document.getElementsByClassName("verifyPayment");
if (verifyPaymentButton.length > 0) {
	for (let i = 0; i < verifyPaymentButton.length; i++) {
		verifyPaymentButton[i].addEventListener("click", async function (e) {
			e.preventDefault();
			const url = "/payment/verifyPayment";
			const idPayment = verifyPaymentButton[i].getAttribute("data-id");
			const data = { idPayment };
			const option = {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			}
			const result = await fetch(url, option);
			location.assign("/payment")
		})
	}
}

const paymentHistoryButton = document.querySelectorAll(".paymentHistoryButton");
console.log(paymentHistoryButton);

if (paymentHistoryButton.length > 0) {
	for (let i = 0; i < paymentHistoryButton.length; i++) {
		paymentHistoryButton[i].addEventListener("click", async (e) => {
			e.preventDefault();
			try {
				const id = paymentHistoryButton[i].getAttribute("data-id")
				// todo ambil dulu transaksi yang bersangkutan
				const url = `/debt/getTransactionById/${id}`;
				const option = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					},
				}
				const result = await fetch(url, option);
				const hasil = await result.json();
				const payments = hasil.paid;
				// console.log(payments);
				const url1 = "/payment/getPaymentByArrayOfId";
				const data1 = { arrayOfId: payments };
				const option1 = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data1)
				}
				const result1 = await fetch(url1, option1);
				const hasil1 = await result1.json();
				console.log(hasil1);
				// todo masukkan menjadi innerHTML
				let innerHtml = `<div class="order modalPaymentHistoryScrool">
				<table>
                <thead>
                  <tr>
                    <th>Melakukan Pembayaran</th>
                    <th>Menerima Pembayaran</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>`
				hasil1.forEach((element => {
					let temp = `<tr>
                    <td>${element.emailHutang}</td>
                    <td>${element.emailPiutang}</td>
                    <td>${element.description}</td>
                    <td>${element.date}</td>
                    <td>${element.amount}</td>
                  </tr>`
					innerHtml = innerHtml + temp;
				}))
				innerHtml = innerHtml + `</tbody >
				  </table > </div>`

				const isiModalPaymentHistory = document.getElementById("isiModalPaymentHistory");
				isiModalPaymentHistory.innerHTML = innerHtml;
				// todo show modal

				var modal = new bootstrap.Modal(document.getElementById("modalPaymentHistory"), {
					keyboard: false,
					backdrop: 'static'
				});
				modal.show();
			}
			catch (err) {
				console.log(err);
			}
		})
	}
}

