import { CreateUserUseCase } from '../user/create-user.usecase';
import { IUsersRepository } from '../../domain/user/users-repository.interface';
import { IHashProvider } from 'src/core/interfaces/hashing-provider.interface';
import { UserModel } from '../../../modules/users/dtos/user.dto';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockRepo: jest.Mocked<IUsersRepository>;
  let mockHashing: jest.Mocked<IHashProvider>;

  beforeEach(() => {
    mockRepo = {
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      createUser: jest.fn(),
    } as any;

    mockHashing = {
      hash: jest.fn(),
      compare: jest.fn(),
    } as any;

    useCase = new CreateUserUseCase(mockRepo, mockHashing);
  });

  it('✅ should create a new user successfully', async () => {
    const dto = { username: 'john', email: 'john@example.com', password: '123456' };
    mockRepo.findByEmail.mockResolvedValueOnce(null);
    mockRepo.findByUsername.mockResolvedValueOnce(null);
    mockHashing.hashPassword.mockResolvedValueOnce('hashedpassword');
    mockRepo.createUser.mockResolvedValueOnce({
      id: 1,
      ...dto,
      password: 'hashedpassword',
    } as UserModel);

    const result = await useCase.execute(dto);

    expect(result.id).toBe(1);
    expect(mockHashing.hashPassword).toHaveBeenCalledWith('123456');
    expect(mockRepo.createUser).toHaveBeenCalled();
  });

  it('❌ should throw error if email already exists', async () => {
    mockRepo.findByEmail.mockResolvedValueOnce({ id: 1 } as UserModel);
    const dto = { username: 'john', email: 'john@example.com', password: '123456' };

    await expect(useCase.execute(dto)).rejects.toThrow('Email already exists');
  });

  it('❌ should throw error if username already exists', async () => {
    mockRepo.findByEmail.mockResolvedValueOnce(null);
    mockRepo.findByUsername.mockResolvedValueOnce({ id: 1 } as UserModel);
    const dto = { username: 'john', email: 'john@example.com', password: '123456' };

    await expect(useCase.execute(dto)).rejects.toThrow('Username already exists');
  });
});
