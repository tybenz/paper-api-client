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

        it( 'should return undefined if endpoint name is invalid', function() {
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
        });

        it( 'shouldn\'t modify default params', function() {
            var client = apiClient.extend({
                host: 'host.com',
                protocol: 'https:',
                defaultParams: {
                    api_key: 'ApiKey'
                },
                endPoints: {
                    index: '/v1/items'
                }
            });

            var defaults = client.defaultParams;
            var url = client.url( 'index', { new_param: 'true' } );
            assert( defaults.new_param === undefined );
            assert( url === 'https://host.com/v1/items?api_key=ApiKey&new_param=true' );
        });

        it( 'should throw an error when the args are incorrect', function() {
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

            try {
                // item requires 1 param
                // should be client.url( 'item', {}, id )
                var url = client.url( 'item' );
            } catch ( err ) {
                assert( err );
            }

            try {
                // must pass only strings or numbers as path params
                var url = client.url( 'item', {}, { foo: 'bar' } );
            } catch( err ) {
                assert( err );
            }
        });
    });
});
