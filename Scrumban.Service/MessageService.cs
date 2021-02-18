using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Scrumban.Model;
using Scrumban.RepositoryInterface;
using Scrumban.ServiceInterface;
using Scrumban.ViewModel;

namespace Scrumban.Service {
    public class MessageService : IMessageService {
        private readonly IMessageRepository messageRepository;
        private readonly IUserRepository userRepository;

        public MessageService(IMessageRepository _messageRepository, IUserRepository _userRepository) {
            messageRepository = _messageRepository;
            userRepository = _userRepository;
        }

        public async Task<MessageViewModel> Create(MessageViewModel model) {
            var message = new Message
            {
                Text = model.Text,
                SendDateTime = DateTime.Now,
                SenderId = model.SenderId,
                ProjectId = model.ProjectId
            };

            var result = await messageRepository.CreateAsync(message);
            if (result)
            {
                var user = await userRepository.FindAsync(message.SenderId);
                return new MessageViewModel
                {
                    Text = message.Text,
                    SendDateTime = message.SendDateTime,
                    ProjectId = message.ProjectId,
                    SenderId = message.SenderId,
                    Sender = new UserViewModel {
                        Id = user.Id,
                        FullName=user.FullName
                    }
                };
            }

            return null;
        }
        public async Task<bool> Delete(string id) {
            var gid = Guid.Parse(id);
            var user = await messageRepository.FindAsync(gid);
            return await messageRepository.DeleteAsync(user);
        }
        public Task<MessageViewModel> Update(MessageViewModel model) => throw new NotImplementedException();
    }
}
