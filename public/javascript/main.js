let mode = localStorage.getItem("mode") || 'light';
	if (mode === "light") {
		$("body").removeClass("dark")
		$("#flexSwitchCheckChecked").prop('checked', false);
		$(".fa-moon").css("color", "var(--bs-gray-dark)")
		$(".fa-sun").css("color", "var(--bs-teal)")
	} else {
		$("body").addClass("dark")
		$("#flexSwitchCheckChecked").prop('checked', true);
		$(".fa-sun").css("color", "var(--bs-gray-dark)")
		$(".fa-moon").css("color", "var(--bs-teal)")
	}
	async function handleScrollLoadChat() {
		if ($(".right_chat .room-container").scrollTop() === 0) {
			let oldChild = $(".right_chat .room-container").children().first().children(".mess-container").first()

			$(".right_chat .room-container").prepend(`<div class="loading-more-chat pt-2 pb-2 hide d-flex justify-content-center hide">
						<div class="spinner-border text-primary" role="status">
							<span class="visually-hidden">Loading...</span>
						</div>
					</div>`)
			let time = $(".right_chat .room-container .mess-container").first().data("time")
			let room = $(".right_chat .room-container").data("roomid")
			try {
				let moredata = await loadRoomByRoomID(room, time)
				moredata = moredata.data
				$(".right_chat .room-container .loading-more-chat").remove()

				loadmorechat(moredata)
				if (moredata.length != 0) {
					oldChild[0].scrollIntoView()
				}

			} catch (error) {
				$(".right_chat .room-container .loading-more-chat").remove()
			}

		}

	}
function loadmorechat(mess) {
	for (let i of mess) {
		console.log(i)
		if (i.isMe) {

			if ($(".right_chat .room-container").children().first().hasClass("me")) {
				let roomId = $(".right_chat .room-container").data("roomid")
				let chatroom = $(".right_chat .room-container[data-roomid=" + roomId + "]")
				chatroom.children(".me").first().prepend(`<div class="mess-container my_message"  data-time=${i.createAt}>
																<div class="mess">${i.message}</div>
															</div>`)
			} else {

				let roomId = $(".right_chat .room-container").data("roomid")
				let chatroom = $(".right_chat .room-container[data-roomid=" + roomId + "]")

				chatroom.prepend(`<div class="me">
									<div class="mess-container my_message"  data-time=${i.createAt}>
										<div class="mess">${i.message}</div>
									</div>
								</div>`)

			}
		} else {
			if ($(".right_chat .room-container").children().first().hasClass("you") && i.userId ==$(".right_chat .room-container").children().first().data("userid")) {

				let roomId = $(".right_chat .room-container").data("roomid")
				let chatroom = $(".right_chat .room-container[data-roomid=" + roomId + "]")

				chatroom.children(".you").first().children(".your_message_group").prepend(`<div class="mess-container your_message"  data-time=${i.createAt}>
																			<div class="mess">${i.message}</div>
																		</div>`)
			} else {
				let roomId = $(".right_chat .room-container").data("roomid")
				let chatroom = $(".right_chat .room-container[data-roomid=" + roomId + "]")

				chatroom.prepend(`<div class="you mt-2" data-userid=${i.userId}>
														<div class="your_image">
															<span class="d-inline-block" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-content="${i.name}">
																<img src=${i.image} alt="user" data-bs-toggle="popover" data-bs-trigger="focus" title="${i.name}">
															</span>
														</div>
														<div class=" your_message_group">
															<div class="mess-container your_message"  data-time=${i.createAt}>
																<div class="mess">${i.message}</div>
															</div>
														</div>
													</div>`)


			}

		}

	}
	$(`.left_chat .room-container[data-roomid=${$(".right_chat .room-container").data("roomid")}]`).replaceWith( $(".right_chat .room-container").clone())
}

