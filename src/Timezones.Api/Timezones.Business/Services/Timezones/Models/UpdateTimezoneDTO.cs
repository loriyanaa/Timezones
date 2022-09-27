namespace Timezones.Business.Services.Timezones.Models
{
    using global::Timezones.Common.Constants;
    using System.ComponentModel.DataAnnotations;

    public class UpdateTimezoneDTO
    {
        [Required, MaxLength(100)]
        public string Name { get; set; }

        [Required, MaxLength(100)]
        public string City { get; set; }

        [Required, RegularExpression(ValidationConstants.TimezoneOffsetPattern, ErrorMessage = ErrorMessages.InvalidOffsetFormat)]
        public string Offset { get; set; }
    }
}
