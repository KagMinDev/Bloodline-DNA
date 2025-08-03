using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ADNTester.Repository.Migrations
{
    /// <inheritdoc />
    public partial class AddImageLogistics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EvidenceImageUrl",
                table: "LogisticsInfos",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EvidenceImageUrl",
                table: "LogisticsInfos");
        }
    }
}
