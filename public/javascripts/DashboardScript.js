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



