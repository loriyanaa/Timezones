using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Timezones.Api.Extensions;
using Timezones.Api.Filters;
using Timezones.Api.Middlewares;
using Timezones.Common.Settings;
using Timezones.Data.DataAccess;
using Timezones.Data.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
string connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<TimezonesDbContext>(options => options.UseSqlServer(connectionString));

builder.Services.AddIdentity<User, Role>(options =>
{
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 8;
})
.AddEntityFrameworkStores<TimezonesDbContext>()
.AddDefaultTokenProviders();

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});

builder.Services.AddAuth(builder.Configuration.GetSection("Jwt").Get<JwtSettings>());
builder.Services.AddRepositories();
builder.Services.AddServices();
builder.Services.AddCorsPolicy("CorsPolicy", builder.Configuration.GetValue<string>("CorsUrls"));
builder.Services.AddRouting(options => options.LowercaseUrls = true);
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddControllers(options =>
{
    options.Filters.Add<ValidationFilter>();
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwagger();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();

app.UseCors();

app.UseAuth();

app.MapControllers();

app.Run();
