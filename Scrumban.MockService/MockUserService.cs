using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scrumban.Model;
using Scrumban.RepositoryInterface;
using Scrumban.ServiceInterface;
using Scrumban.ViewModel;

namespace Scrumban.MockService {
    public class MockUserService : IUserService {

        private readonly IUserRepository userRepository;

        public MockUserService(IUserRepository _userRepository) {
            userRepository = _userRepository;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt) {
            using var hmac = new HMACSHA512();
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }

        public async Task<UserViewModel> Create(UserViewModel model) {
            CreatePasswordHash(model.Password, out var passwordHash, out var passwordSalt);

            var user = new User {
                Id = Guid.NewGuid(),
                Username = model.Username,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Role = model.Role
            };

            var result = await userRepository.CreateAsync(user);
            if (result) {
                return new UserViewModel {
                    Id = user.Id,
                    Username = user.Username,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = user.Role
                };
            }
            return null;
        }

        public async Task<List<UserViewModel>> GetUsers() =>
            await System.Threading.Tasks.Task.Run(
                async () => (await userRepository.FindAll())
            .Select(u => new UserViewModel {
                Id = u.Id,
                Username = u.Username,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Role = u.Role,
            }).ToList());

        private bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt) {
            if (password == null)
                throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password))
                throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");
            if (storedHash.Length != 64)
                throw new ArgumentException("Invalid length of password hash (64 bytes expected).", "passwordHash");
            if (storedSalt.Length != 128)
                throw new ArgumentException("Invalid length of password salt (128 bytes expected).", "passwordHash");

            using (var hmac = new HMACSHA512(storedSalt)) {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++) {
                    if (computedHash[i] != storedHash[i])
                        return false;
                }
            }
            return true;
        }

        public async Task<UserViewModel> Authenticate(UserViewModel model) {
            var user = await userRepository.FindByUsernameAsync(model.Username);
            if (user == null)
                return null;

            if (!VerifyPasswordHash(model.Password, user.PasswordHash, user.PasswordSalt))
                return null;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("this is my custom Secret key for authnetication");
            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(new Claim[] {
                    new Claim(ClaimTypes.Name, user.Username)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };
            if (user.Role == "Admin") {
                tokenDescriptor.Subject.AddClaim(new Claim(ClaimTypes.Role, "Admin"));
            }

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return new UserViewModel {
                Username = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role,
                Token = tokenString,
                FullName = user.FullName
            };

        }

        public async Task<UserViewModel> ValidateToken(string token) {
            var handler = new JwtSecurityTokenHandler();
            var tkn = handler.ReadJwtToken(token);
            var nameClaim = tkn.Claims
                .SingleOrDefault(c => c.Type == "unique_name");
            if (nameClaim != null) {
                var user = await userRepository.FindByUsernameAsync(nameClaim.Value);
                return new UserViewModel {
                    Id=user.Id,
                    Username = user.Username,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = user.Role,
                    Token = token
                };
            }
            return null;
        }

        public async Task<UserViewModel> Update(UserViewModel user) {
            var dbUser = await userRepository.FindAsync(user.Id);
            if (dbUser != null) {
                dbUser.Username = user.Username;
                dbUser.FirstName = user.FirstName;
                dbUser.LastName = user.LastName;
                dbUser.Role = user.Role;
                if (!string.IsNullOrEmpty(user.Password)) {
                    CreatePasswordHash(user.Password, out var passwordHash, out var passwordSalt);
                    dbUser.PasswordHash = passwordHash;
                    dbUser.PasswordSalt = passwordSalt;
                }
                if (await userRepository.UpdateAsync(dbUser)) {
                    return user;
                }
            }
            return null;
        }

        public async Task<bool> Delete(string id) {
            var gid = Guid.Parse(id);
            var user = await userRepository.FindAsync(gid);
            return await userRepository.DeleteAsync(user);
        }

        public Task<UserViewModel> GetDetails(string id) => throw new NotImplementedException();


    }

}
