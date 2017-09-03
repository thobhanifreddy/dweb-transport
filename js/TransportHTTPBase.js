const Transport = require('./Transport.js');
const request = require('request');
//UNUSED: const isNode=new Function("try {return this===global;}catch(e){return false;}");
const myrequest = request.defaults({pool: {maxSockets: 2}, forever: true});
//const myrequest = request.defaults({forever: true});

class TransportHTTPBase extends Transport {
    constructor(options, verbose) {
        super(options, verbose);
        this.ipandport = options.http.ipandport;
        this.baseurl = "http://" + ipandport[0] + ":" + ipandport[1] + "/";
    }
    //TODO-ASYNC make this use promises and change calller in TransportHTTP
    async_load(command, url, verbose, success, error) {
        // Locate and return a block, based on its url
        if (verbose) {
            console.log("TransportHTTP async_load:",command, ":url=", url); }
        let httpurl = this._url(command, url);
        if (verbose) { console.log("TransportHTTP:async_load: url=",httpurl); }
        /*
        $.ajax({
            type: "GET",
            url: httpurl,
            success: function(data) {
                if (verbose) { console.log("TransportHTTP:", command, url, ": returning data len=", data.length); }
                // Dont appear to need to parse JSON data, its decoded already
                if (success) { success(data); }
            },
            error: function(xhr, status, error) {
                console.log("TransportHTTP:", command, ": error", status, "error=",error);
                alert("TODO Block failure status="+status+" "+command+" error="+error);
                if (error) { error(xhr, status, error);}
            },
        });
        */
        //See: https://github.com/request/request
        myrequest(httpurl, function(errorres, response, data) {
                if (verbose) { console.log("TransportHTTP X:", command, url, ": returning data len=", data && data.length ); }
            //TODO handle errors
            if (errorres) {
                console.log("TransportHTTP.async_post unable to post url: ",httpurl, "data:", data, "errno: ", errorres.errno,"at:",errorres.address+":"+errorres.port);
                if (error) {
                    error(undefined, undefined, undefined)
                } else { //TODO Should be TransportError but that is not in scope here.
                    throw new Error("TransportHTTP.async_post unable to post httpurl: "+url+" data: "+data+"errno: "+errorres.errno+"at"+errorres.address+":"+errorres.port)
                }
            } else {
                if (response["statusCode"] === 200) {
                    if (response["headers"]['content-type'] === "application/json") {
                        data = self.loads(data);
                    }
                    if (success) success(data);
                } else {
                    console.log("Error status=",response["statusCode"],response["statusMessage"]);
                    if (error) error(undefined, undefined, undefined);
                }
            }

        });

    }

    //TODO-IPFS replace this and async_load with a more standard promised XHR
    p_load(command, url, verbose) {
        return new Promise((resolve, reject) => {
            this.async_load(command, url, verbose,
                (msg) => resolve(msg),
                (xhr, status, error) => reject(undefined)
            )
        })
    }

    async_post(command, url, type, data, verbose, success, error) {
        // Locate and return a block, based on its url
        //verbose=true;
        if (verbose) console.log("TransportHTTP post:", command,":url=", url);
        let httpurl = this._url(command, url);
        let self = this;
        if (verbose) { console.log("TransportHTTP:post: url=",httpurl); }
        if (verbose) { console.log("TransportHTTP:post: data=",typeof data, data); }
        /*
        $.ajax({
            type: "POST",
            url: httpurl,
            data: { "data": data},
            success: function(msg) {
                if (verbose) { console.log("TransportHTTP:", command, url, ": returning data len=", msg.length); }
                // Dont appear to need to parse JSON data, its decoded already
                if (success) { success(msg); }
            },
            error: function(xhr, status, error) {
                console.log("TransportHTTP:", command, "error", status, "error=",error, "data=", data);
                alert("TODO post "+command+" failure status="+status+" error="+error);
                if (error) { error(xhr, status, error);}
            },
        });
        */
        //https://github.com/request/request
        //console.log("async_post{"url": url, "headers": {"Content-Type": type}, "body":data}, "bodytype=",typeof data);
        myrequest.post({"url": httpurl, "headers": {"Content-Type": type}, "body":data}, function(errorres, response, respdata) {
            if (verbose) { console.log("TransportHTTP post:", command, url, ": returning data len=", respdata && respdata.length ); }
            //TODO handle errors
            if (errorres) {
                console.log("TransportHTTP.async_post unable to post url: ",httpurl, "data:", data, "errno: ", errorres.errno,"at:",errorres.address+":"+errorres.port);
                if (error) {
                    error(undefined, undefined, undefined)
                } else { //TODO Should be TransportError but that is not in scope here.
                    throw new Error("TransportHTTP.async_post unable to post url: "+httpurl+" data: "+data+"errno: "+errorres.errno+"at"+errorres.address+":"+errorres.port)
                }
            } else {
                if (response["headers"]['content-type'] === "application/json") {
                    respdata = this.loads(respdata);
                }
                if (success) success(respdata);
            }

        });
    }

    //TODO-IPFS replace this and async_post with a more standard promised XHR
    p_post(command, url, type, data, verbose) {
        return new Promise((resolve, reject) => {
            this.async_post(command, url, type, data, verbose,
                (msg) => resolve(msg),
                (xhr, status, error) => reject(undefined)
            )
        })
    }
    info() { console.assert(false, "XXX Undefined function Transport.info"); }

    _url(command, url) {
        let httpurl = this.baseurl + command;
        if (url) {
            httpurl += "/" + url;
        }
        return httpurl;
    }

}
exports = module.exports = TransportHTTPBase;