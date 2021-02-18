using System;
using System.Collections.Generic;
using System.Text;
using Scrumban.Data;
using Scrumban.Model;
using Scrumban.RepositoryInterface;

namespace Scrumban.Repository {
    public class TaskRepository : RepositoryAsync<Task, Guid>, ITaskRepository {
        public TaskRepository(ScrumbanContext _context) : base(_context) {
        }
    }

}
