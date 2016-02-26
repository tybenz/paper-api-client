var url = require( 'url' );
var path = require( 'path' );
var extend = require( 'util' )._extend;

var methods = exports.methods = {
    setHost: function( host ) {
        this.host = host;
    },

    setDefaultParams: function( params ) {
        this.defaultParams = params;
    },

    setProtocol: function( protocol ) {
        this.protocol = protocol;
    },

    request: function( options ) {
        var headers = {
            'Authorization': options.token
        }
        delete options.token;
        options.headers = _.extend( {}, headers, options.headers );

        return Utils.requestAsync( options );
    },

    url: function( endPoint, params ) {
        var args = Array.prototype.slice.call( arguments );

        endPoint = this.endPoints[ endPoint ];

        if ( !endPoint ) {
            return;
        }

        params = params || {};

        var arg;
        var count = 2;
        var failed = false;
        var newPath = endPoint.replace( /[^\\]{1}\:([^\/]*)/g, function( match, id ) {
            arg = args[ count++ ];
            if ( typeof arg !== 'string' && typeof arg !== 'number' ) {
                failed = true;
                return;
            }

            return '/' + arg;
        });
        newPath = newPath.replace( /\\\:/, ':' );

        if ( count > 2 && count != args.length ) {
            throw new Error( 'URL helper must be called with same number of path params to match endpoint string' );
        }

        if ( failed ) {
            throw new Error( 'URL helper must be called with string arguments only' );
        }

        return url.format({
            protocol: this.protocol || 'http:',
            host: this.host,
            pathname: newPath,
            query: extend( extend( {}, this.defaultParams ), params )
        });
    }
};

var mixin = exports.mixin = function( klass ) {
    klass.prototype = extend( klass.prototype, methods );

    return klass;
}

var customExtend = exports.extend = function( obj ) {
    return extend( obj, methods );
};
