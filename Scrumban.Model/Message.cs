using System;

namespace Scrumban.Model {

    public class Message {

        public Guid Id { get; set; }

        public DateTime SendDateTime { get; set; }

        public string Text { get; set; }

        public Guid ProjectId { get; set; }

        public Guid SenderId { get; set; }

        public virtual Project Project { get; set; }

        public virtual User Sender { get; set; }

    }

}
