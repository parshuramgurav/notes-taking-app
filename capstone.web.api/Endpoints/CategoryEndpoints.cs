namespace capstone.web.api
{
    using capstone.web.api.Entities;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.EntityFrameworkCore;

    public static class CategoryEndpoints
    {
        public static void MapCategoryEndpoints(this IEndpointRouteBuilder endpoints)
        {
            endpoints.MapGet("/api/categories", [Authorize] async (AppDbContext db) =>
            {
                var categories = await db.Categories
                    .ToListAsync();
                return categories is not null ? Results.Ok(categories) : Results.NotFound();
            });

            endpoints.MapPost("/api/categories", [Authorize] async (Category category, AppDbContext db) =>
            {
                category.trashed = false;
                db.Categories.Add(category);
                await db.SaveChangesAsync();
                return Results.Created($"/api/categories/{category.id}", category);
            });

            endpoints.MapPatch("/api/categories/{id}", [Authorize] async (int id, Category updatedCategory, AppDbContext db) =>
            {
                var category = await db.Categories.FindAsync(id);
                if (category is null) return Results.NotFound();

                category.name = updatedCategory.name ?? category.name;
                category.trashed = updatedCategory.trashed ?? category.trashed;
                category.added = updatedCategory.added ?? category.added;

                await db.SaveChangesAsync();
                return Results.Ok(category);
            });
        }
    }
}