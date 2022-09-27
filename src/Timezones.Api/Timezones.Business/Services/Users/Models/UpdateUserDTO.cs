namespace Timezones.Business.Services.Users.Models
{
    using System.ComponentModel.DataAnnotations;

    public class UpdateUserDTO
    {
        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string RoleName { get; set; }
    }
}
