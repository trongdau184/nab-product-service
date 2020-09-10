import {FIELD_TYPES} from "../common/Constants";
import {FilterDO} from "../utils/FilterParser";
import * as mongoose from "mongoose";

export default class SearchQueryConverter {
    private listFilterData = {};
    private ltFilters = [];
    private ltWhere = [];

    constructor(searchType:string = 'and', filterData:FilterDO[]) {
        searchType = searchType ? '$' + searchType : '$and';
        for (let itField of filterData) {
            let fieldName = itField.field;
            let fieldType = itField.fieldType;
            let value = itField.value;

            switch (itField.operator) {
                case 'lt' :
                    this.litterThan(fieldName, fieldType, value);
                    break;

                case 'lte' :
                    this.litterThanEqual(fieldName, fieldType, value);
                    break;

                case 'gt' :
                    this.greaterThan(fieldName, fieldType, value);
                    break;

                case 'gte' :
                    this.greaterThanEqual(fieldName, fieldType, value);
                    break;

                case 'eq' :
                    this.equal(fieldName, fieldType, value);
                    break;

                case 'neq' :
                    this.notEqual(fieldName, fieldType, value);
                    break;

                case 'contains':
                    this.contains(fieldName, fieldType, value);
                    break;

                case 'ncontains':
                    this.notContains(fieldName, fieldType, value);
                    break;

                case 'startswith':
                    this.startswith(fieldName, fieldType, value);
                    break;

                case 'nstartswith':
                    this.notStartswith(fieldName, fieldType, value);
                    break;

                case 'endswith':
                    this.endswith(fieldName, fieldType, value);
                    break;

                case 'nendswith':
                    this.notEndswith(fieldName, fieldType, value);
                    break;

                case 'isempty':
                    this.isEmpty(fieldName, fieldType, value);
                    break;

                case 'isnempty':
                    this.isNotEmpty(fieldName, fieldType, value);
                    break;

                case 'in':
                    this.in(fieldName, fieldType, value);
                    break;

                case 'nin':
                    this.notIn(fieldName, fieldType, value);
                    break;

                case 'range':
                    this.range(fieldName, fieldType, value);
                    break;

                default:
                    this.ltFilters.push({[fieldName]: value});
                    break;
            }
        }

        this.listFilterData[searchType] = this.ltFilters;

        if (this.ltWhere.length > 0) {
            this.ltFilters.push({'$where': "return " + this.ltWhere.join(searchType == '$and' ? ' && ' : ' || ')});
        }

        if (this.ltFilters.length == 0) {
            delete this.listFilterData[searchType];
        }
    }

    get filterData() {
        return this.listFilterData;
    }

    private litterThan(fieldName:string, fieldType:string, value:any) {
        switch (fieldType) {
            case FIELD_TYPES.NUMBER :
                this.ltFilters.push({[fieldName]: {$lt: Number(value)}});
                break;
            default :
                this.ltFilters.push({[fieldName]: {$lt: value}});
                break;
        }
    }

    private litterThanEqual(fieldName:string, fieldType:string, value:any) {
        switch (fieldType) {
            case FIELD_TYPES.NUMBER :
                this.ltFilters.push({[fieldName]: {$lte: Number(value)}});
                break;
            default :
                this.ltFilters.push({[fieldName]: {$lte: value}});
                break;
        }
    }

    private greaterThan(fieldName:string, fieldType:string, value:any) {
        switch (fieldType) {
            case FIELD_TYPES.NUMBER :
                this.ltFilters.push({[fieldName]: {$gt: Number(value)}});
                break;
            default :
                this.ltFilters.push({[fieldName]: {$gt: value}});
                break;
        }
    }

    private greaterThanEqual(fieldName:string, fieldType:string, value:any) {
        switch (fieldType) {
            case FIELD_TYPES.NUMBER :
                this.ltFilters.push({[fieldName]: {$gte: Number(value)}});
                break;
            default :
                this.ltFilters.push({[fieldName]: {$gte: value}});
                break;
        }
    }

    private equal(fieldName:string, fieldType:string, value:any) {
        switch (fieldType) {
            case FIELD_TYPES.NUMBER :
                this.ltFilters.push({[fieldName]: Number(value)});
                break;
            case FIELD_TYPES.MULTI :
                this.ltFilters.push({[fieldName]: {$eq: value.replace(/^\s*|\s*$/g, '').split(/\s*,\s*/)}});
                break;
            case FIELD_TYPES.SINGLE :
                this.ltFilters.push({[fieldName]: {$eq: value}});
                break;
            case "Object" :
                this.ltFilters.push({[fieldName]: {$eq: SearchQueryConverter.toObjectId(value)}});
                break;
            default :
                this.ltFilters.push({[fieldName]: new RegExp('^' + this.escapeRegExp(value) + '$', 'i')});
                break;
        }
    }

    private notEqual(fieldName:string, fieldType:string, value:any) {
        switch (fieldType) {
            case FIELD_TYPES.NUMBER :
                this.ltFilters.push({[fieldName]: {$ne: Number(value)}});
                break;
            case FIELD_TYPES.MULTI :
                this.ltFilters.push({[fieldName]: {$not: {$eq: value.replace(/^\s*|\s*$/g, '').split(/\s*,\s*/)}}});
                break;
            case FIELD_TYPES.SINGLE :
                this.ltFilters.push({[fieldName]: {$not: {$eq: value}}});
                break;
            case "Object" :
                this.ltFilters.push({[fieldName]: {$not: {$eq: SearchQueryConverter.toObjectId(value)}}});
                break;
            default :
                this.ltFilters.push({[fieldName]: {$not: new RegExp('^' + this.escapeRegExp(value) + '$', 'i')}});
                break;
        }
    }

