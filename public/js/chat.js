const socket = io();
socket.on("message", message => {
    console.log(message);
});

document.querySelector("#chat").addEventListener("submit", e => {
    e.preventDefault();
    socket.emit("sendMessage", e.target.elements.message.value, error => {
        if (error) {
            return console.log(error);
        }
        console.log("The message was delivered");
    });
});

document.querySelector("#send-location").addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("GeoLocation is not supported by your browser");
    }
    navigator.geolocation.getCurrentPosition(position => {
        socket.emit(
            "sendLocation", {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            },
            () => {
                console.log("Location Shared");
            }
        );
    });
});