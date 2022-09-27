namespace Timezones.Business.Utils.Pagination
{
    using System.ComponentModel.DataAnnotations;

    public class PaginationFilter
    {
        [Range(0, 100)]
        public int PageSize { get; set; } = 10;

        [Range(1, int.MaxValue)]
        public int PageIndex { get; set; } = 1;
    }
}
