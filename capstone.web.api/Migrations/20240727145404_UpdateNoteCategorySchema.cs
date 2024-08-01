using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace capstone.web.api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateNoteCategorySchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "NoteCategories",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    noteId = table.Column<int>(type: "int", nullable: true),
                    categoryId = table.Column<int>(type: "int", nullable: true),
                    added = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NoteCategories", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Notes",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    noteTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    noteBody = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    pinned = table.Column<bool>(type: "bit", nullable: false),
                    bgColor = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    bgImage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    trashed = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notes", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    added = table.Column<bool>(type: "bit", nullable: true),
                    trashed = table.Column<bool>(type: "bit", nullable: true),
                    Noteid = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.id);
                    table.ForeignKey(
                        name: "FK_Categories_Notes_Noteid",
                        column: x => x.Noteid,
                        principalTable: "Notes",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Categories_Noteid",
                table: "Categories",
                column: "Noteid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "NoteCategories");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Notes");
        }
    }
}
