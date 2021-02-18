using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Scrumban.Exceptions;
using Scrumban.ServiceInterface;
using Scrumban.ViewModel;

namespace Scrumban.Controllers {

    [Route("api/[controller]")]
    [Produces("application/json")]
    [ApiController]
    public class UserController : ControllerBase {

        private readonly IUserService userService;

        public UserController(IUserService _userService) {
            userService = _userService;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Create(UserViewModel user) {
            try {
                if (ModelState.IsValid) {
                    var result = await userService.Create(new UserViewModel {
                        Password = user.Password,
                        Username = user.Username,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Role = user.Role
                    });
                    return result != null ? (IActionResult)Ok(result)
                    : BadRequest(result);
                }
            }
            catch (UsernameTakenException) {
                ModelState.AddModelError("username", "Username already taken");
            }

            return BadRequest(ModelState);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Authenticate(UserViewModel user) {

            if (ModelState.IsValid) {
                var model = await userService.Authenticate(user);
                if (model != null)
                    return Ok(model);
            }

            return BadRequest();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> ValidateToken([FromBody]string token) {
            var model = await userService.ValidateToken(token);
            if (model != null) {
                return Ok(model);
            }
            else return BadRequest(model);
        }

        [Authorize]
        [HttpGet("[action]")]
        public async Task<IActionResult> GetUsers() {
            return Ok(await userService.GetUsers());
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> Update(UserViewModel viewModel) {
            if (ModelState.IsValid) {
                try {
                    var result = await userService.Update(viewModel);
                    return result != null
                        ? (IActionResult)Ok(result)
                        : BadRequest(result);
                }
                catch (UsernameTakenException) {
                    ModelState.AddModelError("username", "Username already taken");
                }
            }
            return BadRequest(ModelState);
        }


        [Authorize]
        [HttpPost("[action]")]
        public async Task<IActionResult> Delete([FromBody]string id) {
            var result = await userService.Delete(id);
            return result ? (IActionResult)Ok() : BadRequest();
        }

    }

}

