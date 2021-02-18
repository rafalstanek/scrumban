using System;
using Scrumban.Model;
using Scrumban.RepositoryInterface;

namespace Scrumban.MockRepository {

    public class MockTaskRepository : MockRepositoryAsync<Task, Guid>, ITaskRepository {

        public MockTaskRepository() {

        }

    }

}
