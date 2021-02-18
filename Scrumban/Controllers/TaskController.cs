using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Scrumban.ServiceInterface;
using Scrumban.ViewModel;

namespace Scrumban.Controllers {

    [Route("api/[controller]")]
    [Produces("application/json")]
    [ApiController]
    public class TaskController : ControllerBase {
        private readonly ITaskService taskService;

        public TaskController(ITaskService _taskService) {
            taskService = _taskService;
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> Create(TaskViewModel model) {
            if (ModelState.IsValid) {
                var result = await taskService.Create(model);

                return result != null ? (IActionResult)Ok(result)
                : BadRequest(result);
            }
            return BadRequest(ModelState);
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> Update(TaskViewModel viewModel) {
            if (ModelState.IsValid) {
                var result = await taskService.Update(viewModel);
                return result != null
                    ? (IActionResult)Ok(result)
                    : BadRequest(result);

            }
            return BadRequest(ModelState);
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> Select(TaskViewModel viewModel) {
            if (ModelState.IsValid) {
                var result = await taskService.Select(viewModel);
                return result != null
                    ? (IActionResult)Ok(result)
                    : BadRequest(result);

            }
            return BadRequest(ModelState);
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> Deselect([FromBody]string id) {
            if (ModelState.IsValid) {
                var result = await taskService.Deselect(id);
                return result != null
                    ? (IActionResult)Ok(result)
                    : BadRequest(result);

            }
            return BadRequest(ModelState);
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> Delete([FromBody]string id) {
            return Ok();
        }

    }

}
