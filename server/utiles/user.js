class Users {
    constructor(){
        this.users =[];
    };

    addUser(id,name,room){
        const person ={id,name,room};
        this.users.push(person);
        return person;
    }
    getUser(id){
        return this.users.filter((user)=>user.id===id)[0]
    };
    removeUser(id){
        const user =this.getUser(id);
        if(user){
            this.users=this.users.filter((use)=>use.id!=id)
        }
        return user
    }
    getRoomUsers(room){
        const roomUsers=this.users.filter((user)=>user.room===room)
        return  roomUsers.map((el)=>el.name)
    }
};

module.exports={Users}