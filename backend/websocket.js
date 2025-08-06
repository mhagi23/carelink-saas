const WebSocket = require('ws');

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('New WebSocket connection');

        ws.on('message', (message) => {
            const data = JSON.parse(message);
            
            switch(data.type) {
                case 'FACILITY_UPDATE':
                    // Broadcast facility updates to all clients
                    broadcast(wss, {
                        type: 'FACILITY_UPDATE',
                        facility: data.facility
                    });
                    break;
                
                case 'TRANSFER_STATUS':
                    // Send transfer status updates
                    broadcast(wss, {
                        type: 'TRANSFER_STATUS',
                        transfer: data.transfer
                    });
                    break;
            }
        });

        // Send initial data
        ws.send(JSON.stringify({
            type: 'CONNECTED',
            message: 'Connected to CareLink real-time updates'
        }));
    });

    function broadcast(wss, data) {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }

    return wss;
}

module.exports = setupWebSocket;