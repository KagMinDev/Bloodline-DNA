using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ADNTester.Repository.Migrations
{
    /// <inheritdoc />
    public partial class AddNameToLogisticInfo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "LogisticsInfos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "LogisticsInfos");
        }
    }
}
