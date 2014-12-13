var assert = require( 'assert' );
var apiClient = require( './' );

describe( 'API Client', function() {
    describe( 'urlHelper', function() {
        it( 'class mixin: should return the correct URLs for a given endpoint name', function( done ) {
            var Client = function( host, protocol ) {
                this.setHost( host );
                this.setProtocol( protocol );
                this.setDefaultParams({
                    api_key: 'ApiKey'
                });
            }

            Client.prototype.endPoints = {
                index: '/v1/items',
                item: 'v1/items/:id'
            };

            apiClient.mixin( Client );

            var client = new Client( 'host.com', 'https:' );

            var indexUrl = client.url( 'index' );
            assert( indexUrl === 'https://host.com/v1/items?api_key=ApiKey' );

            var itemUrl = client.url( 'item', undefined, 1 );
            assert( itemUrl === 'https://host.com/v1/items/1?api_key=ApiKey' );

            done();
        });

        it( 'object literal: should return the correct URLs for a given endpoint name', function( done ) {
            var client = apiClient.extend({
                host: 'host.com',
                protocol: 'https:',
                defaultParams: {
                    api_key: 'ApiKey'
                },
                endPoints: {
                    index: '/v1/items',
                    item: 'v1/items/:id'
                },
                getIndex: function( cb ) {
                    return request( this.url( 'index' ), cb );
                }
            });

            var indexUrl = client.url( 'index' );
            assert( indexUrl === 'https://host.com/v1/items?api_key=ApiKey' );

            var itemUrl = client.url( 'item', undefined, 1 );
            assert( itemUrl === 'https://host.com/v1/items/1?api_key=ApiKey' );

            done();
        });

        it( 'should return undefined if endpoint name is invalid', function( done ) {
            var client = apiClient.extend({
                host: 'host.com',
                protocol: 'https:',
                defaultParams: {
                    api_key: 'ApiKey'
                },
                endPoints: {
                    index: '/v1/items',
                    item: 'v1/items/:id'
                },
                getIndex: function( cb ) {
                    return request( this.url( 'index' ), cb );
                }
            });

            assert( client.url( 'foobar' ) === undefined );
            done();
        });
    });
});
