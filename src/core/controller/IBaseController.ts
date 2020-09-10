export default interface IBaseController {
    create(request, response);
    update(request, response);
    delete(request, response);
    getById(request, response);
    retrieve(request, response);
}