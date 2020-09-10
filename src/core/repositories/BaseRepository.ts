import * as mongoose from 'mongoose';
import "reflect-metadata";
import { injectable, inject, unmanaged } from "inversify";
//import ERRORS = require("../common/ErrorCode");
import {FilterDO} from '../utils/FilterParser';
import SearchQueryConverter from "./SearchQueryConverter";
//import {createAppError} from "../common/AppError";
import * as _ from 'lodash';
import { IBaseRepository } from './IBaseRepository';

@injectable()
export class BaseRepository implements IBaseRepository {
    private model: mongoose.Model<mongoose.Document>;

    constructor(@unmanaged() schemaModel: mongoose.Model<mongoose.Document>) {
        this.model = schemaModel;
    }

    /**
     *
     * @param item
     * @param selectedFields
     * @returns {Promise<U>}
     */
    public async create(item: any, selectedFields?: string[]) {
        let rs = await this.model.create(item);
        if (selectedFields) {
            let itemRT = _.pick(rs, selectedFields);
            itemRT._id = rs._id;
            return itemRT;
        }
        return rs;
    }

    /**
     * Retrieve list of items
     * @param options
     * @returns {Promise<Promise<T[]>>}
     */
    public async retrieve(options?: {page?: number, pageSize?: number, filter?: any, selectedFields?: string[],
        sortBy?: any, lean?: boolean, populates?: Array<any>}) {

        if (options.filter) {
            options.filter = this.formatFilterData(options.filter);
        }

        let query = this.model.find(options.filter);

        if (options.sortBy) {
            query = query.sort(options.sortBy);
        }

        if (options.page) {
            if (!options.pageSize) {
                options.pageSize = 10;
            }
            query = query.skip((options.page - 1) * options.pageSize);
            query = query.limit(options.pageSize);
        }

        if (options.selectedFields && options.selectedFields.length > 0) {
            query = query.select(options.selectedFields.join(' '));
        }

        if (options.populates && options.populates.length > 0) {
            this.populate(query, options.populates);
        }

        if (_.isNil(options.lean)) {
            options.lean = true;
        }

        let [count, items] = await Promise.all([this.model.countDocuments(options.filter).exec(), query.lean(options.lean).exec()]);
        return {items: items, count: count};
    }

    /**
     * Filter items
     * @param options
     * @returns {Promise<number[]>}
     */
    public async filter(options? : {page?: number, pageSize?: number,
            filterDefault?: Object, filterData?: FilterDO[],
            searchType?: string, selectedFields?: string[],
            sortBy?: any, lean?: boolean}) {

        let searchQueryConverter = new SearchQueryConverter(options.searchType, options.filterData);
        let ltFilterData = searchQueryConverter.filterData;

        for (let f in options.filterDefault) {
            ltFilterData[f] = options.filterDefault[f];
        }

        let query = this.model.find(ltFilterData);

        if (options.sortBy) {
            query = query.sort(options.sortBy);
        }

        if (options.selectedFields) {
            query = query.select(options.selectedFields.join(' '));
        }

        if (options.page) {
            if(!options.pageSize) {
                options.pageSize = 10;
            }
            query = query.skip((options.page - 1) * options.pageSize);
            query = query.limit(options.pageSize);
        }

        if(_.isNil(options.lean)) {
            options.lean = true;
        }

        let [count, items] = await Promise.all([this.model.countDocuments(ltFilterData), query.lean(options.lean).exec()]);
        return {items: items, count: count};
    }

    /**
     * Find by Id
     * @param id
     * @param options
     */
    public findById(id: string, options?: {selectedFields?: string[], lean?: boolean, populates?: Array<any>}): any {
        options = _.assign({lean: true}, options);

        let query = this.model.findById(id);

        if (options.selectedFields && options.selectedFields.length > 0) {
            query = query.select(options.selectedFields.join(' '));
        }

        if (options.populates) {
            this.populate(query, options.populates);
        }

        return query.lean(options.lean).exec();
    }

    /**
     * Find 1 item by conditions
     * @param condition
     * @param options
     * @returns {Promise<U>}
     */
    public findOne(condition: Object, options?: {selectedFields?: string[], lean?: boolean, populates?: Array<any>, throwError?: boolean}): any {
        options = _.assign({lean: true, throwError: true}, options);

        let query = this.model.findOne(condition);

        if (options.selectedFields && options.selectedFields.length > 0) {
            query = query.select(options.selectedFields.join(' '));
        }

        if (options.populates && options.populates.length > 0) {
            this.populate(query, options.populates);
        }

        return query.lean(options.lean).exec();
    }

    /**
     * Find multiple item(s) by conditions
     * @param condition
     * @param options
     * @returns {Promise<Object>}
     */
    public findByConditions(condition: any, options?: {selectedFields?: string[], lean?: boolean, populates?: Array<any>}): any {
        options = _.assign({lean: true, throwError: true}, options);

        let query = this.model.find(condition);

        if (options.selectedFields && options.selectedFields.length > 0) {
            query = query.select(options.selectedFields.join(' '));
        }

        if (options.populates && options.populates.length > 0) {
            this.populate(query, options.populates);
        }

        return query.lean(options.lean).exec();
    }

