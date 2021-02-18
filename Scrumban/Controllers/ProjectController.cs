using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Scrumban.ServiceInterface;
using Scrumban.ViewModel;

namespace Scrumban.Controllers {

    [Route("api/[controller]")]
    [Produces("application/json")]
    [ApiController]
    public class ProjectController : ControllerBase {
        private readonly IProjectService projectService;

        public ProjectController(IProjectService _projectService) {
            projectService = _projectService;
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> Create(ProjectViewModel model) {
            if (ModelState.IsValid) {
                var result = await projectService.Create(new ProjectViewModel {
                    Name = model.Name,
                    Owner = new UserViewModel {
                        Username = User.Identity.Name
                    },
                    Finished = model.Finished
                });

                return result != null ? (IActionResult)Ok(result)
                : BadRequest(result);
            }
            return BadRequest(ModelState);
        }

        [Authorize]
        [HttpGet("[action]")]
        public async Task<IActionResult> GetProjects() {
            return Ok(await projectService.GetProjects());
        }

        [Authorize]
        [HttpGet("[action]")]
        public async Task<IActionResult> GetOwnedProjects() {
            return Ok(await projectService.GetOwnedProjects(User.Identity.Name));
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> Update(ProjectViewModel viewModel) {
            if (ModelState.IsValid) {
                var result = await projectService.Update(viewModel);
                return result != null
                    ? (IActionResult)Ok(result)
                    : BadRequest(result);

            }
            return BadRequest(ModelState);
        }


        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> Delete([FromBody]string id) {
            var result = await projectService.Delete(id);
            return result ? (IActionResult)Ok() : BadRequest();
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> GetDetails([FromBody] string id) {
            return Ok(await projectService.GetDetails(id));
        }


        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> AddUser(ProjectUserViewModel viewModel) {
            return Ok(await projectService.AddUser(viewModel));
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteUser(ProjectUserViewModel viewModel) {
            return Ok(await projectService.DeleteUser(viewModel));
        }

    }

}
