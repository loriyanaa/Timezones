namespace Timezones.Business.Services.Users.Models
{
    using System.ComponentModel.DataAnnotations;

    public class AddUserDTO
    {
        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string RoleName { get; set; }
    }
}
