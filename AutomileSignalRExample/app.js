'use strict';
/* 
 * Automile supports client protocol 1.3 and 1.5. Please DO NOT USE 1.2 since it's not compatible
 * For node there are two tested client libraries  
 * recommended: node-signalr (version  2.0 seems to have something brokes with ws so use node-signalr@1.0.12)
 * other alternative: signalr-client
*/
const signalr = require('node-signalr');

let client = new signalr.client('wss://websocket.automile.com/signalr', ['LiveHub']);

// This is an encrypted token that is retrived from the REST API at this endpoint https://api.automile.com/v1/resourceowner/contacts3/getwebsocketauthenticationtoken. It's valid for 1 month.
client.headers['x-automile-websocket-token'] = 'XXX';

client.on('connected', () => {
    console.log('SignalR client connected.');
});
client.on('reconnecting', (count) => {
    console.log('SignalR client reconnecting(${count}).');
});
client.on('disconnected', (code) => {
    console.log('SignalR client disconnected(' + code + ').');
});
client.on('error', (code, ex) => {
    console.log('SignalR client connect error:' + code + '.');
});

/// This event will trigger when the hub starts and give you all vehicles / assets and their locations
/*
 * Example model
 * {
    VehicleId: 142039,
    IMEI: '359486068058237',
    LastLocationType: 0,
    Latitude: 59.5131836,
    Longitude: 16.51855,
    RecordTimeStampUtcEpochSeconds: 1572603629,
    BodyStyle: 'Combi',
    BodyType: 0,
    Make: 'Audi',
    Model: 'Q7 3.0 TDI quattro',
    NumberPlate: 'XXX123',
    UserFriendlyName: null,
    ImageUrlMake: 'https://content.automile.se/vinlogo/audi.png',
    CheckedInDriverName: null,
    CheckedInContactId: null,
    CheckedInDriverAvatarUrl: null,
    Color: '#37BCBA',
    Tags: '',
    Heading: 290,
    Speed: 10,
    TripIdlingTime: null,
    TrackedAssetStatus: null,
    TrackingScheme: null,
    UtcOffset: 1,
    DeviceType: 0
  }
  */
client.connection.hub.on('LiveHub', 'liveStart', (message) => {
    console.log('liveStart receive:', message);
});

// This will trigger everytime a change occurs in the movement of a vehicle / asset
client.connection.hub.on('LiveHub', 'liveUpdate', (message) => {
    console.log('liveUpdate receive:', message);
});

client.start();

require('readline')
    .createInterface(process.stdin, process.stdout)
    .question("Press [Enter] to exit...", function() {
        process.exit();
    });