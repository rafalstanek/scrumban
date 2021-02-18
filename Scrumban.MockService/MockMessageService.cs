using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Scrumban.RepositoryInterface;
using Scrumban.ServiceInterface;
using Scrumban.ViewModel;

namespace Scrumban.MockService {
    public class MockMessageService : IMessageService {
        private readonly IMessageRepository messageRepository;

        public MockMessageService(IMessageRepository _messageRepository) {
            messageRepository = _messageRepository;
        }

        public Task<MessageViewModel> Create(MessageViewModel model) => throw new NotImplementedException();
        public Task<MessageViewModel> Create(MessageViewModel model, Guid projectId) => throw new NotImplementedException();
        public Task<bool> Delete(string id) => throw new NotImplementedException();
        public Task<MessageViewModel> Update(MessageViewModel model) => throw new NotImplementedException();
    }
}
