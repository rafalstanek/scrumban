using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Scrumban.ViewModel;

namespace Scrumban.ServiceInterface {
    public interface IMessageService {

        Task<MessageViewModel> Create(MessageViewModel model);

        Task<MessageViewModel> Update(MessageViewModel model);

        Task<bool> Delete(string id);

    }
}
