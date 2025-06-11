using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ADNTester.Repository.Migrations
{
    /// <inheritdoc />
    public partial class AddPaymentSampleInstrucModifyTestKit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SampleCount",
                table: "TestServices",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ReturnOrderCode",
                table: "TestKits",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SampleCount",
                table: "TestKits",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ShippingOrderCode",
                table: "TestKits",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SampleCount",
                table: "TestServices");

            migrationBuilder.DropColumn(
                name: "ReturnOrderCode",
                table: "TestKits");

            migrationBuilder.DropColumn(
                name: "SampleCount",
                table: "TestKits");

            migrationBuilder.DropColumn(
                name: "ShippingOrderCode",
                table: "TestKits");
        }
    }
}
