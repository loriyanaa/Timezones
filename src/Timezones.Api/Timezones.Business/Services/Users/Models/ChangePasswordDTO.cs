namespace Timezones.Business.Services.Users.Models
{
    using System.ComponentModel.DataAnnotations;

    public class ChangePasswordDTO
    {
        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string CurrentPassword { get; set; }

        [Required]
        public string NewPassword { get; set; }
    }
}
