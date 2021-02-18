using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Scrumban.ServiceInterface;
using Scrumban.ViewModel;

namespace Scrumban.Controllers {

    [Route("api/[controller]")]
    [Produces("application/json")]
    [ApiController]
    public class MessageController : ControllerBase {
        private readonly IMessageService messageService;

        public MessageController(IMessageService _messageService) {
            messageService = _messageService;
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> Send(MessageViewModel model) {
            if (ModelState.IsValid) {
                var result = await messageService.Create(model);

                return result != null ? (IActionResult)Ok(result)
                : BadRequest(result);
            }
            return BadRequest(ModelState);
        }


    }

}
