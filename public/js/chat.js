const socket = io();
const $messageForm = document.querySelector("#chat");
const $messageInput = $messageForm.querySelector("input");
const $messageButton = $messageForm.querySelector("button");
const $sendLocation = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

//options
const { userName, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
socket.on("message", message => {
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm a")
    });
    $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", url => {
    const html = Mustache.render(locationTemplate, {
        url: url.url,
        createdAt: moment(url.createdAt).format("h:mm a")
    });
    $messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", e => {
    e.preventDefault();
    $messageButton.setAttribute("disabled", "disabled");
    socket.emit("sendMessage", e.target.elements.message.value, error => {
        $messageButton.removeAttribute("disabled");
        $messageInput.value = "";
        $messageInput.focus();
        if (error) {
            return console.log(error);
        }
        console.log("Message delivered!");
    });
});
$sendLocation.addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("GeoLocation is not supported by your browser");
    }

    $sendLocation.setAttribute("disabled", "disabled");
    navigator.geolocation.getCurrentPosition(position => {
        socket.emit(
            "sendLocation", {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            },
            () => {
                $sendLocation.removeAttribute("disabled");
                console.log("Location Shared");
            }
        );
    });
});

socket.emit("join", { userName, room });