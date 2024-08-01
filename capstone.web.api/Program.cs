//using capstone.web.api.Endpoints;
using capstone.web.api;
using capstone.web.api.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

namespace capstone.web.api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "Capstone API", Version = "v1" });
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\""
                });
                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });

            // Retrieve the secret key from configuration
            var secretKey = builder.Configuration["JwtConfig:Secret"];
            var keyBytes = Encoding.ASCII.GetBytes(secretKey);

            if (keyBytes.Length < 16)
            {
                throw new InvalidOperationException("The secret key must be at least 16 bytes long.");
            }

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    RequireExpirationTime = true,
                    ValidateLifetime = true
                };
            });

            // Add authorization
            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("AdministratorOnly", policy => policy.RequireRole("Administrator"));
                options.AddPolicy("GeneralAndAbove", policy => policy.RequireRole("Administrator", "General"));
                options.AddPolicy("ReadOnlyAndAbove", policy => policy.RequireRole("Administrator", "General", "ReadOnly"));
            });

            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


            builder.Services.AddCors(options =>
            {
                options.AddPolicy("OpenCorsPolicy", builder =>
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader());
            });

            var app = builder.Build();

            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                db.Database.Migrate();
                SeedDatabase(db);
            }

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("OpenCorsPolicy");
            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapNoteEndpoints();
            app.MapCategoryEndpoints();
            app.MapUserEndpoints();

            app.Run();
        }

        static void SeedDatabase(AppDbContext context)
        {
            if (!context.Users.Any())
            {
                context.Users.Add(new User
                {
                    FirstName = "Admin",
                    LastName = "User",
                    Email = "admin@example.com",
                    Username = "admin",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin-password"),
                    Role = "Administrator"
                });

                context.Users.Add(new User
                {
                    FirstName = "General",
                    LastName = "User",
                    Email = "general@example.com",
                    Username = "general",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("general-password"),
                    Role = "General"
                });

                context.SaveChanges();
            }

            //if (!context.Categories.Any())
            //{
            //    var generalCategory = new Category
            //    {
            //        name = "General"
            //    };

            //    context.Categories.Add(generalCategory);
            //    context.SaveChanges();

            //    // Seed notes after category is created to avoid null reference
            //    if (!context.Notes.Any())
            //    {
            //        context.Notes.Add(new Note
            //        {
            //            noteTitle = "Sample Note",
            //            noteBody = "This is a sample note.",
            //            CategoryId = generalCategory.id
            //        });

            //        context.SaveChanges();
            //    }
            //}
            //else
            //{
            //    // Check if notes already exist
            //    if (!context.Notes.Any())
            //    {
            //        var category = context.Categories.FirstOrDefault();
            //        if (category != null)
            //        {
            //            context.Notes.Add(new Note
            //            {
            //                noteTitle = "Sample Note",
            //                noteBody = "This is a sample note.",
            //                CategoryId = category.id
            //            });

            //            context.SaveChanges();
            //        }
            //    }
            //}
        }
    }
}