namespace Timezones.Business.Utils.Pagination
{
    using System.Linq;
    using System.Threading.Tasks;

    public interface IPaginationUtility
    {
        Task<PaginatedResult<TResult>> GetPaginatedResultAsync<TEntity, TResult>(IQueryable<TEntity> query, int pageIndex, int pageSize)
                where TResult : class;
    }
}
