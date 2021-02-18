using Microsoft.EntityFrameworkCore;
using Scrumban.Data.Mapping;
using Scrumban.Model;

namespace Scrumban.Data {

    public class ScrumbanContext : DbContext {

        public ScrumbanContext(DbContextOptions<ScrumbanContext> options)
            : base(options) {

        }

        public virtual DbSet<User> Users { get; set; }

        public virtual DbSet<Project> Projects { get; set; }

        public virtual DbSet<Task> Tasks { get; set; }

        public virtual DbSet<Message> Messages { get; set; }

        public virtual DbSet<PushSubscription> PushSubscriptions { get; set; }

        public virtual DbSet<ProjectUser> ProjectUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder builder) {
            builder.ApplyConfiguration(new UserConfiguration());

            builder.ApplyConfiguration(new ProjectConfiguration());

            builder.ApplyConfiguration(new ProjectUserConfiguration());

            builder.ApplyConfiguration(new TaskConfiguration());

            builder.ApplyConfiguration(new MessageConfiguration());

            builder.ApplyConfiguration(new PushSubscriptionConfiguration());
        }

    }

}
