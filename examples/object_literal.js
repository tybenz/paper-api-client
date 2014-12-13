var apiClient = require( 'paper-api-client' );
var request = require( 'request' );

// Client can be declared a single object literal too
// Using API Client extend you can mixin url helper methods
var client = apiClient.extend({
    host: 'host.com',

    protocol: 'https:',

    defaultParams: {
        api_key: 'ApiKey'
    },

    endPoints: {
        index: '/v1/items',
        item: '/v1/items/:id'
    },

    getIndex: function( cb ) {
        return request( this.url( 'index' ), function( err, res ) {
            if ( err ) {
                cb( err, res );
            } else {
                cb( err, JSON.parse( res.body ) );
            }
        });
    },

    getItem: function( id, cb ) {
        return request( this.url( 'item', undefined, id ), function( err, res ) {
            if ( err ) {
                cb( err, res );
            } else {
                cb( err, JSON.parse( res.body ) );
            }
        });
    }
});

client.getIndex( function( err, data ) {
    console.log( data );
});

client.getItem( 1, function( err, data ) {
    console.log( data );
});
