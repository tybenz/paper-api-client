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

    url: function( endPoint, params ) {
        endPoint = this.endPoints[ endPoint ];

        if ( !endPoint ) {
            return;
        }

        params = params || {};

        var regex = /\:[^\/\*]+/g;
        var lastIndex = 0;
        var newPath = '';
        var count = 2;
        var arg;

        while( match = regex.exec( endPoint ) ) {
            newPath += endPoint.substring( lastIndex, match.index );
            if ( arg = arguments[ count ] ) {
                if ( typeof arg !== 'string' && typeof arg !== 'number' ) {
                    throw new Error( 'URL helper must be called with string arguments only' );
                }

                newPath += arg;
            } else {
                throw new Error( 'URL helper must be called with same number of arguments as the path\'s parameters' );
            }
            lastIndex = match.index + match[ 0 ].length;
            count++;
        }
        newPath += endPoint.substring( lastIndex );

        if ( !endPoint ) {
            return;
        }

        return url.format({
            protocol: this.protocol || 'http:',
            hostname: this.host,
            pathname: newPath,
            query: extend( this.defaultParams || {}, params )
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
