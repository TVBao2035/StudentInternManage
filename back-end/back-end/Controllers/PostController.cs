using back_end.DTO;
using back_end.Models.Request;
using back_end.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [Route("[controller]")]
    [ApiController]

    public class PostController : ControllerBase
    {
        private IPostService _postService;

        public PostController(IPostService postService)
        {
            _postService = postService;
        }
        [HttpPost]
        [Route("Search")]
        [AllowAnonymous]
        public async Task<IActionResult> Search([FromBody]SearchRequest request)
        {
            var data = await _postService.Search(request);
            return Ok(data);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var data = await _postService.GetAll();
            return Ok(data);
        }

        [HttpPost]
        [Authorize(Roles = "business")]
        public async Task<IActionResult> Create([FromBody] PostDTO post)
        {
            var data = await _postService.Create(post);
            return Ok(data);
        }

        [HttpPut]
        [Authorize(Roles = "business")]
        public async Task<IActionResult> Update([FromBody] PostDTO post)
        {
            var data = await _postService.Update(post);
            return Ok(data);
        }
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(Guid id)
        {
            var data = await _postService.GetById(id);
            return Ok(data);
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "business")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var data = await _postService.Delete(id);
            return Ok(data);
        }
    }
}
