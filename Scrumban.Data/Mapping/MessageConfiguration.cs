using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Scrumban.Model;

namespace Scrumban.Data.Mapping {
    public class MessageConfiguration : IEntityTypeConfiguration<Message> {

        public void Configure(EntityTypeBuilder<Message> builder) {
            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).ValueGeneratedOnAdd();

            builder.Property(m => m.SendDateTime).ValueGeneratedOnAdd();

            builder.HasOne(m => m.Project)
                .WithMany(p => p.Messages)
                .HasForeignKey(m => m.ProjectId);

            builder.HasOne(m => m.Sender)
                .WithMany(u => u.Messages)
                .HasForeignKey(m => m.SenderId);

        }

    }
}
