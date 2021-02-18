using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Scrumban.Model;

namespace Scrumban.Data.Mapping {

    public class PushSubscriptionConfiguration : IEntityTypeConfiguration<PushSubscription> {

        public void Configure(EntityTypeBuilder<PushSubscription> builder) {
            builder.HasKey(ps => ps.UserId);

            builder.HasOne(ps => ps.User)
                .WithOne(u => u.PushSubscription)
                .HasForeignKey<PushSubscription>(ps => ps.UserId);
        
        }

    }

}