    /**
     * Count items by condition
     * @param item
     * @returns {Query<number>}
     */
    public count(item: any): any {
        return this.model.countDocuments(item);
    }

    /**
     * check exists data
     * @param item
     * @returns {Query<number>}
     */
    public exists(item: any): Promise<boolean> {
        return this.model.countDocuments(item)
            .then((count) => {
                return count > 0;
            });
    }

    /**
     *
     * @param id
     * @param item
     * @param selectedFields
     * @param options
     * @returns {Promise<mongoose.Document>}
     */
    public findByIdAndUpdate(id: string, item: any, selectedFields?: string[], options?: any): any {
        options = _.assign({"new": true}, options);

        let query = this.model.findByIdAndUpdate(id, item, options);

        if (selectedFields && selectedFields.length > 0) {
            query = query.select(selectedFields.join(' '));
        }
        return query.exec();
    }

    /**
     * Update 1 document by conditions
     * @param condition
     * @param item
     * @param options
     * @param selectedFields
     * @returns {Promise<mongoose.Document>}
     */
    public findOneAndUpdate(condition: Object, item: Object, selectedFields?: string[], options?: any): any {
        options = _.assign({"new": true}, options);

        let query = this.model.findOneAndUpdate(condition, item, options);

        if (selectedFields && selectedFields.length > 0) {
            query = query.select(selectedFields.join(' '));
        }

        return query.exec();
    }

    /**
     * Update item(s) by given conditions
     * @param condition
     * @param item
     * @param options
     * @param selectedFields
     * @returns {Promise<mongoose.Document>}
     */
    public update(condition: Object, item: any, selectedFields?: string[], options?: any): any {
        options = _.assign({"new": true}, options);

        let query = this.model.update(condition, item, options);

        if (selectedFields && selectedFields.length > 0) {
            query = query.select(selectedFields.join(' '));
        }

        return query.exec();
    }

    /**
     * Delete by Id
     * @param id
     * @returns {Promise<mongoose.Document>}
     */
    public deleteById(id: string): any {
        return this.model.findByIdAndRemove(id).exec();
    }

    /**
     * Delete 1 document by condition(s)
     * @param condition
     * @returns {Promise<U>}
     */
    public findOneAndRemove(condition: Object): any {
        return this.model.findOneAndRemove(condition).exec();
    }

    /**
     * Delete multiple document(s) by conditions
     * @param condition
     * @returns {Promise<U>}
     */
    public deleteByCondition(condition: Object): any {
        return this.model.remove(condition).exec();
    }

    /**
     *
     * @param id
     * @returns {ObjectID}
     */
    public toObjectId(id: string): mongoose.Types.ObjectId {
        return mongoose.Types.ObjectId.createFromHexString(id);
    }

    /**
     *
     * @param item
     * @returns {{}}
     */
    public toUpdateObject(item: any): any {
        let jsonObj = _.pick(item, _.keys(item));
        let jsonResult = {};
        jsonResult['$unset'] = {};
        this.generateEmbeddedObject(jsonObj, jsonResult);
        if (_.isEmpty(jsonResult['$unset'])) {
            delete jsonResult['$unset'];
        }
        return jsonResult;
    }

    /**
     * format filter data
     * @param filter
     */
    protected formatFilterData(filter: any): any {
        if (filter) {
            let filterData: FilterDO[] = [];
            for (let dtField in filter) {
                let obj = dtField.split('__');
                let isObjectType = ["createdBy", "modifiedBy", "_id"].indexOf(obj[0]) !== -1;
                if (obj.length == 2) {
                    if (_.isArray(filter[dtField])) {
                        for (let value of filter[dtField]) {
                            filterData.push({
                                field: obj[0],
                                operator: obj[1],
                                value: value,
                                fieldType: null
                            })
                        }
                    } else {
                        filterData.push({
                            field: obj[0],
                            operator: obj[1],
                            value: filter[dtField],
                            fieldType: isObjectType ? "Object" : null
                        })
                    }
                    delete filter[dtField];
                } else {
                    if (isObjectType && _.isString(filter[dtField])) {
                        filter[obj[0]] = SearchQueryConverter.toObjectId(filter[dtField]);
                    }
                }
            }
            let searchQueryConverter = new SearchQueryConverter(undefined, filterData);
            return _.extend(filter, searchQueryConverter.filterData);
        }
    }

    protected generateEmbeddedObject(item: any, jsonResult: any, parentPath?: string) {
        for (let prop in item) {
            let propName = prop.toString();
            if (parentPath) {
                propName = parentPath + "." + propName;
            }

            if (_.isObject(item[prop]) && item[prop].constructor !== Date && item[prop].constructor !== Array) {
                this.generateEmbeddedObject(item[prop], jsonResult, propName);
            } else {
                if (item[prop] !== undefined) {
                    jsonResult[propName] = item[prop];
                } else {
                    jsonResult['$unset'][propName] = 1;
                }
            }
        }
    }

    private populate(query: any, populates?: Array<any>) {
        populates.map((populate) => {
            if (populate.collection) {
                let populateObj = {path: populate.collection};
                if (populate.fields) {
                    populateObj["select"] = populate.fields.join(" ");
                }
                if (populate.condition) {
                    populateObj["match"] = populate.condition;
                }
                query = query.populate(populateObj);
            }
        });
    }
}