function addChatPartner(data) {
let {
	roomId,
	message,
	createAt,
	image
} = data.data
let sendById = data.sendById
let name = data.name
if (!$(".room-container[data-roomid=" + roomId + "]")[0]) {
	//find user
	if (!$(".room-container[data-userid=" + sendById + "]")[0] && $(".user__left__item[data-userid=" + sendById + "]")[0]) {


	} else {
		$(".user_left .loading").after(`
					<div class="user__left__item user_display d-flex align-items-center" data-userid="${sendById}" data-roomid="${roomId}">
						<div class="user__left__item__img">
							<img src="${image}" alt="user">
						</div>
						<div class="user__left__item__mess d-flex flex-column justify-content-center  align-items-baseline">
							<span class="partner_name">${name}</span>
							<span class="partner_mess">Bạn: ${message}</span>
						</div>
					</div>
				`)
	}
} else {
	if ($(".room-container[data-roomid=" + roomId + "]").children().last().hasClass("you")) {

		let chatroom = $(".room-container[data-roomid=" + roomId + "]")

		chatroom.children(".you").children(".your_message_group").append(`<div class="mess-container your_message"  data-time=${createAt}>
																	<div class="mess">${message}</div>
																</div>`)
	} else {

		let chatroom = $(".room-container[data-roomid=" + roomId + "]")

		chatroom.append(`<div class="you">
												<div class="your_image">
													<img src=${image}
														alt="user">
												</div>
												<div class=" your_message_group">
													<div class="mess-container your_message"  data-time=${createAt}>
														<div class="mess">${message}</div>
													</div>
												</div>
											</div>`)


	}
}
if($(".user__left__item[data-roomid=" + roomId + "]").parent().hasClass("group_left")){
	$(".group_left .user__left__item[data-roomid=" + roomId + "] .user__left__item__mess .partner_mess").text(`${name}: ${message}`)
	if (!$(".right_chat .room-container[data-roomid=" + roomId + "]")[0]) {
		$(".group_left .user__left__item[data-roomid=" + roomId + "] .user__left__item__mess .partner_mess").css({
			"color": "#2E89FF",
			"font-weight": 600
		})
	}
	$(".group_left .user__left__item[data-roomid=" + roomId + "]").insertAfter(".group_left .loading")
}else{
	$(".user__left__item[data-roomid=" + roomId + "] .user__left__item__mess .partner_mess").text(`${name}: ${message}`)
	if (!$(".right_chat .room-container[data-roomid=" + roomId + "]")[0]) {
		$(".user__left__item[data-roomid=" + roomId + "] .user__left__item__mess .partner_mess").css({
			"color": "#2E89FF",
			"font-weight": 600
		})
	}
	$(".user__left__item[data-roomid=" + roomId + "]").insertAfter(".user_left .loading")

}




}
async function loadAndDiaplayRoom() {
//loadmessage
$(".user_left .loading").removeClass("hide")
$(".group_left .loading").removeClass("hide")
$(".user_left").css("overflow", "hidden")
$(".group_left").css("overflow", "hidden")
try {
	const response = await fetch("/api/getRoom", {
		method: 'POST',
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
			'Content-Type': 'application/json'
		},

	});
	let data = await response.json()
	let string = ""
	let stringGroup = ""
	let cookie = document.cookie
	cookie = cookie.replace("idUser=", "")
	let name = ""
	for (let i of data.data) {
		let lastMessage = "";
		let roomId = i._id;
		let userId = i.users.filter(e => e.id !=cookie).map(e=>e.id)
		let image = i.users.filter(e => e.id !=cookie).map(e=>e.image)
		
		try {
			const response1 = await fetch("/api/lastMessage", {
				method: 'POST',
				credentials: 'same-origin', // include, *same-origin, omit
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					roomId: roomId	
				})

			});
			let data_mess = await response1.json()
			lastMessage = data_mess.data[0].message
			if (cookie == data_mess.data[0].userId) {
				name = "Bạn"
			} else {
				name = data_mess.data[0].name
			}

		} catch (error) {
			lastMessage = ""
		}
		if(lastMessage ==="" && !i.roomName) continue
		if(i.roomName){
			if(lastMessage ===""){
				stringGroup += `<div class="user__left__item user_display group d-flex align-items-center" data-userid=${userId[0]} data-roomid = ${roomId}>
									<div class="user__left__item__img">
										<img src="${image[0]}"
											alt="user">
									</div>
									<div class="user__left__item__mess d-flex group flex-column justify-content-center  align-items-baseline">
										<span class="partner_name">${i.roomName}</span>
										<span class="partner_mess"></span>
									</div>
								</div>`
			}else{
				stringGroup += `<div class="user__left__item user_display d-flex align-items-center" data-userid=${userId[0]} data-roomid = ${roomId}>
									<div class="user__left__item__img">
										<img src="${image[0]}"
											alt="user">
									</div>
									<div class="user__left__item__mess d-flex flex-column justify-content-center  align-items-baseline">
										<span class="partner_name">${i.roomName}</span>
										<span class="partner_mess">${name}: ${lastMessage}</span>
									</div>
								</div>`
			}
			
			continue
		} 
		string += `<div class="user__left__item user_display d-flex align-items-center" data-userid=${userId[0]} data-roomid = ${roomId}>
									<div class="user__left__item__img">
										<img src="${image[0]}"
											alt="user">
									</div>
									<div class="user__left__item__mess d-flex flex-column justify-content-center  align-items-baseline">
										<span class="partner_name">${name}</span>
										<span class="partner_mess">${name}: ${lastMessage}</span>
									</div>
								</div>`
	}

	$("#carouselExampleControls").css("max-height",($(".left_chat").outerHeight() - $(".search").outerHeight() - $("nav").outerHeight() -15+"px"))
	$(".user_left .loading").addClass("hide")
	$(".user_left").append(string)
	$(".user_left").css("overflow", "auto")

	$(".group_left .loading").addClass("hide")
	$(".group_left").append(stringGroup)
	$(".group_left").css("overflow", "auto")
} catch (error) {
	console.log(error)
	
	$(".user_left .loading").addClass("hide")
	$(".user_left").css("overflow", "auto")

	$(".group_left .loading").addClass("hide")
	$(".group_left").css("overflow", "auto")
}

}


