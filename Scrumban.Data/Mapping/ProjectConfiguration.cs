using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Scrumban.Model;

namespace Scrumban.Data.Mapping {

    public class ProjectConfiguration : IEntityTypeConfiguration<Project> {

        public void Configure(EntityTypeBuilder<Project> builder) {
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Id).ValueGeneratedOnAdd();

            builder.HasOne(p => p.Owner)
                .WithMany(u => u.OwnedProjects)
                .HasForeignKey(p => p.OwnerId);

        }

    }

}
