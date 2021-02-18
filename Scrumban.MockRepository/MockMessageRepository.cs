using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Scrumban.Model;
using Scrumban.RepositoryInterface;

namespace Scrumban.MockRepository {

    public class MockMessageRepository : MockRepositoryAsync<Message, Guid>, IMessageRepository {

        public MockMessageRepository() {

        }

        public async Task<List<Message>> GetNewMessages(Guid projectId, DateTime dateTime) =>
          await System.Threading.Tasks.Task.Run(() => Objects
            .Where(m => m.ProjectId == projectId)
            .Where(m => m.SendDateTime > dateTime)
            .ToList());

    }

}
