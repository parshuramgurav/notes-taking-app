namespace capstone.web.api.Entities
{
    public class Category
    {
        public int? id { get; set; }
        public string name { get; set; }
        public bool? added { get; set; }
        public bool? trashed { get; set; }
    }
}