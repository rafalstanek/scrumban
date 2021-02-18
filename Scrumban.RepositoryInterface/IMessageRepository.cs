using System;
using System.Collections.Generic;
using Scrumban.Model;

namespace Scrumban.RepositoryInterface {

    public interface IMessageRepository : IRepositoryAsync<Message, Guid> {

        System.Threading.Tasks.Task<List<Message>> GetNewMessages(Guid projectId, DateTime dateTime);

    }

}
