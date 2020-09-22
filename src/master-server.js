const io = require("socket.io");
const server = io.listen(8000);

let primaryKeyValues = new Map();

let masterServer = () => { 
    // event fired every time a new client connects:
    server.on("connection", (socket) => {
        console.info(`Client server connected with id: ${socket.id}`); 

        // initialize this client's sequence number
        primaryKeyValues.set(socket, 1);

        // when socket disconnects, remove it from the list:
        socket.on("disconnect", () => {
            primaryKeyValues.delete(socket);
            console.info(`Client server gone with id: ${socket.id}`);
        });
    });

    // sends each client its current sequence number
    setInterval(() => {
        for (const [client, primaryKeyValue] of primaryKeyValues.entries()) {
            client.emit("primaryKeyValue", primaryKeyValue);
            primaryKeyValues.set(client, primaryKeyValue + 1);
        }
    }, 1000);
};

module.exports = masterServer;