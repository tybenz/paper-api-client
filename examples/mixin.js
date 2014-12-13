var apiClient = require( 'paper-api-client' );
var request = require( 'request' );

// Create client class
var Client = function( host, protocol, defaultParams ) {
    this.setHost( host );
    this.setProtocol( protocol );
    this.setDefaultParams( defaultParams );
};

// Endpoints are path strings. Params noted with colon.
Client.prototype.endPoints = {
    index: '/v1/items',
    item: '/v1/items/:id'
};

// You can define custom methods to hide away request-specific stuff
Client.protoype.getIndex = function( cb ) {
    return request( this.url( 'index' ), function( err, res ) {
        if ( err ) {
            cb( err, res );
        } else {
            cb( err, JSON.parse( res.body ) );
        }
    });
};

Client.protoype.getItem = function( id, cb ) {
    return request( this.url( 'item', undefined, id ), function( err, res ) {
        if ( err ) {
            cb( err, res );
        } else {
            cb( err, JSON.parse( res.body ) );
        }
    });
};

// Calling mixin will sprinkle in API Client stuff ( url helper )
apiClient.mixin( Client );

// Instantiating the client class
var client = new Client( 'host.com', 'https:', {
    api_key: 'ApiKey'
});

client.getIndex( function( err, data ) {
    console.log( data );
});

client.getItem( 1, function( err, data ) {
    console.log( data );
});
