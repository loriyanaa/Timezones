namespace Timezones.Data.Models
{
    public class Timezone
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string City { get; set; }

        public string Offset { get; set; }

        public int CreatorId { get; set; }

        public User Creator { get; set; }
    }
}
