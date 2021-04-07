async function loadAndDiaplayRoom() {
    //loadmessage
    $(".user_left .loading").removeClass("hide")
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
        let cookie = document.cookie
        cookie = cookie.replace("idUser=","")
        let name=""
        for (let i of data.data) {
            let lastMessage = "";
            
            try {
                const response1 = await fetch("/api/lastMessage", {
                    method: 'POST',
                    credentials: 'same-origin', // include, *same-origin, omit
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({roomId:i.roomId})
        
                });
                let data_mess=await response1.json()
                lastMessage = data_mess.data[0].message
                if(cookie == data_mess.data[0].userId){
                    name="Bạn"
                }else{
                    name = data_mess.data[0].userId
                }
            } catch (error) {
                console.log(error)
                lastMessage = ""
            }
            
            string += `<div class="user__left__item user_display d-flex align-items-center" data-userid=${i.userId} data-roomid = ${i.roomId}>
                                        <div class="user__left__item__img">
                                            <img src="${i.image}"
                                                alt="user">
                                        </div>
                                        <div class="user__left__item__mess d-flex flex-column justify-content-center  align-items-baseline">
                                            <span class="partner_name">${i.name}</span>
                                            <span class="partner_mess">${name}: ${lastMessage}</span>
                                        </div>
                                    </div>`
        }

        $(".user_left .loading").addClass("hide")
        $(".user_left").append(string)

    } catch (error) {
        console.log(error)
    }

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

	$(".right_chat .room-container ").css("max-height",$(".right_chat").outerHeight()- $(".room_name ").outerHeight()-$(".form_chat ").outerHeight())
    let roomId;
    for (let i of mess) {
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
            if ($(".right_chat .room-container").children().last().hasClass("you")) {
                roomId = $(".right_chat .room-container").data("roomid")
                let chatroom = $(".room-container[data-roomid=" + roomId + "]")
                chatroom.children(".you").children(".your_message_group").last().append(`<div class="mess-container your_message"  data-time=${i.createAt}>
																		<div class="mess">${i.message}</div>
                                                                    </div>`)
                
            } else {
                roomId = $(".right_chat .room-container").data("roomid")
                let chatroom = $(".room-container[data-roomid=" + roomId + "]")

                chatroom.append(`<div class="you">
													<div class="your_image">
														<img src=${i.image}
															alt="user">
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
    let chatroom = $(".right_chat .room-container[data-roomid=" + roomId + "]")
    $(".user_left .room-container[data-roomid=" + roomId + "]").replaceWith(chatroom.clone())
    
}

function addChatPartner(data) {
    let {roomId,message,createAt,image} = data.data
    let sendById =data.sendById
    let name = data.name
    if (!$(".room-container[data-roomid=" + roomId + "]")[0]) {
        //find user
        if (!$(".room-container[data-userid=" + sendById + "]")[0] && $(".user__left__item[data-userid=" + sendById + "]")[0]){
            
            
        }else{
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
    $(".user__left__item[data-userid=" + sendById + "] .user__left__item__mess .partner_mess").text(`${name}: ${message}`)
    if(!$(".right_chat .room-container[data-userid=" + sendById + "]")[0]){
        $(".user__left__item[data-userid=" + sendById + "] .user__left__item__mess .partner_mess").css({"color":"#2E89FF", "font-weight":600})
    }
    $(".user__left__item[data-userid=" + sendById + "]").insertAfter(".user_left .loading")


}

function loadmorechat(mess) {
		for (let i of mess) {
			if (i.isMe) {
				if ($(".right_chat .room-container").children().first().hasClass("me")) {
					let roomId = $(".right_chat .room-container").data("roomid")
					let chatroom = $(".room-container[data-roomid=" + roomId + "]")
					chatroom.children(".me").prepend(`<div class="mess-container my_message"  data-time=${i.createAt}>
																<div class="mess">${i.message}</div>
															</div>`)
				} else {

					let roomId = $(".right_chat .room-container").data("roomid")
					let chatroom = $(".room-container[data-roomid=" + roomId + "]")

					chatroom.prepend(`<div class="me">
														<div class="mess-container my_message"  data-time=${i.createAt}>
															<div class="mess">${i.message}</div>
														</div>
													</div>`)

				}
			} else {
				if ($(".right_chat .room-container").children().first().hasClass("you")) {

					let roomId = $(".right_chat .room-container").data("roomid")
					let chatroom = $(".room-container[data-roomid=" + roomId + "]")

					chatroom.children(".you").children(".your_message_group").prepend(`<div class="mess-container your_message"  data-time=${i.createAt}>
																			<div class="mess">${i.message}</div>
																		</div>`)
				} else {
					let roomId = $(".right_chat .room-container").data("roomid")
					let chatroom = $(".room-container[data-roomid=" + roomId + "]")

					chatroom.prepend(`<div class="you">
														<div class="your_image">
															<img src=${i.image}
																alt="user">
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
	}

	$(document).ready(function () {
		$(".send-message").click(()=>{
			$(".form_chat").submit()
		})
        $("#login_form").submit(e=>{
            e.preventDefault()
            const [username, password, remember_me] = $("#login_form").serializeArray();
            $("#login_form .spinner-border").fadeIn()
            $.post( "/auth",{username: username.value, password:password.value, remember_me:remember_me.value}, function( data ) {
                if(!data.error){
                    location.reload();
                }else{
                    $("#login_form .spinner-border").fadeOut("fast")
                    $("#login_form .login-content-error").text(data.error)
                    $("#login_form .show-error-login").fadeIn("slow");

                }
            });
        })
        $("#login_form input").keypress(function(){
            $("#login_form .show-error-login").fadeOut("slow");
        })
		var popover = new bootstrap.Popover(document.querySelector('[data-bs-toggle="popover"]'), {
				trigger: 'focus',
				html:true,
				content:"<a href='/auth/logout'>Đăng xuất</a>"
			})
		if ($(".chat-container")[0]) {
			
			async function handleScrollLoadChat(){
				if($(".right_chat .room-container").scrollTop() === 0){
					let oldChild = $(".right_chat .room-container").children().first().children(".mess-container").first()

					$(".right_chat .room-container").prepend(`<div class="loading-more-chat pt-2 pb-2 hide d-flex justify-content-center hide">
							<div class="spinner-border text-primary" role="status">
								<span class="visually-hidden">Loading...</span>
							</div>
						</div>`)
					let heightLoading = $(".right_chat .room-container .loading-more-chat ").height()
					let time =$(".right_chat .room-container .mess-container").first().data("time")
					let userId = $(".right_chat .room-container").data("userid")
					try {
						let moredata =await loadRoomByID(userId, time)
						moredata = moredata.message
						$(".right_chat .room-container .loading-more-chat").remove()
						loadmorechat(moredata)


						if(moredata.length !=0){
							oldChild[0].scrollIntoView()

						}


					} catch (error) {
						$(".right_chat .room-container .loading-more-chat").remove()
					}
					
				}

			}
			
			let userOnline = [];
			const socket = io()
			socket.on('connect', () => {
                let cookie = document.cookie
				socket.emit("register-id", cookie.replace("idUser=",""))

			});
			socket.on('disconnect', () => {
				console.log("Mat ket noi voi server");
			});

			socket.on("register-id", data => {
				let {id, userId} = data;
				let user = userOnline.find(u => u.id==id)
				user.userId = userId
			})

			socket.on("list-users", users => {
				users.forEach(u=>{
					if(u.id !== socket.id){
						userOnline.push(u)
					}
				})
			})
			socket.on("new-message", data => {
				addChatPartner(data)
				$(".right_chat .room-container").animate({scrollTop: $(".right_chat .room-container").prop("scrollHeight")},0);
			})
			socket.on("new-user", data => {
				userOnline.push(data)
			})
			socket.on("user-leave", id => {
				userOnline =userOnline.filter(e=>e.id !== id)
			})

			$(document).click(function (event) {
				var clickover = $(event.target);
				var _opened = $("#collapseSearch").hasClass("show");
				if (_opened === true && !clickover.hasClass("collapseSearchCard") && !clickover.hasClass(
						"input_search_user")) {
					$("#collapseSearch").removeClass("show")
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
				if(!roomId){
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
					
	
				}else{
					if($(this).children(".user__left__item__img").children()[0]){
						$(".partner_image img").attr("src", $(this).children(".user__left__item__img").children().attr("src"))
						//create message  container
						$(".room_name .partner_name").text($(this).children(".user__left__item__mess").children(".partner_name").text())
						
					}else{
						$(".partner_image img").attr("src", $(this).children(".user_search__img").children("img").attr("src"))
						//create message  container
						$(".room_name .partner_name").text($(this).children(".user_search__name").children("p").text())
					}
				}
				
				if($(".user_left  .room-container[data-roomid=" + roomId + "]")[0]){
					let chatroom = $(".user_left  .room-container[data-roomid=" + roomId + "]")
					$(".right_chat .room-container").replaceWith(chatroom.clone())
					$(".right_chat .room-container").scroll(handleScrollLoadChat)

				}else{
					let newchatroom ;
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
					let data  =await loadRoomByID(userId, null)
					let mess = data.message.reverse()
					$(".right_chat .room-container").children('.loading-chat').remove()
					
					displayChat(mess)
					$(".right_chat .room-container").scroll(handleScrollLoadChat)
				}
				// $(".room-container").scroll(handleScrollLoadChat)
				$(".right_chat .room-container").animate({scrollTop: $(".right_chat .room-container").prop("scrollHeight")},0);
				$(".user__left__item[data-userid=" + userId + "] .user__left__item__mess .partner_mess").css({"color":"var(--secondary-text)", "font-weight":400})

				

				// $(".user_left").append(chatroom)

				
			});
			loadAndDiaplayRoom()
			$('.input_chat').on('keydown', function (e) {
				if (e.keyCode === 13 && e.shiftKey === false) {
					if($(".input_chat").text().trim() !== "" ){
						$(".form_chat").submit();
					}
					return false
				}
				
			});
			$(".form_chat ").submit(async e=>{
				e.preventDefault()
				let message = $(".input_chat").text().trim()
				if (message.trim() === "") {
						return 
				}
				$(".input_chat").text("")
				if($(".right_chat .room-container").children().last().hasClass("me")){
					let roomId = $(".right_chat .room-container").data("roomid")
					let chatroom = $(".room-container[data-roomid=" + roomId + "]")
					chatroom.children(".me").append(`<div class="mess-container my_message">
												<div class="mess">${message}</div>
											</div>`)
				}else{

					let roomId = $(".right_chat .room-container").data("roomid")
					let chatroom = $(".room-container[data-roomid=" + roomId + "]")

					chatroom.append(`<div class="me">
										<div class="mess-container my_message">
											<div class="mess">${message}</div>
										</div>
									</div>`)

				}
				$(".right_chat .room-container").animate({scrollTop: $(".right_chat .room-container").prop("scrollHeight")},0);
				let {userid, roomid} = $(".right_chat .room-container").data()
				if(!$(`.user__left__item[data-userid=${userid}]`)[0]){
					 
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
				const response = await fetch("/api/newMessage", {
					method: 'POST',
					credentials: 'same-origin', // include, *same-origin, omit
					headers: {
						'Content-Type': 'application/json'
					},
					body:JSON.stringify({
						message: message,
						roomId: $(".right_chat .room-container").data("roomid"),

					})

				});
				let data_mess = await response.json()
				if(response.status === 200){

					socket.emit('send-room',data_mess);
				}
			

				
			})
		}

	})


	