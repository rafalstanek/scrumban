using System;
using Scrumban.Data;
using Scrumban.Model;
using Scrumban.RepositoryInterface;

namespace Scrumban.Repository {
    public class ProjectUserRepository : RepositoryAsync<ProjectUser, Guid>, IProjectUserRepository {
        
        public ProjectUserRepository(ScrumbanContext _context) : base(_context) {
        
        }

    }
}
