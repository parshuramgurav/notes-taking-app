namespace capstone.web.api.Entities
{
    public class Note
    {
        public int? id { get; set; }
        public string noteTitle { get; set; }
        public string? noteBody { get; set; }
        public bool pinned { get; set; }
        public string bgColor { get; set; }
        public string bgImage { get; set; }
        public bool trashed { get; set; }
        public List<Category?> labels { get; set; } = new List<Category?>();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}