    private contains(fieldName:string, fieldType:string, value:any) {
        switch (fieldType) {
            case FIELD_TYPES.MULTI :
                this.ltFilters.push({[fieldName]: {$in: value.replace(/^\s*|\s*$/g, '').split(/\s*,\s*/)}});
                break;
            case FIELD_TYPES.SINGLE :
                this.ltFilters.push({[fieldName]: {$in: value.replace(/^\s*|\s*$/g, '').split(/\s*,\s*/)}});
                break;
            default :
                this.ltFilters.push({[fieldName]: new RegExp(this.escapeRegExp(value), 'i')});
                break;
        }
    }

    private notContains(fieldName:string, fieldType:string, value:any) {

        switch (fieldType) {
            case FIELD_TYPES.MULTI :
                this.ltFilters.push({[fieldName]: {$nin: value.replace(/^\s*|\s*$/g, '').split(/\s*,\s*/)}});
                break;
            case FIELD_TYPES.SINGLE :
                this.ltFilters.push({[fieldName]: {$nin: value.replace(/^\s*|\s*$/g, '').split(/\s*,\s*/)}});
                break;
            default :
                this.ltFilters.push({[fieldName]: {$not: new RegExp(this.escapeRegExp(value), 'i')}});
                break;
        }
    }

    private startswith(fieldName:string, fieldType:string, value:any) {
        this.ltFilters.push({[fieldName]: new RegExp('^' + this.escapeRegExp(value), 'i')});
    }

    private notStartswith(fieldName:string, fieldType:string, value:any) {
        this.ltFilters.push({[fieldName]: {$not: new RegExp('^' + this.escapeRegExp(value), 'i')}});
    }

    private endswith(fieldName:string, fieldType:string, value:any) {
        this.ltFilters.push({[fieldName]: new RegExp(this.escapeRegExp(value) + '$', 'i')});
    }

    private notEndswith(fieldName:string, fieldType:string, value:any) {
        this.ltFilters.push({[fieldName]: {$not: new RegExp(this.escapeRegExp(value) + '$', 'i')}});
    }

    private isEmpty(fieldName:string, fieldType:string, value:any) {
        switch (fieldType) {
            case FIELD_TYPES.MULTI :
                this.ltFilters.push({[fieldName]: {$exists: true, $eq: []}});
                break;
            default :
                this.ltFilters.push({[fieldName]: {$in: [null, '']}});
        }
    }

    private isNotEmpty(fieldName:string, fieldType:string, value:any) {
        switch (fieldType) {
            case FIELD_TYPES.MULTI :
                this.ltFilters.push({[fieldName]: {$exists: true, $ne: []}});
                break;
            default :
                this.ltFilters.push({[fieldName]: {$nin: [null, '']}});
        }
    }

    private in(fieldName:string, fieldType:string, value:any) {
        switch (fieldType) {
            case FIELD_TYPES.NUMBER :
                this.ltFilters.push({
                    [fieldName]: {
                        $in: value.replace(/^\s*|\s*$/g, '').split(/\s*,\s*/).map(function (el) {
                            return +el;
                        })
                    }
                });
                break;
            case "Object" :
                this.ltFilters.push({
                    [fieldName]: {
                        $in: value.replace(/^\s*|\s*$/g, '').split(/\s*,\s*/).map(function (el) {
                            return SearchQueryConverter.toObjectId(el);
                        })
                    }
                });
                break;
            default :
                this.ltFilters.push({[fieldName]: {$in: value.replace(/^\s*|\s*$/g, '').split(/\s*,\s*/)}});
                break;
        }
    }

    private notIn(fieldName:string, fieldType:string, value:any) {
        switch (fieldType) {
            case FIELD_TYPES.NUMBER :
                this.ltFilters.push({
                    [fieldName]: {
                        $nin: value.replace(/^\s*|\s*$/g, '').split(/\s*,\s*/).map(function (el) {
                            return +el;
                        })
                    }
                });
                break;
            case "Object" :
                this.ltFilters.push({
                    [fieldName]: {
                        $nin: value.replace(/^\s*|\s*$/g, '').split(/\s*,\s*/).map(function (el) {
                            return SearchQueryConverter.toObjectId(el);
                        })
                    }
                });
                break;
            default :
                this.ltFilters.push({[fieldName]: {$nin: value.replace(/^\s*|\s*$/g, '').split(/\s*,\s*/)}});
                break;
        }
    }

    private range(fieldName:string, fieldType:string, value:any) {
        switch (fieldType) {
            case FIELD_TYPES.NUMBER :
                var data = value.replace(/^\s*|\s*$/g, '').split(/\s*,\s*/);
                let it1 = Number(data[0]);
                let it2 = Number(data[1]);
                this.ltFilters.push({[fieldName]: {$gte: it1, $lte: it2}});
                break;

            default :
                var data = value.replace(/^\s*|\s*$/g, '').split(/\s*,\s*/);
                this.ltFilters.push({[fieldName]: {$gte: data[0], $lte: data[1]}});
                break;
        }
    }

    static  toObjectId(id:string):mongoose.Types.ObjectId {
        return mongoose.Types.ObjectId.createFromHexString(id);
    }

    private escapeRegExp(value): any {
        if (typeof value == 'string') {
            return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        } else {
            return value;
        }
    }
}
