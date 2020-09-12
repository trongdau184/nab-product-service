import * as _ from 'lodash';

module FilterParser {
    export function parse(filter: Object): FilterDO[] {
        let ltFilters: FilterDO[] = [];

        for (let dtField in filter) {
            let obj = dtField.split('__');
            if (obj.length == 2) {
                if (_.isArray(filter[dtField])) {
                    for (let value of filter[dtField]) {
                        ltFilters.push({
                            field: obj[0],
                            operator: obj[1],
                            value: value
                        });
                    }
                } else {
                    ltFilters.push({
                        field: obj[0],
                        operator: obj[1],
                        value: filter[dtField],
                    });
                }
            } else {
                ltFilters.push({
                    field: obj[0],
                    operator: "eq",
                    value: filter[dtField],
                });
            }
        }
        return ltFilters;
    }

    export interface FilterDO {
        field: string;
        fieldType?: string;
        operator: string;
        value: any
    }
}
export = FilterParser;
