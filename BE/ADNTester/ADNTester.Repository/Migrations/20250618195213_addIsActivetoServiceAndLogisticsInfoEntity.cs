using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ADNTester.Repository.Migrations
{
    /// <inheritdoc />
    public partial class addIsActivetoServiceAndLogisticsInfoEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReceivedAt",
                table: "TestKits");

            migrationBuilder.DropColumn(
                name: "ReturnOrderCode",
                table: "TestKits");

            migrationBuilder.DropColumn(
                name: "ShippedAt",
                table: "TestKits");

            migrationBuilder.DropColumn(
                name: "ShippingOrderCode",
                table: "TestKits");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "TestServices",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "CollectionMethod",
                table: "TestKits",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "DeliveryInfoId",
                table: "TestKits",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PickupInfoId",
                table: "TestKits",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "LogisticsInfos",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    StaffId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ScheduledAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Type = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LogisticsInfos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LogisticsInfos_Users_StaffId",
                        column: x => x.StaffId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_TestKits_DeliveryInfoId",
                table: "TestKits",
                column: "DeliveryInfoId");

            migrationBuilder.CreateIndex(
                name: "IX_TestKits_PickupInfoId",
                table: "TestKits",
                column: "PickupInfoId");

            migrationBuilder.CreateIndex(
                name: "IX_LogisticsInfos_StaffId",
                table: "LogisticsInfos",
                column: "StaffId");

            migrationBuilder.AddForeignKey(
                name: "FK_TestKits_LogisticsInfos_DeliveryInfoId",
                table: "TestKits",
                column: "DeliveryInfoId",
                principalTable: "LogisticsInfos",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TestKits_LogisticsInfos_PickupInfoId",
                table: "TestKits",
                column: "PickupInfoId",
                principalTable: "LogisticsInfos",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TestKits_LogisticsInfos_DeliveryInfoId",
                table: "TestKits");

            migrationBuilder.DropForeignKey(
                name: "FK_TestKits_LogisticsInfos_PickupInfoId",
                table: "TestKits");

            migrationBuilder.DropTable(
                name: "LogisticsInfos");

            migrationBuilder.DropIndex(
                name: "IX_TestKits_DeliveryInfoId",
                table: "TestKits");

            migrationBuilder.DropIndex(
                name: "IX_TestKits_PickupInfoId",
                table: "TestKits");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "TestServices");

            migrationBuilder.DropColumn(
                name: "CollectionMethod",
                table: "TestKits");

            migrationBuilder.DropColumn(
                name: "DeliveryInfoId",
                table: "TestKits");

            migrationBuilder.DropColumn(
                name: "PickupInfoId",
                table: "TestKits");

            migrationBuilder.AddColumn<DateTime>(
                name: "ReceivedAt",
                table: "TestKits",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReturnOrderCode",
                table: "TestKits",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ShippedAt",
                table: "TestKits",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShippingOrderCode",
                table: "TestKits",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
