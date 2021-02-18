using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Scrumban.Data;
using Scrumban.Model;
using Scrumban.RepositoryInterface;

namespace Scrumban.Repository {
    public class ProjectRepository : RepositoryAsync<Project, Guid>, IProjectRepository {
        public ProjectRepository(ScrumbanContext _context) : base(_context) {
        }

        public override async Task<bool> CreateAsync(Project project) {
            try {
                return await base.CreateAsync(project);
            }
            catch (DbUpdateException) {
                throw;
            }
        }

        public Task<Project> GetDetails(Guid id) => throw new NotImplementedException();

        public async Task<List<Project>> GetOwnedProjects(Guid ownerId) =>
            await dbSet.Where(p => p.OwnerId.Equals(ownerId)).ToListAsync();

        public async Task<List<Project>> GetSharedProjects(Guid ownerId) {
            var projects = await dbSet.Include(p => p.ProjectUsers)
                .Where(p => p.ProjectUsers.Any(pu => pu.UserId.Equals(ownerId))).ToListAsync();
            return projects;
        }

    }
}
