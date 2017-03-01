import Promise from "bluebird";



const BASE_URL = "http://api.football-data.org/v1";
const COMPETITION_URL = BASE_URL + "/competitions/";
const API_KEY = "55913a83abd5464582135f522a501cde";

const DEFAULT_AJAX_OPTIONS = {
    method: "GET", 
    dataType:"json", 
    headers: { "X-AUTH-TOKEN" : API_KEY, "X-Response-Control": "minified" }
};

/*opts : {
    method: String, url: String, dataType: <"json">, params: String | Object, headers: Object
}*/
const sendRequest = function(opts) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(opts.method, opts.url);
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                var res = xhr.response;
                if (opts["dataType"] == "json") {
                res = JSON.parse(res);
                }
                resolve(res);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function() {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        if (opts.headers) {
            Object.keys(opts.headers).forEach(function(key) {
                xhr.setRequestHeader(key, opts.headers[key]);
            });
        }
        var params = opts.params;
        //need to stringify if we've been given an object
        //If we have a string, this is skipped.
        if (params && typeof params === 'object') {
            params = Object.keys(params).map(function(key) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
            }).join('&');
        }
        xhr.send(params);
    });
};

const getDefaultOptionsClone = function() {
    return {
        ...DEFAULT_AJAX_OPTIONS,
        ["headers"]: {...DEFAULT_AJAX_OPTIONS["headers"]}
    };
};

class NetworkService {

    static sendRequest(options) {
        sendRequest(options);
    }

    static getCompetitionAjaxOptions() {
        let options = getDefaultOptionsClone();
        options["url"] = COMPETITION_URL;
        return options;
    }

    static getTeamsAjaxOptions(competitionId) {
        let options = getDefaultOptionsClone();
        options ["url"] = BASE_URL + "/competitions/"+ competitionId +"/teams";
        return options;
    }

    static getFixturesAjaxOptions(competitionId) {
        let options = getDefaultOptionsClone();
        options["url"] = BASE_URL + "/competitions/"+ competitionId +"/fixtures";
        options["headers"]["X-Response-Control"] = "compressed";
        return options;
    }
}



export default NetworkService;
