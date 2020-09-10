import * as _ from 'lodash';

module FilterParser {
    export function queryFilterToJson(query, fields: {} = {}): FilterDO[] {
        let ltFilters: FilterDO[] = [];

        for (let dtField in query) {
            let obj = dtField.split('__');
            if (obj.length == 2) {
                if (_.isArray(query[dtField])) {
                    for (let value of query[dtField]) {
                        ltFilters.push({
                            field: obj[0],
                            operator: obj[1],
                            value: value,
                            fieldType: fields[obj[0]] ? fields[obj[0]].fieldType : null
                        })
                    }
                } else {
                    ltFilters.push({
                        field: obj[0],
                        operator: obj[1],
                        value: query[dtField],
                        fieldType: fields[obj[0]] ? fields[obj[0]].fieldType : null
                    })
                }
            }
        }
        return ltFilters;
    }

    export interface FilterDO {
        field: string;
        fieldType: string;
        operator: string;
        value: any
    }
}
export = FilterParser;
