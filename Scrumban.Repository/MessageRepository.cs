using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Scrumban.Data;
using Scrumban.Model;
using Scrumban.RepositoryInterface;

namespace Scrumban.Repository {
    public class MessageRepository : RepositoryAsync<Message, Guid>, IMessageRepository {
      
        public MessageRepository(ScrumbanContext _context) : base(_context) {
        }

        public Task<List<Message>> GetNewMessages(Guid projectId, DateTime dateTime) => throw new NotImplementedException();
    }
}
