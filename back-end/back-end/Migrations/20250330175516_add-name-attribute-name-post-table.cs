using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace back_end.Migrations
{
    /// <inheritdoc />
    public partial class addnameattributenameposttable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "RoleId",
                table: "User",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Post",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "TechnologyId",
                table: "Post",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_User_RoleId",
                table: "User",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_Post_TechnologyId",
                table: "Post",
                column: "TechnologyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Post_Technology_TechnologyId",
                table: "Post",
                column: "TechnologyId",
                principalTable: "Technology",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_User_Role_RoleId",
                table: "User",
                column: "RoleId",
                principalTable: "Role",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Post_Technology_TechnologyId",
                table: "Post");

            migrationBuilder.DropForeignKey(
                name: "FK_User_Role_RoleId",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_User_RoleId",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_Post_TechnologyId",
                table: "Post");

            migrationBuilder.DropColumn(
                name: "RoleId",
                table: "User");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Post");

            migrationBuilder.DropColumn(
                name: "TechnologyId",
                table: "Post");
        }
    }
}
