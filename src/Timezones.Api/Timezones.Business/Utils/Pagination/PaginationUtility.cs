namespace Timezones.Business.Utils.Pagination
{
    using AutoMapper;
    using Microsoft.EntityFrameworkCore;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class PaginationUtility : IPaginationUtility
    {
        private readonly IMapper mapper;

        public PaginationUtility(IMapper mapper)
        {
            this.mapper = mapper;
        }

        public async Task<PaginatedResult<TResult>> GetPaginatedResultAsync<TEntity, TResult>(IQueryable<TEntity> query, int pageIndex, int pageSize)
                where TResult : class
        {
            IQueryable<TResult> source = this.mapper.ProjectTo<TResult>(query);

            int totalItemsCount = source.Count();
            int skip = (pageIndex - 1) * pageSize;
            int take = pageSize;
            List<TResult> items = await source.Skip(skip).Take(take).ToListAsync();

            PaginatedResult<TResult> searchResult = new PaginatedResult<TResult>()
            {
                PageSize = pageSize,
                PageIndex = pageIndex,
                Items = items,
                TotalItemsCount = totalItemsCount
            };

            return searchResult;
        }
    }
}
