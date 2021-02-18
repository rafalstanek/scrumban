using System;
using Scrumban.Model;

namespace Scrumban.RepositoryInterface {

    public interface ITaskRepository : IRepositoryAsync<Task, Guid> {
    
    }

}
