using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ADNTester.Repository.Migrations
{
    /// <inheritdoc />
    public partial class AddStatusLogisticInfo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "LogisticsInfos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "LogisticsInfos");
        }
    }
}
