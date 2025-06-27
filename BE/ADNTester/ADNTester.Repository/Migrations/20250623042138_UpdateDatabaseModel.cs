using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ADNTester.Repository.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDatabaseModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "BlogTags",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<string>(
                name: "Id",
                table: "BlogTags",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "BlogTags",
                type: "datetime2",
                nullable: true,
                defaultValueSql: "GETUTCDATE()");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "BlogTags");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "BlogTags");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "BlogTags");
        }
    }
}
