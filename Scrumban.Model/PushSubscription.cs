using System;

namespace Scrumban.Model {

    public class PushSubscription {

        public Guid UserId { get; set; }

        public string Endpoint { get; set; }

        public string Auth { get; set; }

        public string p256dh { get; set; }

        public virtual User User { get; set; }

    }

}