async function findUserForGroup() {
setTimeout(() => {
	if (!$("#collapseSearch1").hasClass("show")) {
		$("#collapseSearch1").collapse("show")
	}
	$(".collapseSearchCard1 .loading").removeClass("hide")
	$(".collapseSearchCard1").children().not(':first').remove();

	$(".collapseSearchCard1").children().not(':first').promise().done(async function () {
		let query = $("#search-input-group").val().trim()
		if (query === "") {
			$(".collapseSearchCard1 .loading").addClass("hide")
			return
		}
		let string = ""
		try {

			const response = await fetch("/api/getUser", {
				method: 'POST',
				credentials: 'same-origin', // include, *same-origin, omit
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					query: query
				})
			});
			let data = await response.json()

			for (let i of data.data) {
				string += `<div class="user_search user-group d-flex align-items-center" data-userid="${i.id}">
							<div class="user_search__img">
								<img src="${i.image}"
									alt="user">
							</div>
							<div class="user_search__name ms-2">
								<p class="mb-0">${i.name}</p>
							</div>
						</div>`
			}

			$(".collapseSearchCard1").append(string)
			$(".collapseSearchCard1 .loading").addClass("hide")



		} catch (error) {
			$(".collapseSearchCard1").append(string)
			$(".collapseSearchCard1 .loading").addClass("hide")
		}

	});
}, 0);

}

