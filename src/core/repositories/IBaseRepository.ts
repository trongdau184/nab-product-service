import {FilterDO} from '../utils/FilterParser';
import * as mongoose from "mongoose";

export interface IBaseRepository {
    create(item: any, selectedFields?: string[]): any;

    retrieve(options?: {page?: number, pageSize?: number, filter?: any, selectedFields?: string[], sortBy?: any,
        lean?: boolean, populates?: Array<any>}): any;
    filter(options?: {page?: number, pageSize?: number, filterDefault?: Object, filterData?: FilterDO[], searchType?: string,
           selectedFields?: string[], sortBy?: any, lean?: boolean}): any;

    findById(id: string, options?: {selectedFields?: string[], lean?: boolean, populates?: Array<any>}): any;
    findOne(condition: any, options?: {selectedFields?: string[], lean?: boolean, populates?: Array<any>, throwError?: boolean}): any;
    findByConditions(condition: any, options?: {selectedFields?: string[], lean?: boolean, populates?: Array<any>}): any;

    findByIdAndUpdate(id: string, item: any, selectedFields?: string[], options?: any): any;
    findOneAndUpdate(condition: any, item: any, selectFields?: string[], options?: any): any;
    update(condition: any, item: any, selectFields?: string[], options?: any): any;

    deleteById(id: string): any;
    findOneAndRemove(condition: Object): any;
    deleteByCondition(condition: any): any;

    count(item: any): any;
    exists(item: any): Promise<boolean>;

    toObjectId(id: string): mongoose.Types.ObjectId;
    toUpdateObject(item: any): any;
}
