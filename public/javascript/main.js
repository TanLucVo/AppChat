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
        for (let i of data.data) {
            string += `<div class="user__left__item user_display d-flex align-items-center" data-userid=${i.userId} data-roomid = ${i.roomId}>
                                        <div class="user__left__item__img">
                                            <img src="${i.image}"
                                                alt="user">
                                        </div>
                                        <div class="user__left__item__mess d-flex flex-column justify-content-center  align-items-baseline">
                                            <span class="partner_name">${i.name}</span>
                                            <span class="partner_mess">asdasd</span>
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
    for (let i of mess) {
        if (i.isMe) {
            if ($(".right_chat .room-container").children().last().hasClass("me")) {
                let roomId = $(".right_chat .room-container").data("roomid")
                let chatroom = $(".room-container[data-roomid=" + roomId + "]")
                chatroom.children(".me").append(`<div class="mess-container my_message"  data-time=${i.createAt}>
															<div class="mess">${i.message}</div>
														</div>`)
            } else {

                let roomId = $(".right_chat .room-container").data("roomid")
                let chatroom = $(".room-container[data-roomid=" + roomId + "]")

                chatroom.append(`<div class="me">
													<div class="mess-container my_message"  data-time=${i.createAt}>
														<div class="mess">${i.message}</div>
													</div>
												</div>`)

            }
        } else {
            if ($(".right_chat .room-container").children().last().hasClass("you")) {
                let roomId = $(".right_chat .room-container").data("roomid")
                let chatroom = $(".room-container[data-roomid=" + roomId + "]")

                chatroom.children(".you").children(".your_message_group").append(`<div class="mess-container your_message"  data-time=${i.createAt}>
																		<div class="mess">${i.message}</div>
																	</div>`)
            } else {
                let roomId = $(".right_chat .room-container").data("roomid")
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
}

function addChatPartner(data) {
    let {roomId,message,createAt,image} = data
    if (!$(".room-container[data-roomid=" + roomId + "]")[0]) {
        console.log("Khoi load")
    } else {
        if ($(".right_chat .room-container").children().last().hasClass("you")) {
            let roomId = $(".right_chat .room-container").data("roomid")
            let chatroom = $(".room-container[data-roomid=" + roomId + "]")

            chatroom.children(".you").children(".your_message_group").append(`<div class="mess-container your_message"  data-time=${createAt}>
																		<div class="mess">${message}</div>
																	</div>`)
        } else {
            let roomId = $(".right_chat .room-container").data("roomid")
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


}
function loadmorechat(mess) {
    for (let i of mess) {
        if (i.isMe) {
            if ($(".right_chat .room-container").children().last().hasClass("me")) {
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
            if ($(".right_chat .room-container").children().last().hasClass("you")) {
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
