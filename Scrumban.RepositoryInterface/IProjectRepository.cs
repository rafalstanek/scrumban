using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Scrumban.Model;

namespace Scrumban.RepositoryInterface {

    public interface IProjectRepository : IRepositoryAsync<Project, Guid> {

        System.Threading.Tasks.Task<Project> GetDetails(Guid id);

        Task<List<Project>> GetOwnedProjects(Guid ownerId);

        Task<List<Project>> GetSharedProjects(Guid ownerId);

    }

}
