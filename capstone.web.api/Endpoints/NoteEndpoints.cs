namespace capstone.web.api
{
    using capstone.web.api.Entities;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.EntityFrameworkCore;

    public static class NoteEndpoints
    {
        public static void MapNoteEndpoints(this IEndpointRouteBuilder endpoints)
        {
            endpoints.MapGet("/api/notes", [Authorize] async (AppDbContext db) =>
            {
                var notes = await db.Notes.ToListAsync();

                var noteCategories = await db.NoteCategories
                    .Where(nc => notes.Select(n => n.id).Contains(nc.noteId) && nc.added == true)
                    .ToListAsync();

                var categories = await db.Categories.ToListAsync();

                foreach (var note in notes)
                {
                    var categoryIds = noteCategories
                        .Where(nc => nc.noteId == note.id && nc.added ==true)
                        .Select(nc => nc.categoryId)
                        .ToList();

                    note.labels = categoryIds
                        .Select(categoryId =>
                        {
                            var category = categories.FirstOrDefault(c => c.id == categoryId);
                            if (category != null)
                            {
                                return new Category
                                {
                                    id = category.id,
                                    name = category.name,
                                    added = true,
                                    trashed = category.trashed
                                };
                            }
                            return null;
                        })
                        .Where(category => category != null)
                        .ToList();
                }

                return Results.Ok(notes);
            });





            endpoints.MapPost("/api/notes", [Authorize] async (Note note, AppDbContext db) =>
            {
                List<Category> categories = new List<Category>(note.labels);

                note.labels.Clear();

                // Add the note to the database
                db.Notes.Add(note);
                await db.SaveChangesAsync();

                if (categories != null && categories.Count > 0)
                {
                    foreach (var label in categories)
                    {
                        var existingNoteCategory = await db.NoteCategories
                            .FirstOrDefaultAsync(nc => nc.noteId == note.id && nc.categoryId == label.id && nc.added == true);

                        if (existingNoteCategory == null)
                        {
                            var noteCategory = new NoteCategory
                            {
                                noteId = note.id.Value,
                                categoryId = label.id,
                                added = true
                            };
                            db.NoteCategories.Add(noteCategory);
                        }
                    }
                }

                await db.SaveChangesAsync();
                return Results.Created($"/api/notes/{note.id}", note);
            });

            endpoints.MapPatch("/api/notes/{id}", [Authorize] async (int id, Note updatedNote, AppDbContext db) =>
            {
                var note = await db.Notes.Include(n => n.labels).FirstOrDefaultAsync(n => n.id == id);
                if (note is null) return Results.NotFound();

                note.noteTitle = updatedNote.noteTitle ?? note.noteTitle;
                note.noteBody = updatedNote.noteBody ?? note.noteBody;
                note.pinned = updatedNote.pinned;
                note.trashed = updatedNote.trashed;
                note.bgColor = updatedNote.bgColor ?? note.bgColor;
                note.bgImage = updatedNote.bgImage ?? note.bgImage;

                note.labels.Clear();

                if (updatedNote.labels != null && updatedNote.labels.Count > 0)
                {
                    foreach (var label in updatedNote.labels)
                    {
                        var existingCategory = await db.Categories.FindAsync(label.id);
                        if (existingCategory != null)
                        {
                            var noteCategory = new NoteCategory
                            {
                                noteId = note.id,
                                categoryId = existingCategory.id,
                                added = true
                            };
                            db.NoteCategories.Add(noteCategory);
                        }
                    }
                }

                note.UpdatedAt = DateTime.UtcNow;
                await db.SaveChangesAsync();
                return Results.Ok(note);
            });



            endpoints.MapDelete("/api/notes/{id}", [Authorize] async (int id, AppDbContext db) =>
            {
                var note = await db.Notes.Include(n => n.labels).FirstOrDefaultAsync(n => n.id == id);
                if (note is not null)
                {
                    var noteCategories = await db.NoteCategories
                        .Where(nc => nc.noteId == id)
                        .ToListAsync();
                    db.NoteCategories.RemoveRange(noteCategories);

                    db.Notes.Remove(note);
                    await db.SaveChangesAsync();
                    return Results.Ok();
                }
                return Results.NotFound();
            });


            endpoints.MapGet("/api/notes/search", [Authorize] async (string query, AppDbContext db) =>
            {
                var notes = await db.Notes
                    .Where(n => !n.trashed && (n.noteTitle.Contains(query) || n.noteBody.Contains(query)))
                    .ToListAsync();
                return Results.Ok(notes);
            });

        }
    }
}