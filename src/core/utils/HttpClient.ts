import axios from "axios";
import { getNamespace } from 'cls-hooked';
import { CLS_NAMESPACE, HTTP_HEADERS } from "../common/Constants";

export default class HttpClient {

    public static get(baseUrl:string, url: string, options?: Object) {
        let headers = HttpClient.buildHeaders(options);

        return axios({
            url: url,
            baseURL: baseUrl,
            method: "GET",
            headers: headers,
        });
    }

    public static post(baseUrl: string, url: string, data: Object, options?: Object) {
        let headers = HttpClient.buildHeaders(options);

        return axios({
            url: url,
            baseURL: baseUrl,
            method: "POST",
            headers: headers,
            data: data
        });
    }

    public static put(baseUrl: string, url: string, data: Object, options?: Object) {
        let headers = HttpClient.buildHeaders(options);

        return axios({
            url: url,
            baseURL: baseUrl,
            method: "PUT",
            headers: headers,
            data: data
        });
    }

    public static delete(baseUrl: string, url: string, options?: Object) {
        let headers = HttpClient.buildHeaders(options);

        return axios({
            url: url,
            baseURL: baseUrl,
            method: "POST",
            headers: headers
        });
    }

    private static buildHeaders(options?: Object) {
        let headers = {};

        headers[HTTP_HEADERS.CLIENT_REQUEST] = true;
        headers[HTTP_HEADERS.CONTENT_TYPE] = "application/json";

        if (options && options["auth"] == true) {
            let session = getNamespace(CLS_NAMESPACE);
            headers[HTTP_HEADERS.AUTH] = session.get(HTTP_HEADERS.AUTH);;
        }

        return headers;
    }
}