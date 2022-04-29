const users = [];

// join user to chat with their id
function userJoin(id,username,room) {
    const user = {id,username,room};
    users.push(user);
    return user;
}



// get the current user by id
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// user leaves chat 
function userLeave(id){
    const index = users.findIndex(user => user.id === id);
    if(index !== -1){
        return users.splice(index,1)[0]; // only one user
    }
}

// get room user 
function getRoomUser(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUser
};