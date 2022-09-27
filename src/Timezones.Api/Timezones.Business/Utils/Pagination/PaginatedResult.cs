namespace Timezones.Business.Utils.Pagination
{
    public class PaginatedResult<T>
    {
        public int PageIndex { get; set; }

        public int PageSize { get; set; }

        public int TotalItemsCount { get; set; }

        public IEnumerable<T> Items { get; set; }
    }
}
