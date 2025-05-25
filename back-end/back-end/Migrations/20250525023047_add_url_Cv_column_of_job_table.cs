using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace back_end.Migrations
{
    /// <inheritdoc />
    public partial class add_url_Cv_column_of_job_table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UrlCV",
                table: "Job",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UrlCV",
                table: "Job");
        }
    }
}
