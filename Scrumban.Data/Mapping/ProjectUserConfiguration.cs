﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Scrumban.Model;

namespace Scrumban.Data.Mapping {

    public class ProjectUserConfiguration : IEntityTypeConfiguration<ProjectUser> {

        public void Configure(EntityTypeBuilder<ProjectUser> builder) {
            builder.HasKey(pu => new { pu.ProjectId, pu.UserId });

            builder.HasOne(pu => pu.Project)
                .WithMany(p => p.ProjectUsers)
                .HasForeignKey(pu => pu.ProjectId);

            builder.HasOne(pu => pu.User)
                .WithMany(u => u.ProjectsUsers)
                .HasForeignKey(pu => pu.UserId);
                
        }

    }

}
