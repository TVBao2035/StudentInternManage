using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace back_end.Migrations
{
    /// <inheritdoc />
    public partial class add_base_enity_for_post_table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "isDelete",
                table: "Post",
                newName: "IsDelete");

            migrationBuilder.RenameColumn(
                name: "UpdateAt",
                table: "Post",
                newName: "UpdatedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsDelete",
                table: "Post",
                newName: "isDelete");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "Post",
                newName: "UpdateAt");
        }
    }
}