async function loadRoomByID(id, time) {
	//loadmessage

	const response = await fetch("/api/getRoomById", {
		method: 'POST',
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id2: id,
			time: time
		})
	});
	let data = await response.json()
	return data
}
async function loadRoomByRoomID(id, time) {
	//loadmessage

	const response = await fetch("/api/getRoomByRoomId", {
		method: 'POST',
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id: id,
			time, time
		})
	});
	let data = await response.json()
	return data
}
async function loadAndDisplayUser() {
	setTimeout(() => {
		if (!$("#collapseSearch").hasClass("show")) {
			$("#collapseSearch").collapse("show")
		}
		$(".collapseSearchCard .loading").removeClass("hide")
		$(".collapseSearchCard").children().not(':first').remove();

		$(".collapseSearchCard").children().not(':first').promise().done(async function () {
			let query = $("#search-input").val().trim()
			if (query === "") {
				$(".collapseSearchCard .loading").addClass("hide")
				return
			}
			let string = ""
			try {

				const response = await fetch("/api/getUser", {
					method: 'POST',
					credentials: 'same-origin', // include, *same-origin, omit
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						query: query
					})
				});
				let data = await response.json()

				for (let i of data.data) {
					string += `<div class="user_search user_display d-flex align-items-center" data-userid="${i.id}">
                                <div class="user_search__img">
                                    <img src="${i.image}"
                                        alt="user">
                                </div>
                                <div class="user_search__name ms-2">
                                    <p class="mb-0">${i.name}</p>
                                </div>
                            </div>`
				}

				$(".collapseSearchCard").append(string)
				$(".collapseSearchCard .loading").addClass("hide")



			} catch (error) {
				$(".collapseSearchCard").append(string)
				$(".collapseSearchCard .loading").addClass("hide")
			}

		});
	}, 0);

}

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function displayChat(mess) {
	$(".right_chat .room-container ").css("max-height", $(".right_chat").outerHeight() - $(".room_name ").outerHeight() - $(".form_chat ").outerHeight())
	let roomId;
	let isAnotherUser = false;
	let prevId=0;
	for (let i of mess) {
		isAnotherUser = prevId != i.userId
		if (i.isMe) {

			if ($(".right_chat .room-container").children().last().hasClass("me")) {
				roomId = $(".right_chat .room-container").data("roomid")
				let chatroom = $(".room-container[data-roomid=" + roomId + "]")
				chatroom.children(".me").last().append(`<div class="mess-container my_message"  data-time=${i.createAt}>
															<div class="mess">${i.message}</div>
														</div>`)
			} else {

				roomId = $(".right_chat .room-container").data("roomid")
				let chatroom = $(".room-container[data-roomid=" + roomId + "]")

				chatroom.append(`<div class="me">
													<div class="mess-container my_message"  data-time=${i.createAt}>
														<div class="mess">${i.message}</div>
													</div>
												</div>`)

			}
		} else {
			if ($(".right_chat .room-container").children().last().hasClass("you") && !isAnotherUser) {
				roomId = $(".right_chat .room-container").data("roomid")
				let chatroom = $(".room-container[data-roomid=" + roomId + "]")
				chatroom.children(".you").children(".your_message_group").last().append(`<div class="mess-container your_message"  data-time=${i.createAt}>
																		<div class="mess">${i.message}</div>
                                                                    </div>`)

			} else {
				
				roomId = $(".right_chat .room-container").data("roomid")
				let chatroom = $(".room-container[data-roomid=" + roomId + "]")

				chatroom.append(`<div class="you ${isAnotherUser? "mt-2":""}" data-userId = ${i.userId}>
													<div class="your_image">
													
														<img src=${i.image} alt="user" data-bs-toggle="popover" data-bs-trigger="focus" title="${i.name}">

													
													</div>
													<div class=" your_message_group">
														<div class="mess-container your_message"  data-time=${i.createAt}>
															<div class="mess">${i.message}</div>
														</div>
													</div>
												</div>`)


			}

		}
		prevId = i.userId

	}
	let chatroom = $(".right_chat .room-container[data-roomid=" + roomId + "]")
	$(".user_left .room-container[data-roomid=" + roomId + "]").replaceWith(chatroom.clone())

}




