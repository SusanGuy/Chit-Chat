const users = [];

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();
    if (!username || !room) {
        return {
            error: "Username and room are required"
        };
    }

    const existingUser = users.find(user => {
        return user.username === username && user.room === room;
    });

    if (existingUser) {
        return {
            error: "Username is in use"
        };
    }

    //Store User

    const user = { id, username, room };
    users.push(user);
    return { user };
};

const removedUser = id => {
    const index = users.findIndex(user => {
        return user.id === id;
    });

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const getUser = id => {
    const user = users.find(user => {
        return user.id === id;
    });
    if (!user) {
        return undefined;
    }
    return user;
};

const getUsersInRoom = name => {
    const roomUsers = users.filter(user => {
        return user.room === name;
    });
    return roomUsers;
};

module.exports = {
    addUser,
    removedUser,
    getUser,
    getUsersInRoom
};