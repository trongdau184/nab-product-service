export interface IBaseService {
    create<CreateDto>(dto: CreateDto);
    update<UpdateDto>(id: string, dto: UpdateDto);
    delete(id: string)
    getById(id: string);
    retrieve(filter?: any, sortBy?: any, page?: number, pageSize?: number);
}