$(document).ready(function () {
	let mode = localStorage.getItem("mode") || 'light';
	if (mode === "light") {
		$("body").removeClass("dark")
		$("#flexSwitchCheckChecked").prop('checked', false);
		$(".fa-moon").css("color", "var(--bs-gray-dark)")
		$(".fa-sun").css("color", "var(--bs-teal)")
	} else {
		$("body").addClass("dark")
		$("#flexSwitchCheckChecked").prop('checked', true);
		$(".fa-sun").css("color", "var(--bs-gray-dark)")
		$(".fa-moon").css("color", "var(--bs-teal)")
	}

	$("#flexSwitchCheckChecked").click(() => {
		if ($("#flexSwitchCheckChecked").is(':checked')) {
			//nightMode
			$(".fa-sun").css("color", "var(--bs-gray-dark)")
			$(".fa-moon").css("color", "var(--bs-teal)")
			$("body").toggleClass("dark")
			localStorage.setItem("mode", "dark")
		} else {
			//lightmode
			$(".fa-moon").css("color", "var(--bs-gray-dark)")
			$(".fa-sun").css("color", "var(--bs-teal)")
			$("body").toggleClass("dark")
			localStorage.setItem("mode", "light")
		}
	})
	$(".send-message").click(() => {
		$(".form_chat").submit()
	})
	$("#login_form").submit(e => {
		e.preventDefault()
		const [username, password, remember_me] = $("#login_form").serializeArray();
		$("#login_form .spinner-border").fadeIn()
		$.post("/auth", {
			username: username.value,
			password: password.value,
			remember_me: remember_me.value
		}, function (data) {
			if (!data.error) {
				location.reload();
			} else {
				$("#login_form .spinner-border").fadeOut("fast")
				$("#login_form .login-content-error").text(data.error)
				$("#login_form .show-error-login").fadeIn("slow");

			}
		});
	})
	$("#login_form input").keypress(function () {
		$("#login_form .show-error-login").fadeOut("slow");
	})
	var popover = new bootstrap.Popover(document.querySelector('.user[data-bs-toggle="popover"]'), {
		trigger: 'focus',
		html: true,
		content: "<a href='/auth/logout'>Đăng xuất</a>"
	})
	if ($(".chat-container")[0]) {

		

		let userOnline = [];
		const socket = io()
		socket.on('connect', () => {
			let cookie = document.cookie
			socket.emit("register-id", cookie.replace("idUser=", ""))

		});
		socket.on('disconnect', () => {
			console.log("Mat ket noi voi server");
		});

		socket.on("register-id", data => {
			let {
				id,
				userId
			} = data;
			let user = userOnline.find(u => u.id == id)
			user.userId = userId
		})

		socket.on("list-users", users => {
			users.forEach(u => {
				if (u.id !== socket.id) {
					userOnline.push(u)
				}
			})
		})
		socket.on("new-message", data => {
			addChatPartner(data)
			$(".right_chat .room-container").animate({
				scrollTop: $(".right_chat .room-container").prop("scrollHeight")
			}, 0);
		})
		socket.on("new-user", data => {
			userOnline.push(data)
		})
		socket.on("user-leave", id => {
			userOnline = userOnline.filter(e => e.id !== id)
		})

		$(document).click(function (event) {
			var clickover = $(event.target);
			var _opened = $("#collapseSearch").hasClass("show");
			if (_opened === true && !clickover.hasClass("collapseSearchCard") && !clickover.hasClass(
					"input_search_user")) {
				$("#collapseSearch").removeClass("show")
			}
			var _opened = $("#collapseSearch1").hasClass("show");
			if (_opened === true && !clickover.hasClass("collapseSearchCard1") && !clickover.hasClass(
					"input_search_user")) {
				$("#collapseSearch1").removeClass("show")
			}
		});
		var typingTimer; //timer identifier
		var doneTypingInterval = 800; //time in ms, 5 second for example

		$("#search-input").on("click focus", (function () {
			if ($("#search-input").val().trim() === "") return
			$("#collapseSearch").collapse("show")
		}))

		$("#search-input").on('keydown', function () {
			clearTimeout(typingTimer);
		});
		$("#search-input").keypress(async (event) => {
			typingTimer = setTimeout(loadAndDisplayUser, doneTypingInterval);
		})
		$("#search-input").keyup(async (event) => {

			if (event.which === 8 || event.which == 46) {
				typingTimer = setTimeout(loadAndDisplayUser, doneTypingInterval);

			}
		})
		$(document).on("click", ".user_display", async function () {
			$(".right_chat .room_name").removeClass("hide")

			let userId = $(this).data("userid")
			let roomId = $(this).data("roomid")
			if (!roomId) {
				$(".partner_image img").attr("src", $(this).children(".user_search__img").children("img").attr("src"))
				//create message  container
				$(".room_name .partner_name").text($(this).children(".user_search__name").children("p").text())
				try {
					$(".right_chat .room-container").children().not(".loading-chat").fadeOut(0)
					let test = await loadRoomByID(userId, null)
					roomId = test.data._id
					$(this).data("roomid", "asdasdasdasdasd")
					$(".right_chat .room-container").children().not(".loading-chat").fadeIn(0)

				} catch (error) {
					$(".right_chat .room-container").children().not(".loading-chat").fadeIn(0)
				}


			} else {
				if ($(this).children(".user__left__item__img").children()[0]) {
					$(".partner_image img").attr("src", $(this).children(".user__left__item__img").children().attr("src"))
					//create message  container
					$(".room_name .partner_name").text($(this).children(".user__left__item__mess").children(".partner_name").text())

				} else {
					$(".partner_image img").attr("src", $(this).children(".user_search__img").children("img").attr("src"))
					//create message  container
					$(".room_name .partner_name").text($(this).children(".user_search__name").children("p").text())
				}
			}

			if ($(".user_left  .room-container[data-roomid=" + roomId + "]")[0]) {
				let chatroom = $(".user_left  .room-container[data-roomid=" + roomId + "]")
				$(".right_chat .room-container").replaceWith(chatroom.clone())
				$(".right_chat .room-container").scroll(handleScrollLoadChat)

			} else {
				let newchatroom;
				newchatroom = document.createElement('div');
				newchatroom.classList.add("room-container")
				newchatroom.dataset.userid = userId
				newchatroom.dataset.roomid = roomId
				newchatroom = $(newchatroom)
				$(".user_left").append(`<div class="room-container" data-userid=${userId} data-roomid=${roomId}></div>`)
				$(".right_chat .room-container").replaceWith(newchatroom)
				$(".right_chat .room-container").append(`<div class="loading-chat hide d-flex justify-content-center hide">
							<div class="spinner-border text-primary" role="status">
								<span class="visually-hidden">Loading...</span>
							</div>
						</div>`)
				let data =[];
				let mess=[];
				if($(this).parent().hasClass("group_left")){
					data =await loadRoomByRoomID(roomId, null)
					mess = data.data.reverse()

				}else{
					data = await loadRoomByID(userId, null)
					mess = data.message.reverse()
				}
				console.log(data)
				
				$(".right_chat .room-container").children('.loading-chat').remove()

				displayChat(mess)
				$(".right_chat .room-container").scroll(handleScrollLoadChat)
			}
			// $(".room-container").scroll(handleScrollLoadChat)
			$(".right_chat .room-container").animate({
				scrollTop: $(".right_chat .room-container").prop("scrollHeight")
			}, 0);
			$(".user__left__item[data-userid=" + userId + "] .user__left__item__mess .partner_mess").css({
				"color": "var(--secondary-text)",
				"font-weight": 400
			})



			// $(".user_left").append(chatroom)


		});
		loadAndDiaplayRoom()
		$('.input_chat').on('keydown', function (e) {
			if (e.keyCode === 13 && e.shiftKey === false) {
				if ($(".input_chat").text().trim() !== "") {
					$(".form_chat").submit();
				}
				return false
			}

		});
		$(".form_chat ").submit(async e => {
			e.preventDefault()
			let message = $(".input_chat").text().trim()
			if (message.trim() === "") {
				return
			}
			$(".input_chat").text("")
			if ($(".right_chat .room-container").children().last().hasClass("me")) {
				let roomId = $(".right_chat .room-container").data("roomid")
				let chatroom = $(".room-container[data-roomid=" + roomId + "]")
				chatroom.children(".me").append(`<div class="mess-container my_message">
												<div class="mess">${message}</div>
											</div>`)
			} else {

				let roomId = $(".right_chat .room-container").data("roomid")
				let chatroom = $(".room-container[data-roomid=" + roomId + "]")

				chatroom.append(`<div class="me">
										<div class="mess-container my_message">
											<div class="mess">${message}</div>
										</div>
									</div>`)

			}
			$(".right_chat .room-container").animate({
				scrollTop: $(".right_chat .room-container").prop("scrollHeight")
			}, 0);
			let {
				userid,
				roomid
			} = $(".right_chat .room-container").data()
			if (!$(`.user__left__item[data-userid=${userid}]`)[0]) {

				let image = $(`#collapseSearch .user_display[data-userid=${userid}] .user_search__img img`).attr("src")
				let name = $(`#collapseSearch .user_display[data-userid=${userid}] .user_search__name  p`).text()
				$(".user_left .loading").after(`
						<div class="user__left__item user_display d-flex align-items-center" data-userid="${userid}" data-roomid="${roomid}">
							<div class="user__left__item__img">
								<img src="${image}" alt="user">
							</div>
							<div class="user__left__item__mess d-flex flex-column justify-content-center  align-items-baseline">
								<span class="partner_name">${name}</span>
								<span class="partner_mess">Bạn: ${message}</span>
							</div>
						</div>
					`)
			}
			let roomchat = $(".user__left__item[data-roomid="+roomid+"]")
			if(roomchat.parent().hasClass("group_left")){
				roomchat.children(".user__left__item__mess").children(".partner_mess").text(`Bạn: ${message}`)
				roomchat.insertAfter($(".group_left .add_group_chat"))
			}else{
				roomchat.children(".user__left__item__mess").children(".partner_mess").text(`Bạn: ${message}`)
				roomchat.insertAfter($(".user_left .loading"))
			}
			
			const response = await fetch("/api/newMessage", {
				method: 'POST',
				credentials: 'same-origin', // include, *same-origin, omit
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					message: message,
					roomId: $(".right_chat .room-container").data("roomid"),

				})

			});
			let data_mess = await response.json()
			if (response.status === 200) {
				socket.emit('send-room', data_mess);
				
			}



		})
	}

	$(".nav-tabs .nav-link").click(()=>{
		$(".nav-tabs .nav-link").prop('disabled', true);
		setTimeout(() => {
			$(".nav-tabs .nav-link").prop('disabled', false);
		}, 1000);
	})

	var typingTimer; //timer identifier
	var doneTypingInterval = 800;
	$("#add-user-group").submit(e=>{
		e.preventDefault()
	})
	
	$("#search-input-group").on("click focus", (function () {
		if ($("#search-input-group").val().trim() === "") return
		$("#collapseSearch1").collapse("show")
	}))

	$("#search-input-group").on('keydown', function () {
		clearTimeout(typingTimer);
	});
	$("#search-input-group").keypress(async (event) => {
		typingTimer = setTimeout(findUserForGroup, doneTypingInterval);
	})
	$("#search-input-group").keyup(async (event) => {

		if (event.which === 8 || event.which == 46) {
			typingTimer = setTimeout(findUserForGroup, doneTypingInterval);

		}
	})

	$(document).on("click", ".user-group", async function () {
		let userId = $(this).data("userid")
		let imageUser = $(this).children(".user_search__img").children().attr("src")
		let nameUser = $(this).children(".user_search__name").children("p").text()
		if($(`.displayUserGroup .user_search__img[data-userid=${userId}]`)[0]){
			return 
		}
		$(".displayUserGroup").append(`			<div class="user_search__img" tabindex="0" data-bs-toggle="tooltip" title="${nameUser}" data-userid=${userId}>
							<img src=${imageUser} alt="user">
							<i class="fas fa-times deleteUser"></i>
						</div>`)


	})
	$(document).on("click", ".deleteUser", async function () {
		
		$(".deleteUser").click(()=>{
			$(this).parent().remove()
		})

	})


})