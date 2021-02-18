using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Scrumban.Model;
using Scrumban.RepositoryInterface;

namespace Scrumban.MockRepository {

    public class MockProjectRepository : MockRepositoryAsync<Project, Guid>, IProjectRepository {

        public MockProjectRepository() {

        }

        public async Task<Project> GetDetails(Guid id) {
            var project = await FindAsync(id);
            return project;
        }

        public Task<List<Project>> GetOwnedProjects(Guid ownerId) => throw new NotImplementedException();
    }

}
