using System;
using Scrumban.Model;

namespace Scrumban.ViewModel {

    public class MessageViewModel {
    
        public DateTime SendDateTime { get; set; }

        public string Text { get; set; }

        public Guid ProjectId { get; set; }
        public Guid SenderId { get; set; }
        public UserViewModel Sender { get; set; }

        public MessageViewModel() {

        }

        public MessageViewModel(Message m) {
            SendDateTime = m.SendDateTime;
            Text = m.Text;
            Sender = new UserViewModel() {
                Id = m.Sender.Id,
                FullName = m.Sender.FullName
            };
        }

    }

}
