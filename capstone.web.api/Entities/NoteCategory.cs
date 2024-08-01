using capstone.web.api.Entities;

public class NoteCategory
{
    public int id { get; set; }
    public int? noteId { get; set; }
    public int? categoryId { get; set; }
    public bool? added { get; set; }


}