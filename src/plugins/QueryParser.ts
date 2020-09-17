import * as Hapi from 'hapi';

const parseQuery = async (request, response) => {
    let filter = {};
    let sortBy = {};
    let paging = {};

    if (typeof request.query.sortBy === 'string') {
        let dtSort = request.query.sortBy.split(':');
        sortBy[dtSort[0]] = dtSort[1] == 'asc' ? 1 : -1;
    }

    for (let dtField in request.query) {
        if (dtField != 'sortBy' && dtField != 'page' && dtField != 'pageSize') {
            filter[dtField] = request.query[dtField];
        }
    }

    if (request.query.page) {
        paging['page'] = parseInt(request.query.page);
    }

    if (request.query.pageSize) {
        paging['pageSize'] = parseInt(request.query.pageSize);
    }

    request.query.filter = filter;
    request.query.sortBy = sortBy;
    request.query.paging = paging;
    return response.continue;
};

const QueryParser: Hapi.Plugin<{}> = {
    name: 'queryParser',
    version: '1.0.0',
    register: (server: Hapi.Server, options) => {
        server.ext('onPreHandler', function (request, response) {
            const settings = request.route.settings.plugins['queryParser'];
            if (settings && settings.enabled) {
                return parseQuery(request, response);
            }
            return response.continue;
        });
    }
};

export default QueryParser;
