import "reflect-metadata";
import { injectable, inject } from "inversify";
import { IBaseService } from "./IBaseService";
import { IBaseRepository } from "../repositories/IBaseRepository";
import { BaseRepository } from "../repositories/BaseRepository";

@injectable()
export class BaseService implements IBaseService {
    protected repository: IBaseRepository;

    constructor(repository: IBaseRepository) {
        this.repository = repository;
    }

    public create<CreateDto>(dto: CreateDto) {
        return this.repository.create(dto);
    }

    public update<UpdateDto>(id: string, dto: UpdateDto) {
        return this.repository.findByIdAndUpdate(id, dto);
    }

    public delete(id: string) {
        return this.repository.deleteById(id);
    }

    public getById(id: string) {
        return this.repository.findById(id);
    }

    public retrieve(filter?: any, sortBy?: any, page?: number, pageSize?: number) {
        return this.repository.retrieve({page: page, pageSize: pageSize, filter: filter, sortBy: sortBy});
    }
}